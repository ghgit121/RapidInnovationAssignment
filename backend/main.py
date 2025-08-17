from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from routers import auth, search, image, dashboard, admin
import os

# Load environment variables
load_dotenv()

app = FastAPI()

# CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins="http://localhost:5173/",  # Vite dev server origin
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods, including OPTIONS
    allow_headers=["*"],  # Allow all headers, including Authorization
)

# Include routers with proper prefixes
app.include_router(auth.router, prefix="/auth")
app.include_router(search.router, prefix="/search")
app.include_router(image.router, prefix="/image")
app.include_router(dashboard.router, prefix="/dashboard")
app.include_router(admin.router, prefix="/admin")

@app.get("/")
def root():
    return {"message": "AI Content Explorer Backend"}

# Token validation endpoint
from fastapi.security import OAuth2PasswordBearer
from dependencies import get_current_user  # Assume this is defined

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

@app.get("/auth/validate")
async def validate_token(current_user = Depends(get_current_user)):
    # If we get here, the token is valid (get_current_user didn't raise an exception)
    return {
        "detail": "Token valid",
        "user": {
            "id": current_user.id,
            "username": current_user.username,
            "role": current_user.role
        }
    }
