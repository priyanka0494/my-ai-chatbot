import axios from "axios";
import { useMemo, useState } from "react";

import TypingIndicator from "./TypingIndicator";
import ChatMessages, { type Message } from "./ChatMessages";
import ChatInput, { type ChatFormData } from "./ChatInput";

type ChatResponse = {
  message: string;
};

const ChatBot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const conversationId = useMemo(() => crypto.randomUUID(), []);

  const onSubmit = async ({ prompt }: ChatFormData) => {
    try {
      setMessages((prev) => [...prev, { content: prompt, role: "user" }]);
      setIsBotTyping(true);
      setError("");

      const { data } = await axios.post<ChatResponse>("/api/chat", {
        prompt,
        conversationId,
      });

      setMessages((prev) => [...prev, { content: data.message, role: "bot" }]);
      setIsBotTyping(false);
    } catch (error) {
      console.log(error);
      setError(
        `An error occurred while processing your request. Please try again.`,
      );
    } finally {
      setIsBotTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col flex-1 gap-3 mb-10 overflow-y-auto">
        <ChatMessages messages={messages} />
        {isBotTyping && <TypingIndicator />}
        {error && <div className="text-red-500 text-sm">{error}</div>}
      </div>
      <ChatInput onSubmit={onSubmit} />
    </div>
  );
};

export default ChatBot;
