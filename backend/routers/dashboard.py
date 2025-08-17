from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from schemas import HistoryResponse
from models import History
from database import get_db
from dependencies import get_current_user
import logging
from typing import Optional

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()

@router.get("/")
async def get_dashboard(
  user=Depends(get_current_user),
  db: Session = Depends(get_db),
  type: Optional[str] = None,
  keyword: Optional[str] = None,
  date_start: Optional[str] = None,
  date_end: Optional[str] = None
):
  query = db.query(History).filter(History.user_id == user.id)
  if type:
    query = query.filter(History.type == type)
  if keyword:
    query = query.filter(History.query.contains(keyword) or History.result.contains(keyword))
  if date_start:
    query = query.filter(History.created_at >= date_start)
  if date_end:
    query = query.filter(History.created_at <= date_end)
  return query.all()

@router.put("/{id}")
async def update_dashboard(id: int, update_data: dict, user=Depends(get_current_user), db: Session = Depends(get_db)):
  history = db.query(History).filter(History.id == id, History.user_id == user.id).first()
  if not history:
    raise HTTPException(status_code=404, detail="Entry not found")
  
  if 'query' in update_data:
    history.query = update_data['query']
  if 'result' in update_data:
    history.result = update_data['result']
    
  db.commit()
  db.refresh(history)
  return history

@router.delete("/{id}")
async def delete_dashboard(id: int, user=Depends(get_current_user), db: Session = Depends(get_db)):
  history = db.query(History).filter(History.id == id, History.user_id == user.id).first()
  if not history:
    raise HTTPException(status_code=404, detail="Entry not found")
  db.delete(history)
  db.commit()
  return {"detail": "Entry deleted"}