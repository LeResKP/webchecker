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
    diff = request.dbsession.query(ScreenshotDiff).get(
        request.matchdict['screenshot_diff_id'])

    a_version_id = int(request.matchdict['a_version_id'])

    if a_version_id == diff.a_url.project_version_id:
        a_url = diff.a_url
        b_url = diff.b_url
    else:
        a_url = diff.b_url
        b_url = diff.a_url

    if diff.diff:
        return {
            'a_url_id': a_url.get_desktop_screenshot().screenshot_id,
            'b_url_id': b_url.get_desktop_screenshot().screenshot_id,
            # TODO: we should be able to remove it since we already have it in
            # the component.
            'screenshot_diff_id': diff.screenshot_diff_id,
        }
    return {}


@view_config(route_name='diff_urls', request_method='GET', renderer='json')
def get_diff_urls(request):
    a_version_id = request.matchdict['a_version_id']
    b_version_id = request.matchdict['b_version_id']
    from sqlalchemy import or_, and_
    diffs = request.dbsession.query(ScreenshotDiff).filter(
        or_(
            and_(ScreenshotDiff.a_project_version_id == a_version_id,
                 ScreenshotDiff.b_project_version_id == b_version_id),
            and_(ScreenshotDiff.a_project_version_id == b_version_id,
                 ScreenshotDiff.b_project_version_id == a_version_id)
        )).all()

    res = []
    for d in diffs:
        res.append({
            'url': (d.a_url or d.b_url).url,
            'url_id': d.screenshot_diff_id,
            'status': {},
        })
    return res


@view_config(route_name='validation_urls',
             request_method='GET', renderer='json')
def get_valdiation_urls(request):
    pv = request.dbsession.query(ProjectVersion).get(
        request.matchdict['version_id'])

    if not pv:
        raise exc.HTTPBadRequest()

    lis = []
    for url in pv.urls:
        lis.append({
            'url_id': url.url_id,
            'url': url.url,
            'w3c_valid': url.validation.valid,
            'linkchecker_valid': url.linkchecker.valid,
            'valid': url.validation.valid and url.linkchecker.valid,
        })
    return lis


def includeme(config):
    config.add_route('urls', '/api/v/:version_id/urls')
    config.add_route('validation_urls', '/api/v/:version_id/validations')
    config.add_route('diff_urls', '/api/v/:a_version_id/d/:b_version_id/urls')
    config.add_route('url', '/api/urls/:url_id')
    config.add_route('screenshot_diff',
                     '/api/diff/:a_version_id/screenshots/:screenshot_diff_id')
    config.add_route('diff_image', '/api/diff/:id')
