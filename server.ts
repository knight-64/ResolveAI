import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { MultiAgentOrchestrator } from './lib/ai/orchestrator';
import { dbStore } from './lib/db/store';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // Body parsers
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // API Routes FIRST

  // Health check
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({
      status: 'ok',
      service: 'ResolveAI Multi-Agent Resolution Platform',
      hackathon: 'Paytm Build for India AI Hackathon',
      activeAgents: [
        'Intent Agent',
        'Transaction Agent',
        'Refund Agent',
        'Security/Fraud Agent',
        'General Support Agent',
      ],
      timestamp: new Date().toISOString(),
    });
  });

  // POST /api/chat - Central AI Orchestration Endpoint
  app.post('/api/chat', async (req: Request, res: Response) => {
    try {
      const { query } = req.body;
      if (!query || typeof query !== 'string' || !query.trim()) {
        res.status(400).json({ error: 'Query parameter is required' });
        return;
      }

      const result = await MultiAgentOrchestrator.handleUserQuery(query.trim());
      res.json(result);
    } catch (err: unknown) {
      console.error('[API /api/chat Error]:', err);
      res.status(500).json({
        error: 'An unexpected error occurred during multi-agent orchestration.',
        fallbackMessage:
          'I encountered a temporary issue checking our payment service. Please try again or create a support ticket.',
      });
    }
  });

  // POST /api/resolve - Manual or programmatic resolution update
  app.post('/api/resolve', (req: Request, res: Response) => {
    const { ticketId, status } = req.body;
    if (ticketId && status) {
      const updated = dbStore.updateTicketStatus(ticketId, status);
      res.json({ success: true, ticket: updated });
      return;
    }
    res.json({ success: true, message: 'Resolution recorded' });
  });

  // GET /api/transactions - All simulated transactions
  app.get('/api/transactions', (req: Request, res: Response) => {
    const txns = dbStore.getAllTransactions();
    res.json(txns);
  });

  // GET /api/transactions/:id - Fetch single transaction
  app.get('/api/transactions/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const txn = dbStore.getTransactionById(id);
    if (!txn) {
      res.status(404).json({ error: `Transaction ${id} not found` });
      return;
    }
    res.json(txn);
  });

  // GET /api/refunds/:id - Fetch refund record
  app.get('/api/refunds/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const refund = dbStore.getRefundByTransactionId(id);
    if (!refund) {
      res.status(404).json({ error: `No refund found for reference ${id}` });
      return;
    }
    res.json(refund);
  });

  // POST /api/support-ticket - Create human support ticket
  app.post(['/api/support-ticket', '/api/tickets'], (req: Request, res: Response) => {
    const { issue, category, priority, transactionId } = req.body;
    if (!issue) {
      res.status(400).json({ error: 'Issue description is required' });
      return;
    }
    const ticket = dbStore.createTicket({
      issue,
      category,
      priority,
      transactionId,
    });
    res.status(201).json(ticket);
  });

  // GET /api/support-tickets - List tickets
  app.get(['/api/support-tickets', '/api/tickets'], (req: Request, res: Response) => {
    const tickets = dbStore.getAllTickets();
    res.json(tickets);
  });

  // GET /api/dashboard - Admin Dashboard metrics
  app.get('/api/dashboard', (req: Request, res: Response) => {
    const stats = dbStore.getDashboardStats();
    res.json(stats);
  });

  // GET /api/demo/scenarios - Hackathon Live Demo scenarios
  app.get('/api/demo/scenarios', (req: Request, res: Response) => {
    res.json([
      {
        id: 'demo-1',
        title: 'Demo 1: Pending Payment (₹499)',
        prompt: 'My payment of ₹499 is still pending.',
        expectedIntent: 'PAYMENT_PENDING',
        expectedAgent: 'Transaction Agent',
        expectedTool: 'getTransactionStatus(TXN1002)',
        description: 'Demonstrates intent classification, entity extraction (₹499 -> TXN1002), ledger check, and clearing timeline explanation.',
      },
      {
        id: 'demo-2',
        title: 'Demo 2: Unauthorized Fraud Alert',
        prompt: 'I think someone made an unauthorized transaction of ₹5000.',
        expectedIntent: 'FRAUD_ALERT',
        expectedAgent: 'Security/Fraud Agent',
        expectedTool: 'checkFraudRisk() + createSupportTicket()',
        description: 'Demonstrates critical risk scoring (92/100), automated account safety protocol, and instant human escalation ticket generation.',
      },
      {
        id: 'demo-3',
        title: 'Demo 3: Missing Refund Status',
        prompt: 'My refund for Flipkart TXN1004 has not arrived yet.',
        expectedIntent: 'REFUND',
        expectedAgent: 'Refund Agent',
        expectedTool: 'getRefundStatus(TXN1004)',
        description: 'Demonstrates bank settlement reconciliation, retrieval reference number (RRN) verification, and credit destination proof.',
      },
      {
        id: 'demo-4',
        title: 'Demo 4: Failed Uber Ride Payment',
        prompt: 'Money was deducted for Uber ride TXN1003 but driver says unpaid.',
        expectedIntent: 'PAYMENT_FAILED',
        expectedAgent: 'Transaction Agent',
        expectedTool: 'getTransactionStatus(TXN1003)',
        description: 'Handles bank timeout (U30 switch timeout), auto-reversal status, and reassurance on fund recovery.',
      },
      {
        id: 'demo-5',
        title: 'Demo 5: Account KYC Verification',
        prompt: 'How do I complete my Video KYC to upgrade my wallet limit?',
        expectedIntent: 'KYC',
        expectedAgent: 'General Support Agent',
        expectedTool: 'None (Direct Guidance)',
        description: 'Demonstrates general support handling without unnecessary tool bloat, answering with Aadhaar OTP guidelines.',
      },
    ]);
  });

  // POST /api/reset-demo - Reset data
  app.post('/api/reset-demo', (req: Request, res: Response) => {
    dbStore.resetDemoData();
    res.json({ success: true, message: 'Simulated demo state reset successfully' });
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const server = app.listen(PORT, () => {
    console.log(`ResolveAI Multi-Agent Server running on http://0.0.0.0:${PORT}`);
  });

  server.on('error', (err: unknown) => {
    console.error('Server listen error:', err);
  });
}

startServer().catch((err) => {
  console.error('Fatal error starting server:', err);
  process.exit(1);
});
