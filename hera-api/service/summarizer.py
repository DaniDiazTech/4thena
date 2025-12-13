from ai.llm import LLMinteractor
from ai.embeddings import EmbeddingsService
from ai.prompts import SUMMARY_PROMPT

class Summarizer:
    def __init__(self):
        self.llm = LLMinteractor()

    def summarize(self, content: List[dict] | str) -> str:

        send_content = [{"role": "system", "parts": [{"text": SUMMARY_PROMPT}]}]

        if isinstance(content, str):
            send_content += [{"role": "user", "parts": [{"text": content}]}]
        else:
            send_content += content

        return self.llm.generate(send_content)
    
    def embed_summary(self, content: List[dict] | str) -> List[float]:
        summary = self.summarize(content)
        return EmbeddingsService().createEmbedding(summary)
