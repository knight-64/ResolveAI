import express from "express";
import { MultiAgentOrchestrator } from "../lib/ai/orchestrator";
import { dbStore } from "../lib/db/store";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "ResolveAI Multi-Agent Resolution Platform",
    hackathon: "Paytm Build for India AI Hackathon",
    activeAgents: [
      "Intent Agent",
      "Transaction Agent",
      "Refund Agent",
      "Security/Fraud Agent",
      "General Support Agent",
    ],
    timestamp: new Date().toISOString(),
  });
});

app.post("/api/chat", async (req, res) => {
  try {
    const { query } = req.body;

    if (!query || typeof query !== "string" || !query.trim()) {
      return res.status(400).json({
        error: "Query parameter is required",
      });
    }

    const result =
      await MultiAgentOrchestrator.handleUserQuery(query.trim());

    return res.json(result);
  } catch (error) {
    console.error("Chat API error:", error);

    return res.status(500).json({
      error: "An unexpected error occurred.",
      fallbackMessage:
        "Please try again or create a support ticket.",
    });
  }
});

app.post("/api/resolve", (req, res) => {
  const { ticketId, status } = req.body;

  if (ticketId && status) {
    const updated = dbStore.updateTicketStatus(ticketId, status);

    return res.json({
      success: true,
      ticket: updated,
    });
  }

  return res.json({
    success: true,
    message: "Resolution recorded",
  });
});

app.get("/api/transactions", (_req, res) => {
  res.json(dbStore.getAllTransactions());
});

app.get("/api/transactions/:id", (req, res) => {
  const txn = dbStore.getTransactionById(req.params.id);

  if (!txn) {
    return res.status(404).json({
      error: `Transaction ${req.params.id} not found`,
    });
  }

  return res.json(txn);
});

app.get("/api/refunds/:id", (req, res) => {
  const refund = dbStore.getRefundByTransactionId(req.params.id);

  if (!refund) {
    return res.status(404).json({
      error: `No refund found for reference ${req.params.id}`,
    });
  }

  return res.json(refund);
});

app.post(
  ["/api/support-ticket", "/api/tickets"],
  (req, res) => {
    const {
      issue,
      category,
      priority,
      transactionId,
    } = req.body;

    if (!issue) {
      return res.status(400).json({
        error: "Issue description is required",
      });
    }

    const ticket = dbStore.createTicket({
      issue,
      category,
      priority,
      transactionId,
    });

    return res.status(201).json(ticket);
  }
);

app.get(
  ["/api/support-tickets", "/api/tickets"],
  (_req, res) => {
    res.json(dbStore.getAllTickets());
  }
);

app.get("/api/dashboard", (_req, res) => {
  res.json(dbStore.getDashboardStats());
});

app.post("/api/reset-demo", (_req, res) => {
  dbStore.resetDemoData();

  res.json({
    success: true,
    message: "Simulated demo state reset successfully",
  });
});

export default app;