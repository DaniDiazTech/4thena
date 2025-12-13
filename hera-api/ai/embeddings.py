import os
import google.generativeai as genai
from typing import List
from dotenv import load_dotenv

load_dotenv()

class EmbeddingsService:
    def __init__(self):
        try:
            api_key = os.getenv('GEMINI_API_KEY')
            if not api_key:
                print("WARNING: GEMINI_API_KEY not found in environment variables")
            else:
                genai.configure(api_key=api_key)
        except Exception as e:
            print(f"Error configuring Gemini API: {e}")

    def create_embedding(self, text: str) -> List[float]:
        """
        Creates an embedding for the given text using the 'models/text-embedding-004' model.
        """
        try:
            result = genai.embed_content(
                model="models/text-embedding-004",
                content=text,
                task_type="retrieval_document",
                title="Embedding of single string"
            )
            return result['embedding']
        except Exception as e:
            print(f"Error generating embedding: {e}")
            return []
