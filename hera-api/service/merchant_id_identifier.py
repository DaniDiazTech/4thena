from ai.embeddings import EmbeddingsService
from ai.prompts import ID_REQUEST
from ai.llm import LLMinteractor

class MerchantIDIdentifier:
    def __init__(self):
        self.embeddings_service = EmbeddingsService()
        self.llm = LLMinteracclient()

    def identify_merchant_id(self, content: List[dict] | str) -> str:
        send_content = [{"role": "system", "parts": [{"text": ID_REQUEST}]}]

        if isinstance(content, str):
            send_content += [{"role": "user", "parts": [{"text": content}]}]
        else:
            send_content += content

        return self.llm.generate(send_content)

    def identify_merchant_id_embedding(self, content: List[dict] | str) -> str:
        return self.embeddings_service.createEmbedding(self.identify_merchant_id(content))