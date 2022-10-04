import 'reflect-metadata'

import Koa, { Middleware } from 'koa'
import KoaRouter from 'koa-router'
import bodyparser from 'koa-bodyparser'

import { load, ServiceMap } from './decorator'
export * from './decorator'

const app = new Koa()
const routers = new KoaRouter()

let router: KoaRouter

routers.get('/', (ctx: any) => {
  ctx.body = 'Hello XiaoKoa'
})

app.use(bodyparser())
app.use(routers.routes())

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

  run(dir: string, prot: number) {
    router = load(dir)
    app.use(router.routes())

    app.listen(prot, () => {
      console.log(`请访问 http://localhost:${prot}`)
    })
  }

  use(fn: Middleware) {
    app.use(fn)
  }

  mount(fn: Function) {
    fn(ServiceMap)
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
