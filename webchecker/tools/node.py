import asyncio
import json


async def execute(js_script, *args):
    cmd = ['node', js_script]
    cmd += args

    print('CMD', cmd)
    proc = await asyncio.create_subprocess_shell(
        ' '.join(cmd),
        stdout=asyncio.subprocess.PIPE,
        stderr=asyncio.subprocess.PIPE)

    stdout, stderr = await proc.communicate()

    print(f'[{cmd!r} exited with {proc.returncode}]')
    # if stdout:
    #     print(f'[stdout]\n{stdout.decode()}')
    if stderr:
        print(f'[stderr]\n{stderr.decode()}')

    return json.loads(stdout.decode())
