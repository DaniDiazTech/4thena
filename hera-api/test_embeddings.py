import sys
import os

# Add hera-api to path to allow imports from ai package
current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(current_dir)

print(f"Added to path: {current_dir}")

try:
    from ai.embeddings import EmbeddingsService
    print("Successfully imported EmbeddingsService from ai.embeddings")
except ImportError as e:
    print(f"Failed to import EmbeddingsService: {e}")
    sys.exit(1)

def test_embedding():
    service = EmbeddingsService()
    text = "Hello, world!"
    print(f"Generating embedding for: '{text}'")
    embedding = service.create_embedding(text)
    
    if embedding:
        print(f"Success! Embedding length: {len(embedding)}")
        print(f"Sample: {embedding[:5]}")
    else:
        print("Failed to generate embedding (Expected if API Key is invalid or missing)")

if __name__ == "__main__":
    test_embedding()
