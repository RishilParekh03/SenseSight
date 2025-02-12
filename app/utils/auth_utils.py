from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jwt import InvalidTokenError
from passlib.context import CryptContext
from sqlalchemy.orm import Session

from datetime import datetime, timedelta
import jwt

from app.models import admin_model
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
        expire_delta = datetime.utcnow() + expire_delta
    else:
        expire_delta = datetime.utcnow() + timedelta(minutes=ACCESS_EXPIRY)
    to_encode.update({"exp": expire_delta})

    payload = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

    return payload


# def create_refresh_token(data: dict, expire_delta: timedelta = None):
#     to_encode = data.copy()
#     if expire_delta:
#         expire_delta = datetime.utcnow() + expire_delta
#     else:
#         expire_delta = datetime.utcnow() + timedelta(minutes=REFRESH_EXPIRY)
#     to_encode.update({"exp": expire_delta})
#
#     return jwt.encode(to_encode, REFRESH_SECRET_KEY, algorithm=ALGORITHM)


def decode_token(token: str, credentials_exception):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except InvalidTokenError:
        return credentials_exception


def get_current_user(token: str = Depends(oauth)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    payload = decode_token(token, credentials_exception)
    print(f"Payload: {payload}")

    return payload


# class JWTBearer(HTTPBearer):
#     def __init__(self, auto_error: bool = True):
#         super(JWTBearer, self).__init__(auto_error=auto_error)
#
#     async def __call__(self, request: Request):
#         credentials: HTTPAuthorizationCredentials = await super(JWTBearer, self).__call__(request)
#         print(f">>>>>>>>>>>>>>>>>>>>{credentials}")
#         print(f">>>>>>>>>>>>>>>>>>>>{credentials.scheme}")
#         print(f">>>>>>>>>>>>>>>>>>>>{credentials.credentials}")
#
#         if credentials:
#             if not credentials.scheme == "Bearer":
#                 print("check 1")
#                 raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid authentication scheme.")
#             if not self.verify_jwt(credentials.credentials):
#                 print("check 2")
#                 raise HTTPException(status_code=status.HTTP_410_GONE, detail="Invalid token or expired token.")
#             return credentials.credentials
#
#         else:
#             print("check 3")
#             raise HTTPException(status_code=status.HTTP_402_PAYMENT_REQUIRED, detail="Invalid authorization code.")
#
#     @staticmethod
#     def verify_jwt(token: str) -> bool:
#         try:
#             payload = decode_token(token)
#             return True
#         except jwt.ExpiredSignatureError:
#             print("error")
#             return False


def get_hashed_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(password: str, hashed_password: str) -> bool:
    return pwd_context.verify(password, hashed_password)


def create_admin(data: admin_schema.CreateAdmin, db: Session):
    if not data.username or not data.password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Details not provided.",
        )

    check_user_exists = db.query(admin_model.Admin).filter(admin_model.Admin.username == data.username).first()
    if check_user_exists:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"User with {data.username} already exists"
        )

    hashed_password = get_hashed_password(data.password)
    insert_admin = admin_model.Admin(name=data.name, username=data.username, password=hashed_password)

    db.add(insert_admin)
    db.commit()
    db.refresh(insert_admin)

    return insert_admin


def fetch_admin(data, db: Session):
    get_admin = db.query(admin_model.Admin).filter(admin_model.Admin.username == data.username).first()
    if not get_admin:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="User not found")
    if not get_admin or not verify_password(data.password, get_admin.password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="Invalid Credentials")

    return get_admin

def fetch_admin_by_id(id: int, db: Session):
    user = db.query(admin_model.Admin).filter(admin_model.Admin.id == id).first()
    print(user)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    return user

def fetch_all(db: Session):
    get_all = db.query(admin_model.Admin).all()

    return get_all
