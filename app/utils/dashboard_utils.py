from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.vo import admin_vo
from app.schemas import dashboard_schema


def update_profile(user_id: int, request: dashboard_schema.UpdateProfile, db: Session):
    get_admin = db.query(admin_model.Admin).filter(admin_model.Admin.id == user_id).first()

    if not get_admin:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    if request.name and request.email:
        get_admin.name = request.name
        get_admin.email = request.email

        db.merge(get_admin)
        db.commit()
        db.refresh(get_admin)

        return get_admin
