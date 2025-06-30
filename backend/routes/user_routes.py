from fastapi import APIRouter, Depends, Body
from utils.auth import get_current_user
from database import users_collection

router = APIRouter()

@router.get("/profile")
async def get_profile(user=Depends(get_current_user)):
    user_id = user["sub"]
    profile = await users_collection.find_one({"user_id": user_id})
    if profile:
        profile.pop("_id", None)
        return profile
    return {}

@router.post("/profile")
async def save_profile(data: dict = Body(...), user=Depends(get_current_user)):
    user_id = user["sub"]
    data["user_id"] = user_id
    await users_collection.update_one(
        {"user_id": user_id},
        {"$set": data},
        upsert=True
    )
    return {"status": "saved"}
