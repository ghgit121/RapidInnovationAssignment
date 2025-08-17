from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from schemas import ImageRequest, HistoryResponse
from models import History
from database import get_db
from dependencies import get_current_user
import mcp
from mcp.client.streamable_http import streamablehttp_client
import os
import logging
from dotenv import load_dotenv
import json

load_dotenv()

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()
FLUX_API_URL = "https://server.smithery.ai/@falahg/flux-imagegen-mcp-server/mcp"
API_KEY = os.getenv("FLUX_API_KEY")  # Fallback to example key

async def generate_image(prompt: str):
    if not API_KEY:
        raise HTTPException(status_code=500, detail="FLUX_API_KEY not found in .env file")

    url = f"{FLUX_API_URL}?api_key={API_KEY}"
    logger.info(f"Connecting to Flux MCP at {url}")

    try:
        async with streamablehttp_client(url) as (read_stream, write_stream, _):
            logger.info("streamablehttp_client started")
            async with mcp.ClientSession(read_stream, write_stream) as session:
                logger.info("MCP session created")
                await session.initialize()
                logger.info("Session initialized")
                tools_result = await session.list_tools()
                logger.info(f"Available tools: {[tool.name for tool in tools_result.tools]}")

                if not tools_result.tools:
                    raise HTTPException(status_code=500, detail="No tools available from Flux MCP")

                # Use the tool named 'generateImageUrl' based on log
                tool_name = "generateImageUrl"
                result = await session.call_tool(
                    name=tool_name,
                    arguments={"prompt": prompt}
                )
                logger.info(f"Response from {tool_name}: {result}")

                if not result or result.isError:
                    raise HTTPException(status_code=500, detail=f"No valid response from {tool_name}: {result.error if result.isError else 'No result'}")

                # Parse the JSON string from TextContent
                if result.content and len(result.content) > 0 and hasattr(result.content[0], 'text'):
                    json_str = result.content[0].text
                    try:
                        data = json.loads(json_str)
                        image_url = data.get("imageUrl")
                        if not image_url:
                            raise HTTPException(status_code=500, detail=f"No imageUrl in response from {tool_name}: {data}")
                        return image_url
                    except json.JSONDecodeError as e:
                        raise HTTPException(status_code=500, detail=f"Failed to parse JSON response: {str(e)}")
                else:
                    raise HTTPException(status_code=500, detail=f"No valid content in response from {tool_name}")

    except Exception as e:
        logger.exception("Exception occurred in generate_image")
        raise HTTPException(status_code=500, detail=f"Image generation failed: {str(e)}")

@router.post("/generate")
async def generate_image_endpoint(request: ImageRequest, user=Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        result = await generate_image(request.prompt)
        history = History(
            user_id=user.id,
            type="image",
            query=request.prompt,
            result=result,
        )
        db.add(history)
        db.commit()
        db.refresh(history)
        return {"image_url": result}
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.error(f"Error in generate_image_endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Image generation failed: {str(e)}")
