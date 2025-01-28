from fastapi import Request, APIRouter, Depends, status, Form
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
# from fastapi.security import OAuth2PasswordBearer

from sqlalchemy.orm import Session

from app.config import database
from app.schemas import admin_schema
from app.utils import auth_utils, logger

from typing import Optional, Annotated

router = APIRouter()

# oauth = OAuth2PasswordBearer(tokenUrl="token")


# def fake_decode_token(token):
#     return admin_schema.Auth(
#         name="John Doe",
#         username="john@example.com",
#         password=1234
#     )
#
#
# async def get_current_user(token: Annotated[str, Depends(oauth)]):
#     print(token)
#     user = fake_decode_token(token)
#     return user


templates = Jinja2Templates(
    directory="./frontend/templates"
)


@router.get("/", response_class=HTMLResponse)
async def root(request: Request):
    logger.logger.info("Login page called")
    return templates.TemplateResponse("index.html", {"request": request})


@router.post("/auth/login", status_code=status.HTTP_200_OK)
async def user_login(request: admin_schema.AdminFetch, db: Session = Depends(database.get_db)):
    fetch_admin = auth_utils.get_admin_by_email(request, db)

    if fetch_admin is None:
        return {"message": "Login Failed"}
    else:
        logger.logger.info(f"Fetch Admin: {fetch_admin.username}")
    return RedirectResponse(url="/dashboard/home", status_code=status.HTTP_200_OK)


@router.get("/auth/registration", response_class=HTMLResponse)
async def register(request: Request):
    logger.logger.info("Registration page called")
    return templates.TemplateResponse("user_register.html", {"request": request})


@router.post("/auth/registered", status_code=status.HTTP_201_CREATED)
async def user_register(request: admin_schema.AdminInsert, db: Session = Depends(database.get_db)):
    new_admin = auth_utils.create_admin(request, db)
    logger.logger.info(f"New Admin Created: {new_admin.name}")

    return RedirectResponse(url='/', status_code=status.HTTP_201_CREATED)

# @router.post("/user_login", response_model=schemas.Token)
# def login_user(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
#     user = db.query(models.User).filter(models.User.username == form_data.username).first()
#     if not user or not utils.verify_password(form_data.password, user.hashed_password):
#         raise HTTPException(status_code=401, detail="Invalid credentials")
#
#     access_token = auth.create_access_token(data={"sub": user.username})
#     # return {"access_token": access_token, "token_type": "bearer"}
#     response = RedirectResponse(url="/dashboard", status_code=303)
#     response.set_cookie(key="access_token", value=access_token)  # Optionally store the token in cookies
#     return response
