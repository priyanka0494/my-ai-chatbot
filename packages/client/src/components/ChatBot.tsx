import axios from "axios";
import ReactMarkdown from "react-markdown";
import { useMemo, useState } from "react";
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
  const conversationId = useMemo(() => crypto.randomUUID(), []);
  const { register, handleSubmit, reset, formState } = useForm<FormData>();

  const onSubmit = async ({ prompt }: FormData) => {
    setMessages((prev) => [...prev, { content: prompt, role: "user" }]);
    reset();
    const { data } = await axios.post<ChatResponse>("/api/chat", {
      prompt,
      conversationId,
    });

    setMessages((prev) => [...prev, { content: data.message, role: "bot" }]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(onSubmit)();
    }
  };

  return (
    <div className="mt-5">
      <div className="flex flex-col gap-3 mb-10">
        {messages.map((message, index) => (
          <p
            key={index}
            className={`px-3 py-1 rounded-xl ${message.role === "user" ? "bg-blue-600 text-white self-end" : "bg-gray-100 text-black self-start"}`}
          >
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </p>
        ))}
      </div>
      <form
        className="flex flex-col gap-2 p-4 items-end border-2 rounded-3xl"
        onSubmit={handleSubmit(onSubmit)}
        onKeyDown={handleKeyDown}
      >
        <textarea
          className="w-full focus:outline-0"
          placeholder="Ask me anything..."
          {...register("prompt", {
            required: true,
            validate: (value) =>
              value.trim() !== "" || "Prompt cannot be empty",
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
