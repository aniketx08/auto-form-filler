# # backend/routes/submit.py

# from fastapi import APIRouter, Depends
# from utils.auth import get_current_user

# router = APIRouter()

# @router.post("/submit/")
# async def submit_form(current_user: dict = Depends(get_current_user)):
#     user_id = current_user["sub"]
#     email = current_user.get("email") or current_user.get("email_addresses", [{}])[0].get("email_address", "unknown")
#     return {"message": f"Hello {email}, your ID is {user_id}"}