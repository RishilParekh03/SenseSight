from fastapi import Request, APIRouter
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates

from app.utils import logger

router = APIRouter()

templates = Jinja2Templates(
    directory="./frontend/templates"
)


@router.get("/home", response_class=HTMLResponse)
async def home(request: Request):
    logger.logger.info("Admin Accessed Home")
    return templates.TemplateResponse("dashboard.html", {"request": request})
