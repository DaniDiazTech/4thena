from typing import List
import os
from google import genai
from dotenv import load_dotenv
from typing import Optional, Any

class LLMinteractor:
    def __init__(self, api_key: str | None = None):
        """
        Initializes the LLMinteractor with an explicit API key.
        Fails fast if the API key is missing.
        """
        self.api_key = api_key or os.getenv("GEMINI_API_KEY")
        if not self.api_key:
            raise ValueError("GEMINI_API_KEY not found in .env file")

        self.client = genai.Client(api_key=self.api_key)
        self.model_name = 'gemini-2.5-flash'

    def generate(self, prompt : List[dict], model: Optional[str] = None, **kwargs : Any) -> str:
        try:
            llm_response = self.client.models.generate_content(
                model= model or self.model_name,
                contents=prompt,
                **kwargs
            )
            return llm_response.text
        except Exception as e:
            # print(e)
            return "An error occurred while processing your request with the LLM."