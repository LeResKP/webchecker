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


@view_config(route_name='screenshot_diff', request_method='GET', renderer='json')
def screenshot_diff(request):
    diff = request.dbsession.query(ScreenshotDiff).get(request.matchdict['id'])
    # TODO: we need the version to make the diff in the right order
    # b_id = int(request.matchdict['b_id'])

    # if b_id == diff.b_url.url_id:
    #     a_url = diff.a_url
    #     b_url = diff.b_url
    # else:
    #     a_url = diff.b_url
    #     b_url = diff.a_url

    if diff.diff:
        return {
            'a_url_id': diff.a_url.get_desktop_screenshot().screenshot_id,
            'b_url_id': diff.b_url.get_desktop_screenshot().screenshot_id,
            'screenshot_diff_id': diff.screenshot_diff_id,
        }
    return {}


@view_config(route_name='diff_urls', request_method='GET', renderer='json')
def get_diff_urls(request):
    a_version_id = request.matchdict['a_version_id']
    b_version_id = request.matchdict['b_version_id']
    from sqlalchemy import or_
    diffs = request.dbsession.query(ScreenshotDiff).filter(
        or_(ScreenshotDiff.a_project_version_id == a_version_id,
            ScreenshotDiff.b_project_version_id == b_version_id)
    )

    res = []
    for d in diffs:
        res.append({
            'url': (d.a_url or d.b_url).url,
            'url_id': d.screenshot_diff_id,
            'status': {},
        })
    return res


def includeme(config):
    config.add_route('urls', '/api/v/:version_id/urls')
    config.add_route('diff_urls', '/api/v/:a_version_id/d/:b_version_id/urls')
    config.add_route('url', '/api/urls/:url_id')
    config.add_route('screenshot_diff', '/api/urls/:id/diff')
    config.add_route('diff_image', '/api/diff/:id')
