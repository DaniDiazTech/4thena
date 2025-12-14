ID_REQUEST = """
You are given a JSON object representing a chat message.

Your task is to extract the identification that is the name of the merchant
relevant to the conversation.

Rules:
- Be as accurate as possible.
- If there is no merchant name, return "Unknown Merchant".
- Do not add any additional information or metadata.
- Output must be a single string.

Format exactly as:
<merchant_name>

Input JSON:
{{MESSAGE_JSON}}
"""



SUMMARY_PROMPT = """
You are given a JSON object representing a chat message.

Your task is to generate a single-line summary string with:
- Sender ID
- Recipient ID
- A concise semantic summary of the message content

Rules:
- Remove greetings, slang fillers, and conversational formalities.
- Keep only the core intent or question.
- Do not translate the message unless necessary for clarity.
- Do not add explanations or metadata.
- Output must be a single string.

Format exactly as:
<sender> -> <recipient>: <summarized_message>

Input JSON:
{{MESSAGE_JSON}}
"""