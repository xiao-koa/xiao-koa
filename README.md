<h1 align="center">Xiao Koa</h1>
<p align="center">前端人快速开发后端服务的利器</p>
<p align="center">
   <a href="https://www.npmjs.com/package/xiao-koa">
    <img src="https://img.shields.io/npm/v/xiao-koa.svg">
  </a>
  <a href="https://npmcharts.com/compare/xiao-koa?minimal=true">
    <img src="https://img.shields.io/npm/dt/xiao-koa.svg">
  </a>
      <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-blue.svg"></a>
<p align="center">
  <a href="http://xiao-koa.xuanxiaoqian.com">文档网站</a>
  &nbsp;
</p>


---




## 介绍

基于Koa2的一款模仿SpringBoot装饰器风格框架



## 特点

- 快速 极低配置开启一个后端服务

- 轻量 不需要手动导入任何模块

- 灵活 开放Koa的Use函数让框架极其灵活

- 生态 后续将会出生态库，例如模仿Mybatis



## 安装

使用npm安装:

~~~sh
npm i xiao-koa
~~~



## 更新时间

2025/5/28：

新增 app.getRouters()

新增 run()的时候自动获得路径

新增@GetCtx,可以获得原生ctx

新增请求装饰器不写参数自动按方法名匹配地址

新增app.setResources(path.join(__dirname, 'resources'))



`index.ts`案例

~~~ts
import { Application, xiaoKoaApp } from "xiao-koa";

@Application
export default class TestApplication {
  main(app: xiaoKoaApp) {
    app.run(1234);
  }
}
~~~



`application.yml`案例

~~~yaml
server:
  port: 1234
~~~



## 功能

```ts
export const Get = createRequestControllerDecorator('get')
export const Post = createRequestControllerDecorator('post')
export const Put = createRequestControllerDecorator('put')
export const Delete = createRequestControllerDecorator('delete')
export const Options = createRequestControllerDecorator('options')
export const Patch = createRequestControllerDecorator('patch')
export const Head = createRequestControllerDecorator('head')

如果属性值为空，则自动根据函数名进行生成路径
@Get() //不写或者为''都自动匹配
async getMessages() {
    // 这个路径就为/getMessages
 }

@Get('/')
async getMessages() {
    // 这个路径就为匹配Controller父路径
 }
```

```ts
export const PathVariable = createRequestParamsDecorator('PathVariable')
export const RequestHeader = createRequestParamsDecorator('RequestHeader')

@RequestMapping('/request/:id')
pathVariable(@PathVariable('id') userId: any) {
  return { msg: '演示PathVariable', userId }
}

@RequestMapping('/requestHeader')
requestHeader(@RequestHeader('token') tokenCode: string) {
  return { msg: '演示RequestBody', tokenCode }
}

@RequestMapping('/requestBody')
requestBody(@RequestBody user: any) {
  return { msg: '演示RequestBody', user }
}

async sendMessage(@GetCtx('') ctx: any) {
    console.log(ctx.request.files);
}

```

```ts
@Controller('/demo') // 访问控制器
@Service(alias?: string)	// 服务控制器
@Configuration	// 配置文件控制器
// 使用上面的控制的模块可以注入
@Autowired
declare tokenInterceptor: TokenInterceptor
```

```ts
// 配置控制
import { Service, HandlerInterceptor, DefaultContext, DefaultState, Next, ParameterizedContext } from 'xiao-koa'

@Service()
export default class TokenInterceptor implements HandlerInterceptor {
  async preHandle(ctx: ParameterizedContext<DefaultState, DefaultContext, unknown>, next: Next) {
    if (ctx.request.header['token']) {
      await next()	//等待下一个中间件
    } else {
      throw { code: 403, error: '没有token' }
    }
  }
}


import { Autowired, Configuration, registryType, WebMvcConfigurer } from 'xiao-koa'
import TokenInterceptor from './TokenInterceptor'

@Configuration
export default class WebConfig2 implements WebMvcConfigurer {
  @Autowired
  declare tokenInterceptor: TokenInterceptor


  addInterceptors(registry: registryType) {
    registry.addInterceptor(this.tokenInterceptor)
  }

}

excludePathPatterns > addPathPatterns > addInterceptor

```

```ts
import serve from 'koa-static'
import path from 'path'
import { Application, xiaoKoaApp } from 'xiao-koa'

@Application
export default class DemoApplication {
  main(app: xiaoKoaApp) {
    console.log(path.join(__dirname,'./img'));


    app.use(serve(path.join(__dirname,'./img')))

    app.run()
  }
}

export declare class xiaoKoaApp {
    globalPrefix: string;
    dir: string;
    JsonStr: any;
    private routers;
    constructor(callerPath: string);
    run(prot?: number): Server;
    getRouters(): Promise<unknown>;
    use(fn: Middleware): void;
    mount(fn: Function): void;
    setGlobalPrefix(prefix: string): void;
    setResources(path: string, opts?: serve.Options): void;
}

```

