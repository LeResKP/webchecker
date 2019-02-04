from sqlalchemy import (
    Column,
    Integer,
    Text,
    LargeBinary,
    ForeignKey,
)
from sqlalchemy.orm import relationship


from .meta import Base
from .constants import (
    DEVICES,
    STATUS_BAD,
    STATUS_GOOD,
)


class Url(Base):
    __tablename__ = 'url'
    url_id = Column(Integer, primary_key=True)
    url = Column(Text)
    project_version_id = Column(
        Integer, ForeignKey("project_version.project_version_id"),
        nullable=False)

    blobs = relationship("UrlBlob", uselist=True)
    statuses = relationship("UrlStatus", uselist=True, back_populates="url")

    def __json__(self, request):
        dic = {
            'url_id': self.url_id,
            'url': self.url,
        }
        blobs = {}
        for blob in self.blobs:
            blobs[blob.device] = blob.url_blob_id
        dic['blobs'] = blobs

        statuses = {}
        for status in self.statuses:
            statuses[status.device] = {
                'status': status.status,
                'id': status.url_status_id,
            }

        status_dic = {
            'devices': statuses,
            'status': None,
        }

        if any(v['status'] == STATUS_BAD for v in statuses.values()):
            status_dic['status'] = STATUS_BAD
        elif (all(v['status'] == STATUS_GOOD for v in statuses.values()) and
                len(statuses.values()) == len(DEVICES)):
            status_dic['status'] = STATUS_GOOD

        dic['status'] = status_dic
        return dic


class UrlBlob(Base):
    __tablename__ = 'url_blob'
    url_blob_id = Column(Integer, primary_key=True)
    url_id = Column(Integer, ForeignKey("url.url_id"), nullable=False)
    device = Column(Text, nullable=False)
    blob = Column(LargeBinary, nullable=False)


class UrlStatus(Base):
    __tablename__ = 'url_status'
    url_status_id = Column(Integer, primary_key=True)
    url_id = Column(Integer, ForeignKey("url.url_id"), nullable=False)
    device = Column(Text, nullable=False)
    status = Column(Text, nullable=False)
    url = relationship("Url", back_populates="statuses")
