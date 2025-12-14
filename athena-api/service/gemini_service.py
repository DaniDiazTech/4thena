from google import genai
import os
from colorama import Fore
from manager.load_config import CONFIG

from prompts import prompts
from . import mongo_service 
from milvus.milvus import Milvus

genai_client: None | genai.Client = None
milvus_client: None | Milvus = None

async def get_milvus_client():
    global milvus_client

    if milvus_client is not None:
        return milvus_client

    milvus_config = CONFIG["milvus"]
    milvus_client = Milvus(milvus_config["uri"], milvus_config["identify_collection"], milvus_config["rag_collection"])
    await milvus_client.connect()

    return milvus_client


def get_client():
    global genai_client
    if genai_client is not None:
        return genai_client


    print(f"{Fore.BLUE}Attempting gemini client connection")
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        print("Warning: GEMINI_API_KEY not found.")
        return None
    genai_client = genai.Client(api_key=api_key)
    print(f"{Fore.GREEN}Gemini client connection established")
    return genai_client

async def process_message(prompt_msg: str, context: str, merchant_id: str):
    print("AOINSOINSOINEOINOINOO")
    """
    Process the message using Gemini LLM and then embed it using the new google-genai SDK.
    """
    print(f"{Fore.BLUE}Retrieving gemini client")
    client = get_client()
    if not client:
        return {"error": "Gemini API Key missing"}

    print(f"{Fore.BLUE}Retrieving milvus client")
    milvus_client = await get_milvus_client()
    if not milvus_client:
        return {"error": "Milvus client can't connect"}

    prompt_model_name = CONFIG.get('gemini', {}).get('model', 'gemini-3-pro')
    embed_model_name = CONFIG.get('gemini', {}).get('embed_model', 'text-embedding-004')
    
    try:
        # Reduce to most important info
        print(f"{Fore.BLUE}Generating reduced string for query")
        response = client.models.generate_content(
            model=prompt_model_name,
            contents=prompts.REDUCE_PROMPT+"\n"+prompt_msg
        )
        reduced = response.text
        
        print(f"{Fore.BLUE}Generating embedding of reduced")
        result = client.models.embed_content(
            model=embed_model_name,
            contents=reduced,
            config={
                "task_type": "RETRIEVAL_QUERY"
            }
        )
        
        embedding = result.embeddings[0].values

        search_res = await milvus_client.searchRag(embedding, merchant_id)

        if search_res is None:
            return {"error": "Milvus client can't query"}

        msg_ids = []
        for res in search_res:
            msg_ids.append(res.msg_id)

        print(f"{Fore.BLUE}Search result messages ids {msg_ids}")
        msgs = mongo_service.getQueryMsgs(msg_ids)
        
        full_context = ""
        for msg in msgs:
            full_context += "\n"+msg
        full_context = full_context.strip()

        full_context += "\n--- GIVEN THE PREVIOUS INFORMATION ANSWER THE FOLLOWING PROMPT ---"+prompt_msg
        full_context = full_context.strip()

        print(f"{Fore.BLUE} Generating full response with rag retrieval")
        response = client.models.generate_content(
            model=prompt_model_name,
            contents=full_context
        )

        return {"response": response.text}
    except Exception as e:
        print(f"Error in Gemini processing: {e}")
        raise e
