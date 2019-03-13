import base64

from sqlalchemy import (
    Boolean,
    Column,
    Integer,
    Text,
    LargeBinary,
    ForeignKey,
)
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import JSON

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

    screenshots = relationship("Screenshot", uselist=True)
    statuses = relationship("UrlStatus", uselist=True, back_populates="url")
    validation = relationship("Validation", uselist=False)
    linkchecker = relationship("LinkChecker", uselist=False)

    def __json__(self, request):
        dic = {
            'id': self.url_id,
            'url': self.url,
        }
        screenshots = {}
        for screenshot in self.screenshots:
            screenshots[screenshot.device] = screenshot.screenshot_id
        dic['screenshots'] = screenshots

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

    def set_screenshots(self, screenshots):
        for screenshot in screenshots:
            try:
                existing = next(s for s in self.screenshots
                                if s.device == screenshot['device'])
                existing.screenshot = base64.b64decode(screenshot['base64'])
            except StopIteration:
                new_s = Screenshot(
                    device=screenshot['device'],
                    screenshot=base64.b64decode(screenshot['base64']))
                self.screenshots.append(new_s)

    def get_desktop_screenshot(self):
        for s in self.screenshots:
            if s.device == 'desktop':
                return s


class Screenshot(Base):
    __tablename__ = 'screenshot'
    screenshot_id = Column(Integer, primary_key=True)
    url_id = Column(Integer, ForeignKey("url.url_id"), nullable=False)
    device = Column(Text, nullable=False)
    screenshot = Column(LargeBinary, nullable=False)


class Validation(Base):
    __tablename__ = 'validation'
    validation_id = Column(Integer, primary_key=True)
    url_id = Column(Integer, ForeignKey("url.url_id"), nullable=False)
    valid = Column(Boolean, nullable=True)
    errors = Column(JSON, nullable=True)


class ScreenshotDiff(Base):
    __tablename__ = 'screenshot_diff'
    screenshot_diff_id = Column(Integer, primary_key=True)

    a_url_id = Column(Integer, ForeignKey("url.url_id"), nullable=False)
    b_url_id = Column(Integer, ForeignKey("url.url_id"), nullable=False)

    a_project_version_id = Column(
        Integer,
        ForeignKey("project_version.project_version_id"),
        nullable=False)

    b_project_version_id = Column(
        Integer,
        ForeignKey("project_version.project_version_id"),
        nullable=False)

    diff = Column(LargeBinary, nullable=True)

    a_url = relationship("Url", foreign_keys=[a_url_id])
    b_url = relationship("Url", foreign_keys=[b_url_id])


class UrlStatus(Base):
    __tablename__ = 'url_status'
    url_status_id = Column(Integer, primary_key=True)
    url_id = Column(Integer, ForeignKey("url.url_id"), nullable=False)
    device = Column(Text, nullable=False)
    status = Column(Text, nullable=False)
    url = relationship("Url", back_populates="statuses")


class LinkChecker(Base):
    __tablename__ = 'linkchecker'
    linkchecker_id = Column(Integer, primary_key=True)
    url_id = Column(Integer, ForeignKey("url.url_id"), nullable=False)
    result = Column(JSON, nullable=False)
    valid = Column(Boolean, nullable=False)
    url = relationship("Url")
