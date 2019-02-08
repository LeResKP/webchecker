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


@view_config(route_name='diff_image', request_method='GET')
def get_diff_image(request):
    sd = request.dbsession.query(ScreenshotDiff).get(request.matchdict['id'])
    if not sd:
        raise exc.HTTPNotFound()
    return Response(sd.diff, content_type='image/png', status=200)


@view_config(route_name='diff', request_method='GET', renderer='json')
def diff(request):
    a_url = request.dbsession.query(Url).get(request.matchdict['id'])
    diff = request.dbsession.query(ScreenshotDiff).filter_by(b_url_id=a_url.url_id).one()
    if diff.diff:
        return {
            'a_url_id': diff.a_url.get_desktop_screenshot().screenshot_id,
            'b_url_id': diff.b_url.get_desktop_screenshot().screenshot_id,
            'screenshot_diff_id': diff.screenshot_diff_id,
        }
    return {}


def includeme(config):
    config.add_route('urls', '/api/v/:version_id/urls')
    config.add_route('url', '/api/urls/:url_id')
    config.add_route('diff', '/api/urls/:id/diff')
    config.add_route('diff_image', '/api/diff/:id')
