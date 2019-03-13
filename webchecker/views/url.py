import pyramid.httpexceptions as exc
from pyramid.response import Response
from pyramid.view import view_config, view_defaults

from ..models import ProjectVersion, ScreenshotDiff, Url


@view_defaults(renderer='json')
class UrlView(object):

    def __init__(self, request):
        self.request = request

    @view_config(route_name='urls', request_method='GET')
    def get_all(self):
        pv = self.request.dbsession.query(ProjectVersion).get(
            self.request.matchdict['version_id'])

        if not pv:
            raise exc.HTTPBadRequest()
        return pv.urls

    @view_config(route_name='url', request_method='GET')
    def get(self):
        url = self.request.dbsession.query(Url).get(
            self.request.matchdict['url_id'])

        if not url:
            raise exc.HTTPBadRequest()
        return url


def includeme(config):
    config.add_route('urls', '/api/v/:version_id/urls')
    config.add_route('url', '/api/urls/:url_id')
