import axios from "axios";
import ReactMarkdown from "react-markdown";
import { useMemo, useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FaArrowUp } from "react-icons/fa";
import { useForm } from "react-hook-form";

type FormData = {
  prompt: string;
};

type ChatResponse = {
  message: string;
};

type Message = {
  content: string;
  role: "user" | "bot";
};

const ChatBot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const conversationId = useMemo(() => crypto.randomUUID(), []);
  const lastMessageRef = useRef<HTMLDivElement | null>(null);
  const { register, handleSubmit, reset, formState } = useForm<FormData>();

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const onSubmit = async ({ prompt }: FormData) => {
    setMessages((prev) => [...prev, { content: prompt, role: "user" }]);
    setIsBotTyping(true);
    reset({ prompt: "" });
    const { data } = await axios.post<ChatResponse>("/api/chat", {
      prompt,
      conversationId,
    });

    setMessages((prev) => [...prev, { content: data.message, role: "bot" }]);
    setIsBotTyping(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(onSubmit)();
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col flex-1 gap-3 mb-10 overflow-y-auto">
        {messages.map((message, index) => (
          <div
            key={index}
            ref={index === messages.length - 1 ? lastMessageRef : null}
            className={`px-3 py-1 rounded-xl ${message.role === "user" ? "bg-blue-600 text-white self-end" : "bg-gray-100 text-black self-start"}`}
          >
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        ))}
        {isBotTyping && (
          <div
            className={"flex self-start gap-1 px-3 py-3 bg-gray-200 rounded-xl"}
          >
            <div className="w-2 h-2 rounded-full bg-gray-800 animate-pulse" />
            <div className="w-2 h-2 rounded-full bg-gray-800 animate-pulse [animation-delay:0.2s]" />
            <div className="w-2 h-2 rounded-full bg-gray-800 animate-pulse [animation-delay:0.4s]" />
          </div>
        )}
      </div>
      <form
        className="flex  gap-2 p-4 items-end border-2 rounded-3xl"
        onSubmit={handleSubmit(onSubmit)}
        onKeyDown={handleKeyDown}
      >
        <textarea
          className="w-full focus:outline-0"
          placeholder="Ask me anything..."
          autoFocus
          {...register("prompt", {
            required: true,
            validate: (value) => value.trim() !== "",
          })}
        />
        <Button
          type="submit"
          disabled={!formState.isValid}
          className="rounded-full w-9 h-9"
        >
          <FaArrowUp />
        </Button>
      </form>
    </div>
  );
};

export default ChatBot;
