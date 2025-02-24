from fastapi import Request, APIRouter, Depends, HTTPException, status
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates

from sqlalchemy.orm import Session

from app.config import database
from app.schemas import admin_schema, dashboard_schema
from app.utils import auth_utils, logger, dashboard_utils

router = APIRouter()

templates = Jinja2Templates(
    directory="./frontend/templates"
)


@router.get("/home")
async def home_page(request: Request, db: Session = Depends(database.get_db)):
    get_access = await auth_utils.get_current_user(request)
    if get_access is None:
        return RedirectResponse(url="/login", status_code=status.HTTP_307_TEMPORARY_REDIRECT)

    user_data = auth_utils.fetch_admin_by_id(get_access, db)
    logger.logger.info(f"Admin Accessed Home {user_data.email}")

    return templates.TemplateResponse("camera.html", {"request": request,
                                                      "data": {"user_id": user_data.id, "name": user_data.name,
                                                               "email": user_data.email,
                                                               "created_at": user_data.created_at
                                                               }})


@router.get("/profile/edit")
async def edit_profile(request: Request, db: Session = Depends(database.get_db)):
    get_access = await auth_utils.get_current_user(request)
    if get_access is None:
        return RedirectResponse(url="/login", status_code=status.HTTP_307_TEMPORARY_REDIRECT)

    user_data = auth_utils.fetch_admin_by_id(get_access, db)
    logger.logger.info(f"Admin Accessed Profile Edit {user_data.email}")

    return templates.TemplateResponse("editProfile.html", {"request": request,
                                                           "data": {"user_id": user_data.id, "name": user_data.name,
                                                                    "email": user_data.email
                                                                    }})


@router.put("/profile/edit/{user_id}")
async def update_profile(user_id: int, request: dashboard_schema.UpdateProfile, db: Session = Depends(database.get_db)):
    get_admin = dashboard_utils.update_profile(user_id, request, db)
    logger.logger.info(f"User updated profile: {get_admin.name}, {get_admin.email}")

    return {"Profile Updated"}
