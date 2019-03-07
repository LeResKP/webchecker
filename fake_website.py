from http.server import HTTPServer, BaseHTTPRequestHandler


INDEX_HTML = b'''
<!DOCTYPE html>
<html>
<head>
  <title>Home</title>
  <link href="/style.css" rel="stylesheet" type="text/css" />
  <link href="/redirect301.css" rel="stylesheet" type="text/css" />
  <link href="/redirect301to404.css" rel="stylesheet" type="text/css" />
</head>
<body>
    Hello world!
    <a href="/page">Page</a>
    <a href="/redirect302">Redirect 302</a>
    <a href="/redirect301">Redirect 301</a>
    <a href="/redirect301to302">Redirect 301 to 302</a>
    <a href="/404">404</a>
</body>
</html>
'''

OK_INDEX_HTML = b'''
<!DOCTYPE html>
<html>
<head>
  <title>Ok</title>
  <link href="/style.css" rel="stylesheet" type="text/css" />
</head>
<body>
    Hello world!
    <a href="/page">Page</a>
</body>
</html>
'''

WARNING_INDEX_HTML = b'''
<html>
<head>
  <link href="/style.css" rel="stylesheet" type="text/css" />
  <link href="/redirect301.css" rel="stylesheet" type="text/css" />
</head>
<body>
    Hello world!
    <a href="/page">Page</a>
    <a href="/redirect301">Redirect 301</a>
</body>
</html>
'''


class SimpleHTTPRequestHandler(BaseHTTPRequestHandler):

    urls = [
        '/',
        '/ok',
        '/warning',
        '/redirect302',
        '/redirect301',
        '/redirect301to302',
    ]

    host = 'http://localhost:8000'

    def sitemap(self):
        s = '<urlset xmlns="http://www.google.com/schemas/sitemap/0.84">'
        for url in self.urls:
            s += f'<url><loc>{self.host}{url}</loc></url>'
        s += '</urlset>'
        self.send_response(200)
        self.end_headers()
        b = bytearray()
        b.extend(map(ord, s))
        self.wfile.write(b)

    def redirect302(self, url):
        self.send_response(302)
        self.send_header('Location', url)
        self.end_headers()

    def redirect301(self, url):
        self.send_response(301)
        self.send_header('Location', url)
        self.end_headers()

    def not_found404(self):
        self.send_response(404)
        self.end_headers()
        self.wfile.write(b'')

    def do_HEAD(self):
        return self.do_GET()

    def do_GET(self):
        if self.path == '/redirect301to302':
            return self.redirect301('/redirect302')

        if self.path == '/redirect302':
            return self.redirect302('/')

        if self.path == '/redirect301':
            return self.redirect301('/')

        if self.path == '/sitemap.xml':
            return self.sitemap()

        if self.path == '/style.css':
            self.send_response(200)
            self.end_headers()
            self.wfile.write(b'')

        if self.path == '/redirect301.css':
            return self.redirect301('/style.css')

        if self.path == '/redirect301to404.css':
            return self.redirect301('/404.css')

        if self.path == '/':
            self.send_response(200)
            self.end_headers()
            self.wfile.write(INDEX_HTML)
            return

        if self.path == '/ok':
            self.send_response(200)
            self.end_headers()
            self.wfile.write(OK_INDEX_HTML)
            return

        if self.path == '/warning':
            self.send_response(200)
            self.end_headers()
            self.wfile.write(WARNING_INDEX_HTML)
            return

        if self.path == '/page':
            self.send_response(200)
            self.end_headers()
            self.wfile.write(b'')
            return

        self.not_found404()


if __name__ == '__main__':
    httpd = HTTPServer(('localhost', 8000), SimpleHTTPRequestHandler)
    httpd.serve_forever()
