import os
from typing import List
from dotenv import load_dotenv
import google.generativeai as genai


load_dotenv()


class EmbeddingsService:
    def __init__(self, apiKey: str | None = None):
        """
        Initializes the embedding service with an explicit API key.
        Fails fast if the API key is missing.
        """
        self.apiKey = apiKey or os.getenv("GEMINI_API_KEY")

        if not self.apiKey:
            raise RuntimeError(
                "GEMINI_API_KEY is not set. "
                "Provide it explicitly or define it as an environment variable."
            )

        # Stateless client (no global configuration)
        self.client = genai.Client(api_key=self.apiKey)

    def createEmbedding(self, text: str) -> List[float]:
        """
        Generates an embedding for the given text using Gemini embeddings.

        :param text: Input text to embed
        :return: Embedding vector
        :raises ValueError: if text is empty
        :raises RuntimeError: if the embedding API fails
        """
        if not text or not text.strip():
            raise ValueError("Input text must be a non-empty string.")

        try:
            response = self.client.embed_content(
                model="models/text-embedding-001",
                content=text,
                task_type="retrieval_document"
            )
        except Exception as e:
            raise RuntimeError("Failed to generate embedding.") from e

        if not response or "embedding" not in response:
            raise RuntimeError("Embedding response is malformed or empty.")

        return response["embedding"]
