// implementation details
const conversations = new Map<string, string>();

//Export public interface
export const conversationRepository = {
  getLastResponseId(conversationId: string): string | undefined {
    return conversations.get(conversationId);
  },
  setLastResponseId(conversationId: string, responseId: string): void {
    conversations.set(conversationId, responseId);
  },
};
