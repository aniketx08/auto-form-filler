import os
import requests
from fastapi import HTTPException, Header
from jose import jwt, jwk
from dotenv import load_dotenv

load_dotenv()

CLERK_JWKS_URL = os.getenv("CLERK_JWKS_URL")
CLERK_FRONTEND_API = os.getenv("CLERK_FRONTEND_API")

if not CLERK_JWKS_URL:
    raise RuntimeError("CLERK_JWKS_URL is not set in environment variables.")
if not CLERK_FRONTEND_API:
    raise RuntimeError("CLERK_FRONTEND_API is not set in environment variables.")

# Download Clerk's public keys for JWT verification
def get_public_key(token: str):
    headers = jwt.get_unverified_header(token)
    jwks = requests.get(CLERK_JWKS_URL).json()
    for key in jwks["keys"]:
        if key["kid"] == headers["kid"]:
            return jwk.construct(key)  # ✅ returns a key usable by jose.jwt.decode
    raise HTTPException(status_code=401, detail="Public key not found.")

def get_current_user(authorization: str = Header(...)):
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization header")

    token = authorization.split(" ")[1]
    print("🔐 Received token:", token[:50], "...")  # Shorten for readability

    public_key = get_public_key(token)

    try:
        payload = jwt.decode(
            token,
            public_key,
            algorithms=["RS256"],
            audience=os.getenv("CLERK_FRONTEND_API"),
            issuer=os.getenv("CLERK_JWKS_URL").replace("/.well-known/jwks.json", "")
        )
        return payload
    except Exception as e:
        print("❌ JWT Decode Error:", str(e))  # ← ADD THIS LINE
        raise HTTPException(status_code=401, detail=f"Token verification failed: {str(e)}")
