import { Button } from "@/components/ui/button";
import { FaArrowUp } from "react-icons/fa";

const ChatBot = () => {
  return (
    <div className="flex flex-col gap-2 p-4 items-end border-2 rounded-3xl">
      <textarea
        className="w-full focus:outline-0"
        placeholder="Ask me anything..."
      />
      <Button className="rounded-full w-9 h-9">
        <FaArrowUp />
      </Button>
    </div>
  );
};

export default ChatBot;
