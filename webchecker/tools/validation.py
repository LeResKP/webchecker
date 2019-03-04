import asyncio
import json


async def validate(html):
    cmd = ['java', '-jar', 'jar/vnu.jar', '--format', 'json', '-']

    proc = await asyncio.create_subprocess_shell(
        ' '.join(cmd),
        stdin=asyncio.subprocess.PIPE,
        stdout=asyncio.subprocess.PIPE,
        stderr=asyncio.subprocess.PIPE)

    stdout, stderr = await proc.communicate(input=str.encode(html))

    print(f'[{cmd!r} exited with {proc.returncode}]')
    return json.loads(stderr.decode())
