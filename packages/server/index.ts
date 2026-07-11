import express from "express";
import type { Request, Response } from "express";
import dotenv from "dotenv";
import z from "zod";
import { chatService } from "./services/chat.service";

dotenv.config();

const app = express();
app.use(express.json());

const port = process.env.PORT || 3000;

// Get
app.get("/", (req: Request, res: Response) => {
  res.send("Hello, World!");
});

app.get("/api/hello", (req: Request, res: Response) => {
  res.json({ message: "Hello, Priyanka!!" });
});

// Post

const chatSchema = z.object({
  prompt: z
    .string()
    .trim()
    .min(1, "Prompt cannot be empty")
    .max(1000, "Prompt cannot exceed 1000 characters"),
  conversationId: z.uuidv4(),
});

app.post("/api/chat", async (req: Request, res: Response) => {
  try {
    const parseResult = chatSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({ error: z.treeifyError(parseResult.error) });
      return;
    }
    const { prompt, conversationId } = parseResult.data;
    const response = await chatService.sendMessage(prompt, conversationId);
    res.json({ message: response.message });
  } catch (error) {
    res.status(500).json({ error: "Failed to generate response" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
