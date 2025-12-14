from google import genai
import os
from colorama import Fore
from manager.load_config import CONFIG

import pypandoc
import tempfile

from fastapi import BackgroundTasks, HTTPException
from fastapi.responses import FileResponse

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

    prompt_model_name = CONFIG.get('gemini', {}).get('model', 'gemini-3-pro-preview')
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

        print(f"{Fore.BLUE}Search result messages ids {search_res}")
        msgs = mongo_service.getQueryMsgs(search_res)
        
        full_context = ""
        for msg in msgs:
            full_context += "\n"+msg
        full_context = full_context.strip()

        full_context += "\n--- GIVEN THE PREVIOUS INFORMATION ANSWER THE FOLLOWING PROMPT ---"+prompt_msg+"\n--- THE FOLLOWING IS THE MERCHANT NAME ---\n"+merchant_id
        full_context = full_context.strip()

        print("-"*10)
        print(full_context)
        print("-"*10)

        print(f"{Fore.BLUE} Generating full response with rag retrieval")
        response = client.models.generate_content(
            model=prompt_model_name,
            contents=full_context
        )

        return {"response": response.text}
    except Exception as e:
        print(f"Error in Gemini processing: {e}")
        raise e

async def buildContract(background_tasks: BackgroundTasks, merchant_id: str):
    print(f"{Fore.BLUE}Retrieving gemini client")
    client = get_client()
    if not client:
        return {"error": "Gemini API Key missing"}

    prompt_model_name = CONFIG.get('gemini', {}).get('model', 'gemini-3-pro-preview')
    
    try:
        print("Getting business messgaes")
        docs = mongo_service.getContractMessages(merchant_id)
        
        print("Generating prompt")
        full_context = prompts.CONTRACT_PROMPT
        for d in docs:
            full_context += "\n"+d
        full_context = full_context.strip()


        print("Generating llm response")
        response = client.models.generate_content(
            model=prompt_model_name,
            contents=full_context
        )

        txt = response.text

        if txt is None:
            raise HTTPException(status_code=500, detail="couldn't pdf")

        print("Creating temporary file to write to")
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
            pdf_path = tmp.name

        print("Writing to file")
        pypandoc.convert_text(
            txt,
            to="pdf",
            format="md",
            outputfile=pdf_path,
            extra_args=["--standalone"]
        )

        print("initiating backgounrd task to remove leftover file")
        background_tasks.add_task(os.remove, pdf_path)

        print("returning file to endpoint")
        return FileResponse(
            pdf_path,
            media_type="application/pdf",
            filename="company_report.pdf"
        )
    except Exception as e:
        print(f"Error in Gemini processing: {e}")
        raise e
    
