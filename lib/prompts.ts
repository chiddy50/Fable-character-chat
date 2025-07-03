import { formatReactionsPrompt } from "@/data/characterReactions"
import { Agent } from "@/types/agent";


export const getConversationSummaryPrompt = (messages: { user:string, text:string }[], agent: Agent|null) => {
    // Convert conversation into a readable string format
    const conversationText = messages.map(msg =>
        `${msg.user === 'user' ? 'User' : 'AI Agent'}: ${msg.text}`
    ).join('\n\n');

    return `
Act as a professional Relationship analyst, Social analyst, Communication analyst and Communication analyst. Analyze the following conversation between a user and an AI agent, then provide:

Your task is to:
1. Provide a concise summary of the key discussion points.
2. Describe the current tone and relationship dynamic between the user and the agent (e.g., supportive, friendly, formal, distant).
3. Based on the **latest message(s)**, determine the agent’s current emotional state using **only one** reaction from the predefined list below.

Conversation:
${conversationText}

Character Agent Info:
Agent Name: ${agent.name}
Agent Bio: ${agent.bio}

Please respond in this structured format:
- **summary**: [Concise overview of topics covered]
- **relationship**: [Description of interaction style and rapport]
-*currentEmotion* [The emoji name that describes how ${agent.name} currently feels]

Predefined List Of Reactions: ${formatReactionsPrompt({ bulletList: false })}

**FORMAT YOUR RESPONSE AS JSON:**
Return your response in a json or JavaScript object format like: 
- summary(string) This refers to a concise overview of topics discussed. While summarizing always use the character agents name ${agent.name} and refers to the user as "you".
- relationship(string) This refers to a single word description of relationship and rapport between the user and the AI Agent.
- currentEmotion(string) This refers to one emoji name that best reflects the agent’s current emotional state and must be chosen from the predefined list.

⚠️ Important Instructions:
- \`currentEmotion\` **must** be selected from the predefined list of emoji names above.


Do not add any text extra line or text with the json response, just a json object, no acknowledgement or do not return any title, just return json response. Do not go beyond this instruction.                               
Also ensure the only keys in the of objects are summary, relationship and currentEmotion keys only.

Do not add any text extra line or text with the json response, just a json or JavaScript object, no acknowledgement or do not return any title, just return a structured json response. Do not go beyond this instruction.                               
Remember return a JavaScript or json object as your response 
    `;
}


export const getConversationSummaryPrompt2 = (
  messages: { user: string; text: string }[],
  agent: { name: string; bio: string }
) => {
  const conversationText = messages
    .map((msg) => `${msg.user === "user" ? "User" : "AI Agent"}: ${msg.text}`)
    .join("\n\n");

  return `
Act as a professional relationship analyst, social analyst, and communication specialist. Carefully analyze the full conversation history below between a user and the AI agent **${agent.name}**, paying special attention to the **most recent exchanges** to determine the agent's emotional state.

Your task is to:
1. Provide a concise summary of the key discussion points.
2. Describe the current tone and relationship dynamic between the user and the agent (e.g., supportive, friendly, formal, distant).
3. Based on the **latest message(s)**, determine the agent’s current emotional state using **only one** reaction from the predefined list below.

Conversation History:
${conversationText}

Character Agent Info:
Agent Name: ${agent.name}
Agent Bio: ${agent.bio}

Predefined List of Reactions (emoji names + symbols):
${formatReactionsPrompt({ bulletList: false })}

Respond **strictly** in this structured format:
{
  summary: "Brief summary of topics discussed",
  relationship: "Description of the relationship tone in one or two words",
  currentEmotion: "One emoji name that best reflects the agent’s current emotional state (must be chosen from the predefined list)"
}

⚠️ Important Instructions:
- Use **only** the keys: \`summary\`, \`relationship\`, and \`currentEmotion\` in your response.
- \`currentEmotion\` **must** be selected from the predefined list of emoji names above.
- Return **only** a valid JSON or JavaScript object — no extra text, titles, formatting, or acknowledgements.
- Do not add explanations, markdown, or headings.

Only return the structured JSON object.
`;
};
