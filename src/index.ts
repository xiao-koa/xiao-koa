import 'reflect-metadata'

import Koa, { Middleware } from 'koa'
import bodyparser from 'koa-bodyparser'
import KoaRouter from 'koa-router'
import YAML from 'yamljs'

import fs from 'fs'
import { Server } from 'http'
import path from 'path'
import { load, ServiceMap } from './decorator'
export * from './decorator'

const app = new Koa()
const routers = new KoaRouter()

let router: KoaRouter

routers.get('/', (ctx) => {
  ctx.body = '<h1>Hello XiaoKoa</h1>'
})

app.use(bodyparser())

export function Application(target: any) {
  const app = new target()

  if (!app.main) {
    console.log('未找到main函数')
    process.exit(1)
  }

  app.main(new xiaoKoaApp())
}

export class xiaoKoaApp {
  globalPrefix = ''
  dir: string | null = null
  JsonStr: any = {}

  run(dir: string, prot?: number): Server {
    if (fs.existsSync(path.join(dir, 'application.yml'))) {
      const nativeObject = YAML.load(path.join(dir, 'application.yml'))
      this.JsonStr = JSON.parse(JSON.stringify(nativeObject))
    }

    this.dir = dir
    router = load(dir)
    app.use(router.routes())
    app.use(routers.routes())

    const appServer = app.listen(prot ?? this.JsonStr?.server?.port ?? 7777, () => {
      console.log(`请访问 http://localhost:${prot ?? this.JsonStr?.server?.port}`)
    })

    return appServer
  }

  use(fn: Middleware) {
    app.use(fn)
  }

  mount(fn: Function) {
    if (this.dir === null) {
      process.nextTick(() => {
        fn({ dirPath: this.dir, ServiceMap, JsonStr: this.JsonStr })
      })
    } else {
      fn({ dirPath: this.dir, ServiceMap, JsonStr: this.JsonStr })
    }
  }

  setGlobalPrefix(prefix: string) {
    this.globalPrefix = prefix
    if (router) {
      router.prefix(prefix)
    } else {
      process.nextTick(() => {
        router.prefix(prefix)
      })
    }
  }
}
