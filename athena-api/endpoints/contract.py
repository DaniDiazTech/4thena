from fastapi import APIRouter, HTTPException
from service.gemini_service import buildContract
from fastapi import BackgroundTasks, HTTPException

router = APIRouter()

@router.post("/contract")
async def contract_endpoint(background_tasks: BackgroundTasks, merchant_id: str):
    try:
        return buildContract(background_tasks, merchant_id)
    except Exception as e:
        print(f"Error in /contract: {e}")
        raise HTTPException(status_code=500, detail=str(e))
