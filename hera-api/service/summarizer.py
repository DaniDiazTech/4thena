from typing import List
from ai.llm import LLMinteractor
from ai.embeddings import EmbeddingsService
from ai.prompts import SUMMARY_PROMPT

class Summarizer:
    def __init__(self, llm: LLMinteractor):
        self.llm = llm

    def summarize(self, content: List[dict] | str) -> str:

        send_content = [{"role": "model", "parts": [{"text": SUMMARY_PROMPT}]}]

        if isinstance(content, str):
            send_content += [{"role": "user", "parts": [{"text": content}]}]
        else:
            send_content += content

        return self.llm.generate(send_content)
