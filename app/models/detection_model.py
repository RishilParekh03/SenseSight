# from sqlalchemy import Column, Integer, VARCHAR, DateTime, Boolean
#
# from datetime import datetime
#
# from app.config.database import Base
#
#
# class Detection(Base):
#     __tablename__ = 'detections'
#
#     id = Column("id", Integer, primary_key=True, index=True)
#     detection = Column("detection", VARCHAR(255), nullable=False)
#     input_file = Column("input_file", VARCHAR(255), nullable=False)
#     output_file = Column("output_file", VARCHAR(255), nullable=False)
#     created_at = Column("created_at", DateTime, default=datetime.utcnow)
#     modified_at = Column("modified_at", DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
#     is_deleted = Column("is_deleted", Boolean, default=False)