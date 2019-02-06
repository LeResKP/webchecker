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
    Url,
    get_engine,
    get_session_factory,
    )
from webchecker.tools.screenshot import do_screenshot


TASK_SCREENSHOT = 'screenshot'


def get_tasks(session_factory):
    dbsession = session_factory()
    urls = dbsession.query(Url).outerjoin(Screenshot).filter(
        Screenshot.screenshot_id == None).all()
    return [(TASK_SCREENSHOT, (u.url_id, u.url)) for u in urls]


async def consume(queue, session_factory):

    while True:
        task_type, data = await queue.get()
        if task_type == TASK_SCREENSHOT:
            url_id, url = data
            screenshots = await do_screenshot(url)
            dbsession = session_factory()
            url_obj = dbsession.query(Url).get(url_id)
            url_obj.set_screenshots(screenshots)
            dbsession.add(url_obj)
            dbsession.commit()

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
