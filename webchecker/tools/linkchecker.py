from urllib.parse import urlparse
import asyncio
import aiohttp
from ..models.constants import (
    STATUS_OK,
    STATUS_WARNING,
    STATUS_ERROR,
)
from . import node


class Page:
    KEYS = [
        'url',
        'ok',
        'http_status',
        'http_status_text',
        'resource_type',
        'redirect_to',

        # Never pass to the __init__ but use in json export
        'path',
    ]

    def __init__(self, **kw):
        for k, value in kw.items():
            if k not in self.KEYS:
                raise ValueError('%s not supported' % k)
            setattr(self, k, value)
        if self.redirect_to:
            self.redirect_to = self.__class__(**self.redirect_to)

        self.path = urlparse(self.url).path
        self.resources = []
        self.urls = []

    def to_str(self, indent=0):
        s = []
        indentation = indent * ' '
        s.append(f'{indentation}Url: {self.url}')
        s.append(f'{indentation}Status: {self.http_status} {self.http_status_text}')
        if self.redirect_to:
            s.append(f'{indentation}Redirect:')
            s.append(self.redirect_to.to_str(indent+2))

        if self.resources:
            s.append('')
            s.append(f'{indentation}Resources')
            for res in self.resources:
                s.append(res.to_str(indent+2))

        if self.urls:
            s.append('')
            s.append(f'{indentation}Urls')
            for url in self.urls:
                s.append(url.to_str(indent+2))
        return '\n'.join(s)

    def _get_status(self):
        if self.http_status == 200:
            return STATUS_OK

        if 300 <= self.http_status < 400:
            return STATUS_WARNING

        return STATUS_ERROR

    def get_resources_status(self):
        if self.redirect_to:
            return self.redirect_to.get_resources_status()

        if not self.resources:
            return STATUS_OK

        return max([r._get_status() for r in self.resources])

    def get_links_status(self):
        if self.redirect_to:
            return self.redirect_to.get_links_status()

        if not self.urls:
            return STATUS_OK

        return max([u._get_status() for u in self.urls])

    def get_status(self):
        return max([
            self._get_status(),
            self.get_resources_status(),
            self.get_links_status()
        ])

    def is_valid(self):
        return self.get_status() == STATUS_OK

    def to_json(self):
        dic = {}
        for key in self.KEYS:
            dic[key] = getattr(self, key, None)
            if key == 'redirect_to' and dic[key]:
                dic[key] = dic[key].to_json()

        for key in ['resources', 'urls']:
            dic[key] = [o.to_json() for o in getattr(self, key, [])]

        dic['page_status'] = self._get_status()
        dic['resources_status'] = self.get_resources_status()
        dic['urls_status'] = self.get_links_status()
        return dic


def parse_aiohttp_response(response):
    """Returns the same data than checker.js
    """
    return {
        'url': response.url.human_repr(),  # perhaps we should use the real_url
        'ok': response.status == 200,
        'http_status': response.status,
        'http_status_text': response.reason,
        'resource_type': 'document',  # like same type as google chrome
        'redirect_to': None,
    }


async def fast_check_url(url):
    # TODO: add a cache
    async with aiohttp.ClientSession() as session:
        async with session.head(url, allow_redirects=True) as response:
            page = None
            for res in reversed(list(response.history) + [response]):
                new_page = parse_aiohttp_response(res)
                new_page['redirect_to'] = page
                page = new_page
            return page


async def check_dependency_urls(urls):
    done, pending = await asyncio.wait([fast_check_url(url) for url in urls])
    assert(not pending)
    return done


async def check_url(url):
    dic = await node.execute('js/linkchecker.js', url)
    page = Page(**dic['page'])

    p = page
    while p.redirect_to:
        p = p.redirect_to

    for res in dic['resources']:
        p.resources.append(Page(**res))

    if dic['links']:
        urls = await check_dependency_urls(dic['links'])
        urls = [Page(**url.result()) for url in urls]
        p.urls = urls
        return page
