from os import path, mkdir, listdir
from aiohttp import web
import time

waiting = []

folder_img = './images'

async def index(request):

    return web.Response(text = 'index')

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

async def uploadpage(request):

    hashvalue = request.match_info['hash']

    if not hashvalue in waiting:
        return web.Response( text='<h1>湖人总冠军！</h1>', content_type='text/html')
    
    return web.FileResponse('./upload.html')

async def upload(request):

    if not path.exists(folder_img):
        mkdir(folder_img)

    imgname = request.match_info['hash'] + '.jpg'
    
    # get form data
    data = await request.post()
    b_file = data['file'].file.read()

    try:
        with open(path.join(folder_img, imgname), 'wb') as f:
            f.write(b_file)
            
        return web.Response(test = 'success')

    except:
        return web.Response(text = 'failed')


def setup_routes(app):

    # index html
    app.router.add_get('/', index)

    app.router.add_static('/img/', path='images', name='images')
    app.router.add_static('/cdn/', path='cdn', name='cdn')

    app.router.add_get('/uploadhash', upload_hash)

    app.router.add_get('/uploadpage/{hash}', uploadpage)

    app.router.add_post('/upload/img/{hash}', upload)