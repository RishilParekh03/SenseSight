from passlib.context import CryptContext

from sqlalchemy.orm import Session

from app.models import admin_model
from app.schemas import admin_schema

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def create_admin(data: admin_schema.AdminInsert, db: Session):
    insert_admin = admin_model.Admin(name=data.name, username=data.username, password=pwd_context.hash(data.password))
    db.add(insert_admin)
    db.commit()
    db.refresh(insert_admin)

    return insert_admin


def get_admin_by_email(data: admin_schema.AdminFetch, db: Session):
    get_admin = db.query(admin_model.Admin).filter(admin_model.Admin.username == data.username).first()

    return get_admin
