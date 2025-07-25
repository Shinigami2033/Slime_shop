import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertNewsletterSchema, insertUserSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Newsletter signup endpoint
  app.post("/api/newsletter", async (req, res) => {
    try {
      const validation = insertNewsletterSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({
          error: "Invalid email format",
          details: validation.error.issues
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

  // Admin login endpoint
  app.post("/api/admin/login", async (req, res) => {
    try {
      const validation = insertUserSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({
          error: "Invalid input",
          details: validation.error.issues
        });
      }

      const { username, password } = validation.data;
      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== password) {
        return res.status(401).json({
          error: "Invalid credentials"
        });
      }

      // Login successful
      res.json({ 
        success: true, 
        user: { id: user.id, username: user.username } 
      });
    } catch (error) {
      console.error("Admin login error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get all admin users
  app.get("/api/admin/users", async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      // Don't send passwords in response
      const safeUsers = users.map(user => ({ id: user.id, username: user.username }));
      res.json(safeUsers);
    } catch (error) {
      console.error("Get users error:", error);
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  // Create new admin user
  app.post("/api/admin/users", async (req, res) => {
    try {
      const validation = insertUserSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({
          error: "Invalid input",
          details: validation.error.issues
        });
      }

      const user = await storage.createUser(validation.data);
      res.json({ 
        success: true, 
        user: { id: user.id, username: user.username } 
      });
    } catch (error: any) {
      if (error.code === '23505') { // PostgreSQL unique constraint error
        return res.status(400).json({
          error: "Username already exists"
        });
      }
      console.error("Create user error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Update admin user (change password or username)
  app.put("/api/admin/users/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid user ID" });
      }

      const validation = insertUserSchema.partial().safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({
          error: "Invalid input",
          details: validation.error.issues
        });
      }

      const user = await storage.updateUser(id, validation.data);
      res.json({ 
        success: true, 
        user: { id: user.id, username: user.username } 
      });
    } catch (error: any) {
      if (error.code === '23505') { // PostgreSQL unique constraint error
        return res.status(400).json({
          error: "Username already exists"
        });
      }
      console.error("Update user error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Delete admin user
  app.delete("/api/admin/users/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid user ID" });
      }

      // Prevent deleting the last admin user
      const allUsers = await storage.getAllUsers();
      if (allUsers.length <= 1) {
        return res.status(400).json({ 
          error: "Cannot delete the last admin user" 
        });
      }

      await storage.deleteUser(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Delete user error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
