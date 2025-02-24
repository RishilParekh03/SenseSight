from sqlalchemy import Integer, Column, VARCHAR, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship

from datetime import datetime

from app.config.database import Base


class Admin(Base):
    __tablename__ = 'users'

    id = Column("id", Integer, primary_key=True, autoincrement=True)
    name = Column("name", VARCHAR(200), nullable=False)
    email = Column("email", VARCHAR(200), unique=True, nullable=False)
    password = Column("password", VARCHAR(800), nullable=False)
    created_at = Column("created_at", DateTime, default=datetime.utcnow)
    modified_at = Column("modified_at", DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    is_deleted = Column("is_deleted", Boolean, default=False)
    role_id = Column("role_id", Integer, ForeignKey("roles.role_id"), nullable=False)
    role = relationship("Role", back_populates="admin")
