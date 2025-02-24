from fastapi import HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from passlib.context import CryptContext
from sqlalchemy.orm import Session

from datetime import datetime, timedelta
import jwt

from app.models import admin_model, role_model
from app.schemas import admin_schema

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

oauth = OAuth2PasswordBearer(tokenUrl="auth/login")

ALGORITHM = "HS256"
SECRET_KEY = "08b1b1e80aca837e12ff52a9197a321c9d41d48f4c6b415367df1140d7d5cb0c"
REFRESH_SECRET_KEY = "f1ce1380fc4a6be85046143db4eca66076c3f7a2e297b0e1d6c1ad599a48320b"
ACCESS_EXPIRY = 30
REFRESH_EXPIRY = 30


def create_access_token(data: dict, expire_delta: timedelta = None):
    to_encode = data.copy()
    if expire_delta:
        expire = datetime.utcnow() + expire_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_EXPIRY)
    to_encode.update({"exp": expire})
    payload = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

    return payload, expire


# def create_refresh_token(data: dict, expire_delta: timedelta = None):
#     to_encode = data.copy()
#     if expire_delta:
#         expire_delta = datetime.utcnow() + expire_delta
#     else:
#         expire_delta = datetime.utcnow() + timedelta(minutes=REFRESH_EXPIRY)
#     to_encode.update({"exp": expire_delta})
#
#     return jwt.encode(to_encode, REFRESH_SECRET_KEY, algorithm=ALGORITHM)


async def get_current_user(request):
    try:
        get_token: str = request.cookies.get("access")
        if get_token is None:
            return None
        payload = jwt.decode(get_token, SECRET_KEY, algorithms=[ALGORITHM])
        if payload is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials",
                headers={"WWW-Authenticate": "Bearer"}
            )
        user_id = int(payload.get("sub"))
        if not user_id:
            return None
        return user_id
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None


def get_hashed_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(password: str, hashed_password: str) -> bool:
    return pwd_context.verify(password, hashed_password)


def create_admin(data: admin_schema.CreateAdmin, db: Session):
    if not data.email or not data.password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Details not provided.",
        )

    check_user_exists = db.query(admin_model.Admin).filter(admin_model.Admin.email == data.email).first()
    if check_user_exists:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"User with {data.email} already exists"
        )

    user_role = db.query(role_model.Role).filter(role_model.Role.role_type == "user").first()
    if not user_role:
        user_role = role_model.Role(role_type="user")
        db.add(user_role)
        db.commit()
        db.refresh(user_role)

    hashed_password = get_hashed_password(data.password)
    insert_admin = admin_model.Admin(name=data.name,
                                     email=data.email,
                                     password=hashed_password,
                                     role_id=user_role.role_id)
    db.add(insert_admin)
    db.commit()
    db.refresh(insert_admin)

    return insert_admin


def fetch_admin(data, db: Session):
    get_admin = db.query(admin_model.Admin).filter(admin_model.Admin.email == data.username).first()
    if not get_admin:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    if not get_admin or not verify_password(data.password, get_admin.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Credentials"
        )

    return get_admin


def fetch_admin_by_id(data, db: Session):
    get_by_id = db.query(admin_model.Admin).filter(admin_model.Admin.id == data).first()
    if not get_by_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    return get_by_id


def fetch_all(db: Session):
    get_all = db.query(admin_model.Admin).all()

    return get_all
