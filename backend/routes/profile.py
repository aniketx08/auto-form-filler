# backend/routes/profile.py
from fastapi import APIRouter, Depends
from utils.auth import get_current_user
from db.mongo import user_profiles

router = APIRouter()

@router.post("/profile")
async def save_profile(data: dict, user=Depends(get_current_user)):
    user_id = user["sub"]
    await user_profiles.update_one(
        {"user_id": user_id},
        {"$set": {"user_id": user_id, "data": data}},
        upsert=True
    )
    return {"status": "saved"}

@router.get("/profile")
async def get_profile(user=Depends(get_current_user)):
    profile = await user_profiles.find_one({"user_id": user["sub"]})
    return profile["data"] if profile else {}
