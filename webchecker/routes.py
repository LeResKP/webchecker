def includeme(config):
    config.add_static_view('static', 'static', cache_max_age=3600)
    config.add_route('blobs', '/api/blobs/:id')
    config.add_route('urls', '/api/urls')
    config.add_route('update_status', '/api/status/:id')
    config.add_route('create_status', '/api/urls/:id/status')
    config.add_route('screenshot', '/api/screenshots/:id')
