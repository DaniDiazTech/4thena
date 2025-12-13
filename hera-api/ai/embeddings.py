import os
from typing import List
from dotenv import load_dotenv
from google import genai

load_dotenv()


class EmbeddingsService:
    def __init__(self, api_key: str | None = None):
        """
        Initializes the embedding service with an explicit API key.
        Fails fast if the API key is missing.
        """
        self.api_key = api_key or os.getenv("GEMINI_API_KEY")

        if not self.api_key:
            raise RuntimeError(
                "GEMINI_API_KEY is not set. "
                "Provide it explicitly or define it as an environment variable."
            )

        # Explicit client (no globals)
        self.client = genai.Client(api_key=self.api_key)

    def createEmbedding(self, text: str) -> List[float]:
        """
        Generates an embedding for the given text using Gemini embeddings.

        :param text: Input text to embed
        :return: Embedding vector
        """
        if not text or not text.strip():
            raise ValueError("Input text must be a non-empty string.")

        try:
            response = self.client.models.embed_content(
                model="models/gemini-embedding-001",
                contents=text,
                config={
                    "task_type": "RETRIEVAL_DOCUMENT",
                },
            )
        except Exception as e:
            raise RuntimeError("Failed to generate embedding.") from e

        if (
            not response
            or not response.embeddings
            or not response.embeddings[0].values
        ):
            raise RuntimeError("Embedding response is malformed or empty.")

        return response.embeddings[0].values
