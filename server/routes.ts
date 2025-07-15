import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertNewsletterSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Newsletter signup endpoint
  app.post("/api/newsletter", async (req, res) => {
    try {
      const validation = insertNewsletterSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({
          error: "Invalid email format",
          details: validation.error.errors
        });
      }

      const newsletter = await storage.createNewsletter(validation.data);
      res.json({ success: true, newsletter });
    } catch (error: any) {
      if (error.code === '23505') { // PostgreSQL unique constraint error
        return res.status(400).json({
          error: "Email already subscribed"
        });
      }
      console.error("Newsletter signup error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get all newsletters
  app.get("/api/newsletters", async (req, res) => {
    try {
      const newsletters = await storage.getAllNewsletters();
      res.json(newsletters);
    } catch (error) {
      console.error("Get newsletters error:", error);
      res.status(500).json({ error: "Failed to fetch newsletters" });
    }
  });

  // Export newsletters as CSV
  app.get("/api/newsletters/export", async (req, res) => {
    try {
      const newsletters = await storage.getAllNewsletters();
      
      // Create CSV content with custom headers
      const csvHeader = "Email Address,Date\n";
      const csvRows = newsletters.map(newsletter => {
        const date = new Date(newsletter.subscribedAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        });
        return `"${newsletter.email}","${date}"`;
      }).join("\n");
      
      const csvContent = csvHeader + csvRows;
      
      // Set headers for CSV download
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=newsletter-subscribers.csv');
      res.send(csvContent);
    } catch (error) {
      console.error("CSV export error:", error);
      res.status(500).json({ error: "Failed to export newsletters" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
