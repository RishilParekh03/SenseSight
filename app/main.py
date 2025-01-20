from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from starlette.middleware.sessions import SessionMiddleware
import json
from fastapi.responses import RedirectResponse
from google.oauth2 import id_token
from google.auth.transport import requests
import httpx
from sqlalchemy import create_engine, Column, Integer, String, Boolean
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm import declarative_base
from fastapi.staticfiles import StaticFiles

# Load configurations
with open("config/config.json") as f:
    config = json.load(f)

GOOGLE_CLIENT_ID = config["GOOGLE_CLIENT_ID"]
GOOGLE_CLIENT_SECRET = config["GOOGLE_CLIENT_SECRET"]
DATABASE_URL = config["DATABASE_URL"]

app = FastAPI()

# Set up the templates directory
templates = Jinja2Templates(directory="templates")
# Serve static files from the 'static' directory
app.mount("/static", StaticFiles(directory="static"), name="static")

# Add session middleware
app.add_middleware(SessionMiddleware, secret_key="2847e3664bbe422f773d80f6a5b294129311c31616ccc63051182ff5dbab0987")

# Database setup using SQLAlchemy
engine = create_engine(DATABASE_URL)  # Use appropriate DB driver and args
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


# Google Auth Sign_in data
class User(Base):
    __tablename__ = 'google_auth'
    id = Column(Integer, primary_key=True, autoincrement=True)  # Ensure this is set
    email = Column(String, index=True)
    name = Column(String)
    active = Column(Boolean, default=True)


# Create the database tables if they don't exist
Base.metadata.create_all(bind=engine)


# Root route to render index.html
@app.get("/", response_class=HTMLResponse)
async def index(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})


# Login route to start the Google OAuth flow
@app.get("/login")
async def login(request: Request):
    # Generate the Google OAuth login URL
    redirect_uri = request.url_for('auth_callback')
    google_auth_url = (
        f"https://accounts.google.com/o/oauth2/auth"
        f"?client_id={GOOGLE_CLIENT_ID}"
        f"&redirect_uri={redirect_uri}"
        f"&response_type=code"
        f"&scope=openid email profile"
    )
    return RedirectResponse(url=google_auth_url)


# Callback route to handle the OAuth response and exchange code for token
@app.get("/callback")
async def auth_callback(code: str, request: Request):
    token_request_uri = "https://oauth2.googleapis.com/token"
    data = {
        'code': code,
        'client_id': GOOGLE_CLIENT_ID,
        'client_secret': GOOGLE_CLIENT_SECRET,
        'redirect_uri': request.url_for('auth_callback'),
        'grant_type': 'authorization_code',
    }

    # Send a POST request to exchange the authorization code for an ID token
    async with httpx.AsyncClient() as client:
        response = await client.post(token_request_uri, data=data)
        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail="Error retrieving token.")
        token_response = response.json()

    id_token_value = token_response.get('id_token')
    if not id_token_value:
        raise HTTPException(status_code=400, detail="Missing id_token in response.")

    # Verify the id_token
    try:
        id_info = id_token.verify_oauth2_token(id_token_value, requests.Request(), GOOGLE_CLIENT_ID)
        email = id_info.get('email')
        name = id_info.get('name')

        # Save user in the database if new
        db = SessionLocal()
        user = db.query(User).filter(User.email == email).first()
        if not user:
            user = User(email=email, name=name)
            db.add(user)
            db.commit()

        # Save the user's info in the session
        request.session['user_id'] = user.id
        db.close()

        return RedirectResponse(url="/welcome")
    except ValueError as e:
        raise HTTPException(status_code=400, detail=f"Invalid id_token: {str(e)}")


# Example of a welcome route
@app.get("/welcome")
async def welcome(request: Request):
    user_id = request.session.get('user_id')
    if not user_id:
        return {"detail": "Unauthorized"}

    db = SessionLocal()
    user = db.query(User).filter(User.id == user_id).first()
    db.close()

    if not user:
        return {"detail": "Unauthorized"}

    return {"message": f"Welcome {user.name}!"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="127.0.0.1", port=8000)
