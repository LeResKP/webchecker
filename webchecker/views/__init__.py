from pyramid.view import view_defaults


@view_defaults(renderer='json')
class BaseView():

    def __init__(self, request):
        self.request = request
