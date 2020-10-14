from os import path, mkdir, listdir
from aiohttp import web
import time

waiting = []

folder_img = './images'


async def index(request):

    return web.Response(text='index')


async def upload_hash(request):

    if not path.exists(folder_img):
        mkdir(folder_img)

    t = str(time.time())
    hashstr = str(hash(t))[1:]

    names = listdir(folder_img)

    while hashstr in names:
        hashstr = str(hash(hashstr + '+'))[1:]

    waiting.append(hashstr)

    return web.json_response({
        'upload': '/uploadpage/%s' % hashstr,
        'get': '/img/%s.jpg' % hashstr
    })


async def upload(request):

    if not path.exists(folder_img):
        mkdir(folder_img)

    reader = await request.multipart()
    field = await reader.next()

    hashvalue = request.match_info['hash']

    if not hashvalue in waiting:
        return web.Response(test='denied') 

    waiting.remove(hashvalue)
    imgname = hashvalue + '.jpg'

    try:
        with open(path.join(folder_img, imgname), 'wb') as f:
            while True:
                chunk = await field.read_chunk()  # 8192 bytes by default.
                if not chunk:
                    break
                
                f.write(chunk)

        return web.Response(test='success')

    except:
        return web.Response(text='failed')


async def uploadpage(request):

    hashvalue = request.match_info['hash']

    if not hashvalue in waiting:
        return web.FileResponse('./kiki.html')

    return web.FileResponse('./upload.html')


async def kris(request):
    return web.FileResponse('./upload.html')


async def image(request):
    # 参数解析，本地路径合成
    imagename = request.match_info['name']
    imagepath = path.join(folder_img, imagename)
    # 如果有就返回文件
    if path.exists(imagepath):
        return web.FileResponse(imagepath)
    # 没有就返回字符串
    return web.Response(text='no')



def setup_routes(app):

    # index html
    app.router.add_get('/', index)

    app.router.add_static('/cdn/', path='cdn', name='cdn')

    app.router.add_get('/uploadhash', upload_hash)

    app.router.add_get('/uploadpage/{hash}', uploadpage)

    app.router.add_post('/upload/img/{hash}', upload)

    app.router.add_get('/img/{name}', image)

    app.router.add_get('/kris', kris)
