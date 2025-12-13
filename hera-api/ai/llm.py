import os
import google.generativeai as genai
from dotenv import load_dotenv

class LLMinteractor:
    def __init__(self):
        self.gemini_api_key = os.getenv("GEMINI_API_KEY")
        if not self.gemini_api_key:
            raise ValueError("GEMINI_API_KEY not found in .env file")
        
        self.client = genai.Client(api_key=self.gemini_api_key)
        self.model_name = 'gemini-pro'

    def generate(self, prompt: str, model: Optional[str] = None, **kwargs : Any) -> str:
        try:
            llm_response = self.client.models.generate_content(
                model= model or self.model_name,
                contents=prompt,
                **kwargs
            )
            return llm_response.text
        except Exception as e:
            return "An error occurred while processing your request with the LLM."
