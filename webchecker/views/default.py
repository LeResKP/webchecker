import pyramid.httpexceptions as exc
from pyramid.response import Response
from pyramid.view import view_config


from ..models import Url, UrlBlob


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
