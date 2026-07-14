import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { FaArrowUp } from "react-icons/fa";

export type ChatFormData = {
  prompt: string;
};

type Props = {
  onSubmit: (data: ChatFormData) => void;
};

const ChatInput = ({ onSubmit }: Props) => {
  const { register, handleSubmit, reset, formState } = useForm<ChatFormData>();

  const submit = handleSubmit((data) => {
    reset({ prompt: "" });
    onSubmit(data);
  });

  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(onSubmit)();
      reset({ prompt: "" });
    }
  };
  return (
    <form
      className="flex  gap-2 p-4 items-end border-2 rounded-3xl"
      onSubmit={submit}
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
  );
};

export default ChatInput;
