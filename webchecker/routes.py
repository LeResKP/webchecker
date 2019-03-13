def includeme(config):
    config.add_static_view('static', 'static', cache_max_age=3600)
    config.include('.views.diff')
    config.include('.views.project')
    config.include('.views.screenshot')
    config.include('.views.url')
    config.include('.views.validation')
