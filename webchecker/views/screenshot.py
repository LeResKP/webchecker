
import pyramid.httpexceptions as exc
from pyramid.response import Response
from pyramid.view import view_config

from ..models import Screenshot, Url, UrlStatus

from . import BaseView


class ScreenshotView(BaseView):

    @view_config(route_name='screenshot', request_method='GET')
    def get(self):
        screenshot = self.request.dbsession.query(Screenshot).filter_by(
            screenshot_id=self.request.matchdict['screenshot_id']).one_or_none()
        if not screenshot:
            raise exc.HTTPNotFound()
        return Response(screenshot.screenshot, content_type='image/png', status=200)


@view_config(route_name='update_status', request_method='PUT', renderer='json')
def update_status(request):
    status = request.dbsession.query(UrlStatus).filter_by(
        url_status_id=request.matchdict['url_status_id']).one_or_none()
    if not status:
        raise exc.HTTPNotFound()
    status.status = request.json_body['status']
    return status.url


@view_config(route_name='create_status', request_method='POST', renderer='json')
def create_status(request):
    url = request.dbsession.query(Url).filter_by(
        url_id=request.matchdict['url_id']).one_or_none()
    if not url:
        raise exc.HTTPNotFound()
    for status in url.statuses:
        if status.device == request.json_body['device']:
            raise exc.HTTPBadRequest()

    url.statuses.append(UrlStatus(**request.json_body))
    return url


# Need for cors
@view_config(route_name='update_status', request_method='OPTIONS', renderer='json')
@view_config(route_name='create_status', request_method='OPTIONS', renderer='json')
def options(request):
    return {}


def includeme(config):
    config.add_route('screenshot', '/api/screenshots/:screenshot_id.png')
    config.add_route('create_status', '/api/urls/:url_id/status')
    config.add_route('update_status', '/api/status/:url_status_id')
