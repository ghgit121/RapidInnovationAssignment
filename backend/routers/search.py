from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from schemas import SearchRequest, HistoryResponse
from models import History
from database import get_db
from dependencies import get_current_user
import httpx
import os
import logging
from dotenv import load_dotenv

load_dotenv()

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()
TAVILY_API_URL = "https://api.tavily.com/search"
API_KEY = os.getenv("TAVILY_API_KEY")

async def query_tavily(query: str):
    if not API_KEY:
        raise HTTPException(status_code=500, detail="TAVILY_API_KEY not found in .env file")

    payload = {
        "api_key": API_KEY,
        "query": query,
        "search_depth": "basic",
        "max_results": 5,
        "include_answer": True
    }
    logger.info(f"Querying Tavily API with payload: {payload}")

    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(TAVILY_API_URL, json=payload)
            response.raise_for_status()
            data = response.json()
            logger.info(f"Tavily API response: {data}")
            return data.get("answer") or data.get("results", [{}])[0].get("content", "No summary available")
        except httpx.HTTPStatusError as e:
            logger.error(f"HTTP error from Tavily API: {e.response.text}")
            raise HTTPException(status_code=e.response.status_code, detail=f"Search failed: {e.response.text}")
        except Exception as e:
            logger.exception("Exception occurred in query_tavily")
            raise HTTPException(status_code=500, detail=f"Search failed: {str(e)}")

@router.post("/query")
async def search_query(request: SearchRequest, user=Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        result = await query_tavily(request.query)
        history = History(
            user_id=user.id,
            type="search",
            query=request.query,
            result=result,
        )
        db.add(history)
        db.commit()
        db.refresh(history)
        return {"result": result}
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.error(f"Error in search_query: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Search failed: {str(e)}")
