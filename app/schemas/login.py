from fastapi import HTTPException, Request
from google.oauth2 import id_token
from google.auth.transport import requests

async def verify_google_token(id_token_value: str, google_client_id: str, request: Request):
    try:
        # Verify the token
        id_info = id_token.verify_oauth2_token(id_token_value, requests.Request(), google_client_id)
        user_name = id_info.get('name')

        # Store user info in session
        request.session['user_name'] = user_name

        return user_name

    except ValueError as e:
        raise HTTPException(status_code=400, detail=f"Invalid token: {str(e)}")
