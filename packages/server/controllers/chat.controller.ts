import type { Request, Response } from "express";
import { chatService } from "../services/chat.service";
import z from "zod";

//Implementation details
const chatSchema = z.object({
  prompt: z
    .string()
    .trim()
    .min(1, "Prompt cannot be empty")
    .max(1000, "Prompt cannot exceed 1000 characters"),
  conversationId: z.uuidv4(),
});

//Public interface
export const chatController = {
  sendMessage: async (req: Request, res: Response) => {
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
  },
};
