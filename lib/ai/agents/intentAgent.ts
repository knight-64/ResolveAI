import { AIService } from '../groq';
import { dbStore } from '../../db/store';
import { IssueCategory, AgentName } from '../../../src/types';

export interface IntentAnalysisResult {
  intent: IssueCategory;
  confidence: number;
  extractedEntities: {
    transactionId?: string;
    amount?: number;
    merchant?: string;
    keywords?: string[];
  };
  recommendedAgent: AgentName;
  rationale: string;
}

const INTENT_SYSTEM_PROMPT = `
You are the ResolveAI Intent Agent for Paytm issue resolution.
Your responsibility:
1. Classify the user query into exactly ONE category:
   - PAYMENT_FAILED
   - PAYMENT_PENDING
   - PAYMENT_REVERSED
   - REFUND
   - TRANSACTION_STATUS
   - ACCOUNT_ISSUE
   - FRAUD_ALERT
   - KYC
   - GENERAL_SUPPORT
2. Extract entities:
   - transactionId (e.g. TXN1001, TXN1002, TXN1003, TXN1004, TXN1005, TXN1006, TXN1007, TXN1008)
   - amount (numeric value in INR if mentioned, e.g. 499, 1250, 1999, 850, 3200, 150)
   - merchant (e.g. Zomato, Reliance, Uber, Flipkart, Blinkit, BESCOM, Chai Point, Delhi Metro)
3. Assign the target specialized agent:
   - 'Transaction Agent' (for PAYMENT_FAILED, PAYMENT_PENDING, PAYMENT_REVERSED, TRANSACTION_STATUS)
   - 'Refund Agent' (for REFUND)
   - 'Security/Fraud Agent' (for FRAUD_ALERT, suspicious activity)
   - 'General Support Agent' (for KYC, ACCOUNT_ISSUE, GENERAL_SUPPORT)
4. Score confidence between 0.00 and 1.00.

Return strictly valid JSON:
{
  "intent": "PAYMENT_PENDING",
  "confidence": 0.95,
  "extractedEntities": {
    "transactionId": "TXN1002",
    "amount": 499,
    "merchant": "Example Store"
  },
  "recommendedAgent": "Transaction Agent",
  "rationale": "User inquired about an in-progress ₹499 transaction."
}
`;

export class IntentAgent {
  static async analyze(query: string): Promise<IntentAnalysisResult> {
    const qLower = query.toLowerCase();

    // High accuracy pattern extraction for all transactions
    const txnMatch = query.match(/TXN\d{3,5}/i);
    const amountMatch = query.match(/(?:₹|rs\.?|inr)?\s*(\d+(?:,\d+)*(?:\.\d+)?)/i);
    let extractedTxnId: string | undefined = txnMatch ? txnMatch[0].toUpperCase() : undefined;
    const extractedAmount =
      amountMatch && Number(amountMatch[1].replace(/,/g, '')) > 0
        ? Number(amountMatch[1].replace(/,/g, ''))
        : undefined;

    // Detect merchant mentions
    let extractedMerchant: string | undefined;
    const allTxns = dbStore.getAllTransactions();

    for (const t of allTxns) {
      const merchantWords = t.merchant.toLowerCase().split(/[\s/]+/);
      for (const word of merchantWords) {
        if (word.length >= 4 && qLower.includes(word)) {
          extractedMerchant = t.merchant;
          if (!extractedTxnId) extractedTxnId = t.id;
          break;
        }
      }
      if (extractedMerchant) break;
    }

    // If still no transaction ID, match by exact known amount
    if (!extractedTxnId && extractedAmount) {
      const matchedTxn = allTxns.find((t) => t.amount === extractedAmount);
      if (matchedTxn) {
        extractedTxnId = matchedTxn.id;
        extractedMerchant = matchedTxn.merchant;
      }
    }

    // Try LLM Intent Analysis
    try {
      const { content } = await AIService.complete({
        systemPrompt: INTENT_SYSTEM_PROMPT,
        userPrompt: query,
        temperature: 0.1,
        jsonMode: true,
      });

      if (content) {
        const cleaned = content.replace(/```json/g, '').replace(/```/g, '').trim();
        const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
        const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : cleaned);
        if (parsed.intent && parsed.recommendedAgent) {
          return {
            intent: parsed.intent as IssueCategory,
            confidence: typeof parsed.confidence === 'number' ? parsed.confidence : 0.94,
            extractedEntities: {
              transactionId: parsed.extractedEntities?.transactionId || extractedTxnId,
              amount: parsed.extractedEntities?.amount || extractedAmount,
              merchant: parsed.extractedEntities?.merchant || extractedMerchant,
            },
            recommendedAgent: parsed.recommendedAgent as AgentName,
            rationale: parsed.rationale || 'Identified via semantic classification.',
          };
        }
      }
    } catch (err) {
      console.warn('[IntentAgent] LLM parsing fell back to deterministic rules:', err);
    }

    // Deterministic Rule Engine
    let intent: IssueCategory = 'GENERAL_SUPPORT';
    let recommendedAgent: AgentName = 'General Support Agent';
    let confidence = 0.92;
    let rationale = 'Identified via semantic keywords.';

    // Check for multi-payment query or complaints about same answer / ledger query
    if (
      qLower.includes('every payment') ||
      qLower.includes('same answer') ||
      qLower.includes('all payment') ||
      qLower.includes('all transactions') ||
      qLower.includes('my payments') ||
      qLower.includes('transaction history') ||
      qLower.includes('recent transactions')
    ) {
      intent = 'TRANSACTION_STATUS';
      recommendedAgent = 'Transaction Agent';
      confidence = 0.98;
      rationale = 'User inquired about all account payments or transaction history.';
    } else if (
      qLower.includes('unauthorized') ||
      qLower.includes('fraud') ||
      qLower.includes('scam') ||
      qLower.includes('hacked') ||
      qLower.includes('stolen') ||
      qLower.includes('suspicious') ||
      qLower.includes('did not make')
    ) {
      intent = 'FRAUD_ALERT';
      recommendedAgent = 'Security/Fraud Agent';
      confidence = 0.98;
      rationale = 'Urgent security dispute keyword detected. Flagged for risk check and human escalation.';
    } else if (qLower.includes('refund') || qLower.includes('return') || qLower.includes('money back')) {
      intent = 'REFUND';
      recommendedAgent = 'Refund Agent';
      confidence = 0.95;
      rationale = 'Refund inquiry detected regarding returned item or transaction credit.';
    } else if (qLower.includes('pending') || qLower.includes('processing') || qLower.includes('not completed')) {
      intent = 'PAYMENT_PENDING';
      recommendedAgent = 'Transaction Agent';
      confidence = 0.96;
      rationale = 'Customer reported a transaction currently pending bank clearance.';
    } else if (
      qLower.includes('failed') ||
      qLower.includes('declined') ||
      qLower.includes('debited but not received') ||
      qLower.includes('money deducted')
    ) {
      intent = 'PAYMENT_FAILED';
      recommendedAgent = 'Transaction Agent';
      confidence = 0.94;
      rationale = 'Payment failure report with possible debit at issuing bank.';
    } else if (qLower.includes('reversed') || qLower.includes('auto-reverse')) {
      intent = 'PAYMENT_REVERSED';
      recommendedAgent = 'Transaction Agent';
      confidence = 0.93;
      rationale = 'Payment reversal verification requested.';
    } else if (
      qLower.includes('status') ||
      qLower.includes('receipt') ||
      qLower.includes('history') ||
      qLower.includes('payment') ||
      extractedTxnId ||
      extractedMerchant
    ) {
      intent = 'TRANSACTION_STATUS';
      recommendedAgent = 'Transaction Agent';
      confidence = 0.91;
      rationale = 'Direct transaction status check requested.';
    } else if (
      qLower.includes('kyc') ||
      qLower.includes('aadhaar') ||
      qLower.includes('pan') ||
      qLower.includes('limit')
    ) {
      intent = 'KYC';
      recommendedAgent = 'General Support Agent';
      confidence = 0.93;
      rationale = 'Customer account KYC and wallet verification assistance.';
    }

    return {
      intent,
      confidence,
      extractedEntities: {
        transactionId: extractedTxnId,
        amount: extractedAmount,
        merchant: extractedMerchant,
      },
      recommendedAgent,
      rationale,
    };
  }
}
