import asyncio
import os
import sys

from pyramid.paster import (
    get_appsettings,
    setup_logging,
    )
from pyramid.scripts.common import parse_vars
from webchecker.models import (
    Screenshot,
    ScreenshotDiff,
    Url,
    get_engine,
    get_session_factory,
    )
from webchecker.tools.screenshot import do_screenshot
from webchecker.tools.screenshot_diff import compare_blobs


TASK_SCREENSHOT = 'screenshot'
TASK_SCREENSHOT_DIFF = 'screenshot_diff'


def get_screenshot_tasks(session_factory):
    dbsession = session_factory()
    urls = dbsession.query(Url).outerjoin(Screenshot).filter(
        Screenshot.screenshot_id == None).all()
    return [(TASK_SCREENSHOT, (u.url_id, u.url)) for u in urls]


def get_screenshot_diff_tasks(session_factory):
    dbsession = session_factory()

    # TODO: do not hardcode version here
    a_version = 1
    b_version = 2

    # TODO: support having difference in a_urls and b_urls
    lis = []
    urls = dbsession.query(Url).filter_by(project_version_id=a_version).all()

    # TODO: optimize query to get tasks to do.
    for a_url in urls:
        b_url = dbsession.query(Url).filter_by(
            url=a_url.url, project_version_id=b_version).one()
        if dbsession.query(ScreenshotDiff).filter_by(
                a_url_id=a_url.url_id, b_url_id=b_url.url_id).all():
            # We already have the diff
            continue

        lis.append((TASK_SCREENSHOT_DIFF, (a_url, b_url)))
    return lis


def get_tasks(session_factory):
    tasks = []
    tasks = get_screenshot_tasks(session_factory)
    if tasks:
        # Do screenshot tasks first since we need the screenshot to make the
        # diff
        return tasks
    tasks = get_screenshot_diff_tasks(session_factory)
    if tasks:
        return tasks
    return None


async def screenshot(session_factory, url_id, url):
    screenshots = await do_screenshot(url)
    dbsession = session_factory()
    url_obj = dbsession.query(Url).get(url_id)
    url_obj.set_screenshots(screenshots)
    dbsession.add(url_obj)
    dbsession.commit()


async def screenshot_diff(session_factory, a_url, b_url):
    a_s = [s for s in a_url.screenshots if s.device == 'desktop'][0]
    b_s = [s for s in b_url.screenshots if s.device == 'desktop'][0]

    diff_img = compare_blobs(a_s.screenshot, b_s.screenshot)

    dbsession = session_factory()

    url_diff = ScreenshotDiff()
    url_diff.a_url_id = a_url.url_id
    url_diff.b_url_id = b_url.url_id
    url_diff.diff = diff_img
    dbsession.add(url_diff)
    dbsession.commit()


async def consume(queue, session_factory):

    while True:
        task_type, data = await queue.get()
        if task_type == TASK_SCREENSHOT:
            await screenshot(session_factory, *data)
        elif task_type == TASK_SCREENSHOT_DIFF:
            await screenshot_diff(session_factory, *data)
        else:
            raise NotImplementedError()

        queue.task_done()


async def run(session_factory, loop):

    queue = asyncio.Queue(loop=loop)
    [asyncio.create_task(consume(queue, session_factory))
     for i in range(8)]

    while True:
        tasks = get_tasks(session_factory)
        if not tasks:
            await asyncio.sleep(10)
            continue

        [queue.put_nowait(t) for t in tasks]
        await queue.join()


def usage(argv):
    cmd = os.path.basename(argv[0])
    print('usage: %s <config_uri> [var=value]\n'
          '(example: "%s development.ini")' % (cmd, cmd))
    sys.exit(1)


def main(argv=sys.argv):
    if len(argv) < 2:
        usage(argv)
    config_uri = argv[1]
    options = parse_vars(argv[2:])
    setup_logging(config_uri)
    settings = get_appsettings(config_uri, options=options)

    engine = get_engine(settings)
    session_factory = get_session_factory(engine)

    loop = asyncio.get_event_loop()
    try:
        loop.run_until_complete(run(session_factory, loop))
    except KeyboardInterrupt:
        pass
    finally:
        print("Closing Loop")
        loop.close()


if __name__ == '__main__':
    main()
