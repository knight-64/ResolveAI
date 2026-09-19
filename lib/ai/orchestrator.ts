import { IntentAgent, IntentAnalysisResult } from './agents/intentAgent';
import { TransactionAgent } from './agents/transactionAgent';
import { RefundAgent } from './agents/refundAgent';
import { SecurityAgent } from './agents/securityAgent';
import { GeneralSupportAgent } from './agents/generalAgent';
import { dbStore } from '../db/store';
import {
  AgentName,
  ExecutionStep,
  ResolutionCardData,
  ToolInvocation,
  IssueCategory,
  ResolutionStatus,
} from '../../src/types';

export interface OrchestrationResult {
  message: string;
  agentName: AgentName;
  intent: IssueCategory;
  confidence: number;
  executionSteps: ExecutionStep[];
  toolsUsed: ToolInvocation[];
  resolutionCard?: ResolutionCardData;
  isEscalated: boolean;
  latencyMs: number;
}

export class MultiAgentOrchestrator {
  private static CONFIDENCE_THRESHOLD = 0.65;

  static async handleUserQuery(query: string): Promise<OrchestrationResult> {
    const startTime = Date.now();
    const executionSteps: ExecutionStep[] = [];
    let stepCount = 1;

    // Step 1: Intake & Intent Analysis
    executionSteps.push({
      id: `step-${stepCount++}`,
      stepNumber: 1,
      agentName: 'Intent Agent',
      action: 'Analyzing user query & extracting entities',
      details: `Input: "${query.substring(0, 60)}${query.length > 60 ? '...' : ''}"`,
      status: 'completed',
      timestamp: new Date().toISOString(),
    });

    const intentResult: IntentAnalysisResult = await IntentAgent.analyze(query);

    // Step 2: Intent Classification Output
    executionSteps.push({
      id: `step-${stepCount++}`,
      stepNumber: 2,
      agentName: 'Intent Agent',
      action: `Classified as ${intentResult.intent} (${Math.round(intentResult.confidence * 100)}% confidence)`,
      details: `Target: ${intentResult.recommendedAgent}. Entities: ${JSON.stringify(intentResult.extractedEntities)}`,
      status: 'completed',
      timestamp: new Date().toISOString(),
    });

    // Step 3: Confidence Check
    if (intentResult.confidence < this.CONFIDENCE_THRESHOLD) {
      executionSteps.push({
        id: `step-${stepCount++}`,
        stepNumber: 3,
        agentName: 'Intent Agent',
        action: 'Low confidence detected (< 65%) - Initiating clarifying guidance',
        status: 'completed',
        timestamp: new Date().toISOString(),
      });

      const message = `I noticed your query might require additional details. Could you please specify your 12-digit UPI reference, Transaction ID (e.g., TXN1002), or choose from our quick support options below?`;
      const latencyMs = Date.now() - startTime;

      dbStore.logExecution({
        query,
        intent: intentResult.intent,
        agent: 'Intent Agent',
        toolsCalled: [],
        confidence: intentResult.confidence,
        status: 'PENDING_USER_ACTION',
        latencyMs,
      });

      return {
        message,
        agentName: 'Intent Agent',
        intent: intentResult.intent,
        confidence: intentResult.confidence,
        executionSteps,
        toolsUsed: [],
        isEscalated: false,
        latencyMs,
      };
    }

    // Step 4: Routing to Specialized Agent
    executionSteps.push({
      id: `step-${stepCount++}`,
      stepNumber: 4,
      agentName: 'Multi-Agent Orchestrator',
      action: `Routing context to ${intentResult.recommendedAgent}`,
      details: `Dispatched with extracted entities and user session context.`,
      status: 'completed',
      timestamp: new Date().toISOString(),
    });

    let finalMessage = '';
    let toolsUsed: ToolInvocation[] = [];
    let resolutionCard: ResolutionCardData | undefined;
    let isEscalated = false;

    // Step 5: Execute specialized agent
    if (intentResult.recommendedAgent === 'Transaction Agent') {
      const res = await TransactionAgent.resolve({
        query,
        intent: intentResult.intent,
        transactionId: intentResult.extractedEntities.transactionId,
        amount: intentResult.extractedEntities.amount,
        merchant: intentResult.extractedEntities.merchant,
      });
      finalMessage = res.message;
      toolsUsed = res.toolsUsed;
      resolutionCard = res.resolutionCard;
      isEscalated = res.isEscalated;
    } else if (intentResult.recommendedAgent === 'Refund Agent') {
      const res = await RefundAgent.resolve({
        query,
        transactionId: intentResult.extractedEntities.transactionId,
        amount: intentResult.extractedEntities.amount,
        merchant: intentResult.extractedEntities.merchant,
      });
      finalMessage = res.message;
      toolsUsed = res.toolsUsed;
      resolutionCard = res.resolutionCard;
      isEscalated = res.isEscalated;
    } else if (intentResult.recommendedAgent === 'Security/Fraud Agent') {
      const res = await SecurityAgent.resolve({
        query,
        transactionId: intentResult.extractedEntities.transactionId,
        amount: intentResult.extractedEntities.amount,
      });
      finalMessage = res.message;
      toolsUsed = res.toolsUsed;
      resolutionCard = res.resolutionCard;
      isEscalated = res.isEscalated;
    } else {
      const res = await GeneralSupportAgent.resolve({
        query,
        intent: intentResult.intent,
      });
      finalMessage = res.message;
      toolsUsed = res.toolsUsed;
      resolutionCard = res.resolutionCard;
      isEscalated = res.isEscalated;
    }

    // Record tool invocations in steps
    for (const tool of toolsUsed) {
      executionSteps.push({
        id: `step-${stepCount++}`,
        stepNumber: stepCount - 1,
        agentName: intentResult.recommendedAgent,
        action: `Invoked Tool: ${tool.toolName}()`,
        details: `Parameters: ${JSON.stringify(tool.params)} → Result: ${JSON.stringify(tool.result).substring(0, 90)}...`,
        status: tool.status === 'SUCCESS' ? 'completed' : 'failed',
        timestamp: new Date().toISOString(),
      });
    }

    // Step 6: Resolution Generation
    const resolutionStatus: ResolutionStatus = isEscalated ? 'ESCALATED' : 'RESOLVED';
    executionSteps.push({
      id: `step-${stepCount++}`,
      stepNumber: stepCount - 1,
      agentName: intentResult.recommendedAgent,
      action: `Synthesized Final Resolution (${resolutionStatus})`,
      details: `Generated structured response card with proactive customer actions.`,
      status: 'completed',
      timestamp: new Date().toISOString(),
    });

    const latencyMs = Date.now() - startTime;

    // Log execution in system database
    dbStore.logExecution({
      query,
      intent: intentResult.intent,
      agent: intentResult.recommendedAgent,
      toolsCalled: toolsUsed.map((t) => t.toolName),
      confidence: intentResult.confidence,
      status: resolutionStatus,
      latencyMs,
    });

    return {
      message: finalMessage,
      agentName: intentResult.recommendedAgent,
      intent: intentResult.intent,
      confidence: intentResult.confidence,
      executionSteps,
      toolsUsed,
      resolutionCard,
      isEscalated,
      latencyMs,
    };
  }
}
