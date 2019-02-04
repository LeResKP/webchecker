from pyramid.response import Response
from pyramid.view import view_config, view_defaults

from ..models import Project


@view_defaults(renderer='json')
class ProjectView(object):

    def __init__(self, request):
        self.request = request

    @view_config(route_name='projects', request_method='GET')
    def get(self):
        return self.request.dbsession.query(Project).all()


def includeme(config):
    config.add_route('projects', '/api/projects')
