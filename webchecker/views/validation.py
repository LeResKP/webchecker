import pyramid.httpexceptions as exc
from pyramid.view import view_config

from ..models import LinkChecker, ProjectVersion, Validation

from . import BaseView


class ValidationView(BaseView):

    @view_config(route_name='validations', request_method='GET')
    def get_all(self):
        p_v = self.request.dbsession.query(ProjectVersion).get(
            self.request.matchdict['version_id'])

        if not p_v:
            raise exc.HTTPBadRequest()

        lis = []
        for url in p_v.urls:
            lis.append({
                'url_id': url.url_id,
                'url': url.url,
                'w3c_valid': url.validation.valid,
                'linkchecker_valid': url.linkchecker.valid,
                'valid': url.validation.valid and url.linkchecker.valid,
            })
        return lis

    @view_config(route_name='validation', request_method='GET')
    def get(self):
        val = self.request.dbsession.query(Validation).filter_by(
            url_id=self.request.matchdict['id']).one_or_none()
        if not val:
            raise exc.HTTPNotFound()

        linkchecker = self.request.dbsession.query(LinkChecker).filter_by(
            url_id=self.request.matchdict['id']).one_or_none()

        return {
            'w3c': {
                'valid': val.valid,
                'messages': val.errors['messages'],
            },
            'linkchecker': {
                'result': linkchecker.result,
                'valid': linkchecker.valid,
            }
        }


def includeme(config):
    config.add_route('validations', '/api/v/:version_id/validations')
    config.add_route('validation', '/api/validations/:id')
