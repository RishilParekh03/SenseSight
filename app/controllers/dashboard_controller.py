from fastapi import Request, APIRouter, Depends, HTTPException, status
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from starlette.responses import RedirectResponse
from sqlalchemy.orm import Session

from app.utils import auth_utils, logger
from app.config import database
from app.models import admin_model

router = APIRouter()

templates = Jinja2Templates(
    directory="./frontend/templates"
)


@router.get("/home", response_class=HTMLResponse)
async def home_page(request: Request, db: Session = Depends(database.get_db)):
    token = request.cookies.get("access_token")
    if not token:
        return RedirectResponse(url="/login")
    user_data = auth_utils.get_current_user(token)
    if not user_data:
        return RedirectResponse(url="/login")

    user = auth_utils.fetch_admin_by_id(user_data["sub"], db)
    print("User_details: ", user)
    if not user:
        return {"message": "User details not found"}

    logger.logger.info("Admin Accessed Home")
    return templates.TemplateResponse("camera.html", {
        "request": request,
        "user_data": {
            "name": user.name,
            "username": user.username,
            "created_at": user.created_at.strftime("%Y-%m-%d %H:%M:%S")
        }})


