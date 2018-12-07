import base64
import os
import sys
import transaction
import requests

from pyramid.paster import (
    get_appsettings,
    setup_logging,
    )

from pyramid.scripts.common import parse_vars

from ..models.meta import Base
from ..models import (
    get_engine,
    get_session_factory,
    get_tm_session,
    )
from ..models import Url, UrlBlob

# Put the urls to put in the DB here
URLS = []


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
    Base.metadata.create_all(engine)

    session_factory = get_session_factory(engine)

    with transaction.manager:
        dbsession = get_tm_session(session_factory, transaction.manager)

        for u in URLS:
            url = Url(url=u)
            r = requests.get('http://localhost:3000/', {'url': u})
            for b in r.json()['data']:
                url.blobs.append(
                    UrlBlob(device=b['device'],
                            blob=base64.decodestring(b['base64'])))
            dbsession.add(url)
