import 'reflect-metadata'

import { Next, ParameterizedContext } from 'koa'
import Router from 'koa-router'
import { firstToLowerCase, getFileList } from './common'
import {
  curInterceptorType,
  Features,
  FunctionAnnotation,
  HandlerInterceptor,
  ParameterAnnotation,
  paramsType,
  Prototype,
  RequestMethod,
} from './decoratorType'

export * from './decoratorType'

let router = new Router()
const projectFile: string[] = []

export const ControllerMap: Map<string, Object> = new Map()
export const ServiceMap: Map<string, Object> = new Map()

function createRequestControllerDecorator(method: RequestMethod) {
  return function (url?: string): FunctionAnnotation {
    return function (target, propertyKey) {
      process.nextTick(() => {
        url = url === '/' ? '' : url ?? ''
        let prefix = Reflect.getMetadata(Features.BaseUrl, ControllerMap.get(target.constructor.name) ?? {})
        router[method](prefix + url, (ctx) => ControllerProxy(ctx, target, propertyKey))
      })
    }
  }
}

function createRequestParamsDecorator(paramsType: paramsType) {
  return function (params: string): ParameterAnnotation {
    return function (target, propertyKey) {
      let dataParamsList = Reflect.getMetadata(Features.DataParams, target[propertyKey]) ?? []
      Reflect.defineMetadata(Features.DataParams, [{ name: params, paramsType: paramsType }, ...dataParamsList], target[propertyKey])
    }
  }
}

export function RequestBody(target: any, propertyKey: any, paramsIndex: number) {
  let dataParamsList = Reflect.getMetadata(Features.DataParams, target[propertyKey]) ?? []
  Reflect.defineMetadata(Features.DataParams, [{ name: 'RequestBody', paramsType: 'RequestBody' }, ...dataParamsList], target[propertyKey])
}

async function ControllerProxy(ctx: ParameterizedContext, target: Prototype, propertyKey: PropertyKey) {
  let dataArr: any[] = []
  let isError = false

  let dataParamsList: any[] = Reflect.getMetadata(Features.DataParams, target[propertyKey]) ?? []

  try {
    dataParamsList.map((params) => {
      if (params.paramsType == 'PathVariable') {
        // if (ctx.params[params.name] === undefined) {
        //   ctx.body = { code: 403, error: `BindException —— Not received PathVariable - ${params.name} parameter` }
        //   throw new Error(`BindException —— Not received PathVariable - ${params.name} parameter`)
        // }

        dataArr.push(ctx.params[params.name] ?? ctx.query[params.name])
      } else if (params.paramsType == 'RequestBody') {
        if (ctx.request.body == null || ctx.request.body == undefined || Object.keys(ctx.request.body).length == 0) {
          ctx.body = { code: 403, error: `BindException —— lack RequestBody - ${params.name} parameter` }
          throw new Error(`BindException —— lack RequestBody - ${params.name} parameter`)
        }
        dataArr.push(ctx.request.body)
      } else if (params.paramsType == 'RequestHeader') {
        dataArr.push(ctx.request.header[params.name])
      }
    })
  } catch (error: any) {
    console.log(error)

    isError = true
    ctx.body = { code: 403, error: error.toString() }
  } finally {
    if (isError) return

    try {
      let fnApply = await target[propertyKey].apply(target, dataArr ?? [])

      ctx.body = fnApply
    } catch (error) {
      ctx.body = error
    }
  }
}

export function Controller(prefix?: string) {
  return function (target: any) {
    prefix = prefix === '/' ? '' : prefix ?? ''

    let currentTarget = new target()
    Reflect.defineMetadata(Features.BaseUrl, prefix, currentTarget)

    ControllerMap.set(target.name, currentTarget)
  }
}

export function Service(alias?: string) {
  return function (target: any) {
    alias || false ? ServiceMap.set(alias, new target()) : ServiceMap.set(firstToLowerCase(target.name), new target())
  }
}
export function Autowired(target: any, propertyKey: any) {
  process.nextTick(() => {
    target[propertyKey] = ServiceMap.get(propertyKey)
  })
}

export function RequestMapping(url?: string): FunctionAnnotation {
  url = url === '/' ? '' : url ?? ''
  return function (target, propertyKey) {
    const RequestArr: RequestMethod[] = ['get', 'post', 'put', 'delete', 'options', 'patch', 'head']
    process.nextTick(() => {
      let prefix = Reflect.getMetadata(Features.BaseUrl, ControllerMap.get(target.constructor.name) ?? {})

      RequestArr.map((item) => {
        router[item](prefix + url, (ctx) => ControllerProxy(ctx, target, propertyKey))
      })
    })
  }
}

class InterceptorRegistry {
  interceptorMap = new Map()
  currentFnName = ''
  addInterceptor(fn: HandlerInterceptor) {
    this.currentFnName = fn.constructor.name

    let currentMeta: curInterceptorType = { fn, addPath: [], excludePath: [] }
    this.interceptorMap.set(fn.constructor.name, currentMeta)

    return this
  }

  addPathPatterns(path: string) {
    const currentInstance = this.interceptorMap.get(this.currentFnName)
    currentInstance.addPath.push(path)
    return this
  }

  excludePathPatterns(path: string) {
    const currentInstance = this.interceptorMap.get(this.currentFnName)
    currentInstance.excludePath.push(path)
    return this
  }

  getMap() {
    return this.interceptorMap
  }
}

async function InterceptorProxy(ctx: ParameterizedContext, next: Next, curRegistry: curInterceptorType) {
  if (curRegistry.addPath.length == 0) {
    if (curRegistry.excludePath.includes(ctx.request.url)) {
      await next()
      return
    }

    try {
      const config: any = curRegistry.fn
      await config?.preHandle?.(ctx, next)
    } catch (error) {
      ctx.body = error
    }
    return
  }

  if (curRegistry.addPath.includes(ctx.request.url)) {
    try {
      const config: any = curRegistry.fn

      await config?.preHandle?.(ctx, next)
    } catch (error) {
      ctx.body = error
    }
    return
  }

  await next()
}

export function Configuration(target: any) {
  process.nextTick(() => {
    const currentTarget = new target()

    const interceptor = new InterceptorRegistry()
    currentTarget?.addInterceptors?.(interceptor)
    const interceptorMap = interceptor.getMap()

    for (var key of interceptorMap.keys()) {
      const curRegistry: curInterceptorType = interceptorMap.get(key)

      router.use((ctx, next) => InterceptorProxy(ctx, next, curRegistry))
    }
  })
}

export const Get = createRequestControllerDecorator('get')
export const Post = createRequestControllerDecorator('post')
export const Put = createRequestControllerDecorator('put')
export const Delete = createRequestControllerDecorator('delete')
export const Options = createRequestControllerDecorator('options')
export const Patch = createRequestControllerDecorator('patch')
export const Head = createRequestControllerDecorator('head')

export const PathVariable = createRequestParamsDecorator('PathVariable')
export const RequestHeader = createRequestParamsDecorator('RequestHeader')

export const load = (folder: string): any => {
  getFileList(folder, projectFile)

  projectFile.map((item) => {
    require(item)
  })

  return router
}
