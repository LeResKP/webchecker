from sqlalchemy import (
    Column,
    Integer,
    Text,
    BLOB,
    ForeignKey,
)
from sqlalchemy.orm import relationship


from .meta import Base


class Url(Base):
    __tablename__ = 'url'
    url_id = Column(Integer, primary_key=True)
    url = Column(Text)
    blobs = relationship("UrlBlob", uselist=True)

    def __json__(self, request):
        return {
            'url_id': self.url_id,
            'url': self.url,
            'blobs': [self.blobs]
        }


class UrlBlob(Base):
    __tablename__ = 'url_blob'
    url_blob_id = Column(Integer, primary_key=True)
    url_id = Column(Integer, ForeignKey("url.url_id"), nullable=False)
    blob = Column(BLOB, nullable=False)
    device = Column(Text, nullable=False)

    def __json__(self, request):
        return {
            'url_blob_id': self.url_blob_id,
            'device': self.device,
        }
