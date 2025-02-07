from fastapi import Request, APIRouter, Depends, status
from fastapi.responses import HTMLResponse, RedirectResponse, JSONResponse
from fastapi.templating import Jinja2Templates
from fastapi.security import OAuth2PasswordRequestForm

from sqlalchemy.orm import Session

from app.config import database
from app.schemas import admin_schema
from app.utils import auth_utils, logger

router = APIRouter()
templates = Jinja2Templates(
    directory="./frontend/templates"
)


@router.get("/", response_class=HTMLResponse)
async def root(request: Request):
    logger.logger.info("Default accessed")
    return templates.TemplateResponse("index.html", {"request": request})


@router.get('/login', response_class=HTMLResponse)
async def login_page(request: Request):
    logger.logger.info("Login accessed")
    return templates.TemplateResponse("login.html", {"request": request})


@router.get("/register", response_class=HTMLResponse)
async def registration_page(request: Request):
    logger.logger.info("Registration page accessed")
    return templates.TemplateResponse("register.html", {"request": request})


@router.post("/auth/register", status_code=status.HTTP_201_CREATED)
async def user_register(request: admin_schema.CreateAdmin, db: Session = Depends(database.get_db)):
    new_admin = auth_utils.create_admin(request, db)
    logger.logger.info(f"New Admin Created: {new_admin.name}")

    return {"message": "Registration Successful"}


@router.post("/auth/login", response_model=admin_schema.TokenSchema, status_code=status.HTTP_200_OK)
async def user_login(request: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(database.get_db)):
    get_admin = auth_utils.fetch_admin(request, db)
    access_token = auth_utils.create_access_token(data={"sub": str(get_admin.id)})
    logger.logger.info(f"Fetch Admin: {get_admin.username}")
    print(access_token)

    response = JSONResponse(content=access_token)
    response = RedirectResponse(url="/dashboard/home", status_code=status.HTTP_200_OK)
    response.set_cookie(key="access_token", value=access_token, httponly=True)

    return response


@router.get("/users")
async def all_users(db: Session = Depends(database.get_db)):
    get_all = auth_utils.fetch_all(db)

    return get_all
