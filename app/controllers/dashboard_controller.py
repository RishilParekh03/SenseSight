from fastapi import Request, APIRouter, Depends, HTTPException, status
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from starlette.responses import RedirectResponse

from app.schemas import admin_schema
from app.utils import auth_utils, logger

router = APIRouter()

templates = Jinja2Templates(
    directory="./frontend/templates"
)


@router.get("/home", response_class=HTMLResponse)
async def home_page(request: Request):
    token = request.cookies.get("access_token")
    if not token:
        return RedirectResponse(url="/login")
    user_data = auth_utils.get_current_user(token)
    logger.logger.info("Admin Accessed Home")
    return templates.TemplateResponse("dashboard.html", {"request": request, "user_data": user_data})
