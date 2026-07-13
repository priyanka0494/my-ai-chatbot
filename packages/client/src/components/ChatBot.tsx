import { Button } from "@/components/ui/button";
import { FaArrowUp } from "react-icons/fa";
import { useForm } from "react-hook-form";

type FormData = {
  prompt: string;
};

const ChatBot = () => {
  const { register, handleSubmit, reset, formState } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    console.log("Form submitted:", data);
    reset();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(onSubmit)();
    }
  };

  return (
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
          validate: (value) => value.trim() !== "" || "Prompt cannot be empty",
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
  );
};

export default ChatBot;
