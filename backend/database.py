# backend/database.py
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")

if not MONGO_URI:
    raise ValueError("⚠️ MONGO_URI is not set in your .env file.")

client = AsyncIOMotorClient(MONGO_URI)
db = client["formfiller"]  # You can name this whatever you like
users_collection = db["users"]
