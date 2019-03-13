from pyramid.view import view_config

from ..models import Project
from . import BaseView


class ProjectView(BaseView):

    @view_config(route_name='projects', request_method='GET')
    def get_all(self):
        return self.request.dbsession.query(Project).all()


def includeme(config):
    config.add_route('projects', '/api/projects')
