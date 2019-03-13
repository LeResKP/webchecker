import pyramid.httpexceptions as exc
from pyramid.response import Response
from pyramid.view import view_config

from ..models import ScreenshotDiff

from . import BaseView


class DiffView(BaseView):

    @view_config(route_name='diffs', request_method='GET', renderer='json')
    def get_all(self):
        a_version_id = self.request.matchdict['a_version_id']
        b_version_id = self.request.matchdict['b_version_id']
        from sqlalchemy import or_, and_
        diffs = self.request.dbsession.query(ScreenshotDiff).filter(
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
                'has_diff': bool(d.diff),
            })
        return res

    @view_config(route_name='diff_image', request_method='GET')
    def get(self):
        s_d = self.request.dbsession.query(ScreenshotDiff).get(
           self. request.matchdict['id'])
        if not s_d:
            raise exc.HTTPNotFound()
        return Response(s_d.diff, content_type='image/png', status=200)

    @view_config(route_name='screenshot_diff', request_method='GET', renderer='json')
    def screenshot_diff(self):
        diff = self.request.dbsession.query(ScreenshotDiff).get(
            self.request.matchdict['screenshot_diff_id'])

        a_version_id = int(self.request.matchdict['a_version_id'])

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
                # TODO: we should be able to remove it since we already have it
                # in the component.
                'screenshot_diff_id': diff.screenshot_diff_id,
            }
        return {}


def includeme(config):
    config.add_route('diffs', '/api/v/:a_version_id/d/:b_version_id/diffs')
    config.add_route('diff_image', '/api/diff/:id.png')
    config.add_route('screenshot_diff',
                     '/api/v/:a_version_id/diffs/:screenshot_diff_id')
