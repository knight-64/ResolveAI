import { AIService } from '../groq';
import { ResolutionCardData, ToolInvocation } from '../../../src/types';

export interface GeneralResolutionResult {
  agentName: 'General Support Agent';
  message: string;
  toolsUsed: ToolInvocation[];
  resolutionCard?: ResolutionCardData;
  isEscalated: boolean;
}

export class GeneralSupportAgent {
  static async resolve(params: {
    query: string;
    intent: string;
  }): Promise<GeneralResolutionResult> {
    const toolsUsed: ToolInvocation[] = [];
    const qLower = params.query.toLowerCase();

    // KYC specific support
    if (params.intent === 'KYC' || qLower.includes('kyc') || qLower.includes('aadhaar')) {
      const answer = `To complete or upgrade your Paytm KYC:\n1. Open your Paytm Profile and tap on 'KYC Verification'.\n2. Enter your 12-digit Aadhaar Number and authenticate with the OTP sent to your Aadhaar-registered mobile.\n3. Complete quick 2-minute Video KYC with an authorized Paytm representative.\n\nOnce verified, your monthly wallet limit will upgrade to ₹1,00,000 with zero transaction fees on bank transfers.`;

      const resolutionCard: ResolutionCardData = {
        title: 'Account Verification: KYC Assistance',
        category: 'KYC',
        status: 'RESOLVED',
        resolutionSummary: 'Step-by-step guidance provided for Aadhaar OTP and Video KYC verification.',
        keyDetails: [
          { label: 'Current Account Status', value: 'Minimum KYC Active' },
          { label: 'Upgrade Target', value: 'Full KYC (No Wallet Limits)' },
          { label: 'Documents Needed', value: 'Aadhaar Card + PAN Card' },
          { label: 'Verification Method', value: 'Paperless Video KYC (2 mins)' },
        ],
        suggestedActions: [
          { label: 'Start Video KYC (Simulated)', actionType: 'view_transaction' },
          { label: 'Talk to KYC Specialist', actionType: 'escalate_human' },
        ],
      };

      return {
        agentName: 'General Support Agent',
        message: answer,
        toolsUsed,
        resolutionCard,
        isEscalated: false,
      };
    }

    // Default General AI response
    let answer = `Thank you for reaching out to ResolveAI. I can assist you with payment status, failed or pending transactions, refunds, KYC, or safety disputes. If you have a specific transaction query, please share the Transaction ID or amount and merchant details.`;

    try {
      const aiRes = await AIService.complete({
        systemPrompt: `You are ResolveAI General Support Agent for Paytm Build for India AI Hackathon. Answer the user courteously, concisely, and accurately in 2-3 sentences.`,
        userPrompt: params.query,
        temperature: 0.3,
      });
      if (aiRes.content) answer = aiRes.content.trim();
    } catch {
      // fallback preserved
    }

    const resolutionCard: ResolutionCardData = {
      title: 'General Inquiries & Account Assistance',
      category: 'GENERAL_SUPPORT',
      status: 'RESOLVED',
      resolutionSummary: 'General support query answered by the General Support Agent.',
      keyDetails: [
        { label: 'Assisted By', value: 'General Support AI Agent' },
        { label: 'Support Available', value: '24x7 Multi-Agent Automated Resolution' },
      ],
      suggestedActions: [
        { label: 'Check Recent Transactions', actionType: 'view_transaction' },
        { label: 'Talk to Human Care', actionType: 'escalate_human' },
      ],
    };

    return {
      agentName: 'General Support Agent',
      message: answer,
      toolsUsed,
      resolutionCard,
      isEscalated: false,
    };
  }
}
