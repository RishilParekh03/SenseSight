from sqlalchemy import Integer, Column, VARCHAR, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.config.database import Base


class Admin(Base):
    __tablename__ = 'admin'

    id = Column("admin_id", Integer, primary_key=True, autoincrement=True)
    name = Column("name", VARCHAR(200), nullable=False)
    username = Column("username", VARCHAR(200), unique=True, nullable=False)
    password = Column("password", VARCHAR(800), nullable=False)
    created_at = Column("created_at", DateTime, default=datetime.utcnow)
    modified_at = Column("modified_at", DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    is_deleted = Column("is_deleted", Boolean, default=False)
    # role_id = Column("role_id", Integer, ForeignKey("role.id"), nullable=False)
