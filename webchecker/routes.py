def includeme(config):
    config.add_static_view('static', 'static', cache_max_age=3600)
    config.add_route('screenshots', '/api/screenshots/:id')
    config.add_route('update_status', '/api/status/:id')
    config.add_route('create_status', '/api/urls/:id/status')
    config.add_route('screenshot', '/api/screenshots/:id')
    config.add_route('validation', '/api/urls/:id/validation')
    config.include('.views.project')
    config.include('.views.url')
