from sqlalchemy import (
    Column,
    Integer,
    Text,
    BLOB,
    ForeignKey,
)
from sqlalchemy.orm import relationship

from .meta import Base


class Project(Base):
    __tablename__ = 'project'

    project_id = Column(Integer, primary_key=True)
    name = Column(Text)
    versions = relationship("ProjectVersion", uselist=True,
                            back_populates="project")

    def __json__(self, request):
        return {
            'id': self.project_id,
            'name': self.name,
            'versions': self.versions,
            'current_version': self.versions[-1],
        }


class ProjectVersion(Base):
    __tablename__ = 'project_version'

    project_version_id = Column(Integer, primary_key=True)
    project_id = Column(Integer, ForeignKey("project.project_id"),
                        nullable=False)
    version = Column(Integer, default=0)

    urls = relationship("Url", uselist=True)
    project = relationship("Project")

    def __json__(self, request):
        return {
            'id': self.project_version_id,
            'version': self.version,
        }
