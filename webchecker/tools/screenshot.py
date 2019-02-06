import json
from . import node


async def do_screenshot(url):
    return await node.execute('js/screenshot.js', url)
