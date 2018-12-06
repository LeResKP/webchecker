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
        dic = {
            'url_id': self.url_id,
            'url': self.url,
        }
        blobs = {}
        for blob in self.blobs:
            blobs[blob.device] = blob.url_blob_id
        dic['blobs'] = blobs
        return dic


class UrlBlob(Base):
    __tablename__ = 'url_blob'
    url_blob_id = Column(Integer, primary_key=True)
    url_id = Column(Integer, ForeignKey("url.url_id"), nullable=False)
    device = Column(Text, nullable=False)
    blob = Column(BLOB, nullable=False)
