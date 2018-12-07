import pyramid.httpexceptions as exc
from pyramid.response import Response
from pyramid.view import view_config

import base64
import requests
import transaction

from ..models import Url, UrlBlob, UrlStatus


@view_config(route_name='urls', request_method='GET', renderer='json')
def get_urls(request):
    return request.dbsession.query(Url).all()


@view_config(route_name='blobs', request_method='GET')
def get_blob(request):
    blob = request.dbsession.query(UrlBlob).filter_by(
        url_blob_id=request.matchdict['id']).one_or_none()
    if not blob:
        raise exc.HTTPNotFound()
    return Response(blob.blob, content_type='image/png', status=200)


@view_config(route_name='update_status', request_method='PUT', renderer='json')
def update_status(request):
    status = request.dbsession.query(UrlStatus).filter_by(
        url_status_id=request.matchdict['id']).one_or_none()
    if not status:
        raise exc.HTTPNotFound()
    status.status = request.json_body['status']
    return status.url


@view_config(route_name='create_status', request_method='POST', renderer='json')
def create_status(request):
    url = request.dbsession.query(Url).filter_by(
        url_id=request.matchdict['id']).one_or_none()
    if not url:
        raise exc.HTTPNotFound()
    for status in url.statuses:
        if status.device == request.json_body['device']:
            raise exc.HTTPBadRequest()

    url.statuses.append(UrlStatus(**request.json_body))
    return url


@view_config(route_name='screenshot', request_method='POST', renderer='json')
def do_screenshot(request):
    url = request.dbsession.query(Url).filter_by(
        url_id=request.matchdict['id']).one_or_none()
    if not url:
        raise exc.HTTPNotFound()

    r = requests.get('http://localhost:3000/', {'url': url.url})

    with transaction.manager as tx:
        # Since we are generating new screenshot, unvalidate the statuses
        for status in url.statuses:
            request.dbsession.delete(status)

        url.statuses = []

        for blob in url.blobs:
            request.dbsession.delete(blob)
        url.blobs = []

        for b in r.json()['data']:
            url.blobs.append(
                UrlBlob(device=b['device'],
                        blob=base64.decodestring(b['base64'])))
        tx.commit()

    return request.dbsession.query(Url).filter_by(
        url_id=request.matchdict['id']).one()


# Need for cors
@view_config(route_name='update_status', request_method='OPTIONS', renderer='json')
@view_config(route_name='create_status', request_method='OPTIONS', renderer='json')
@view_config(route_name='screenshot', request_method='OPTIONS', renderer='json')
def options(request):
    return {}
