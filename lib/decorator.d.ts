import 'reflect-metadata';
import { FunctionAnnotation, HandlerInterceptor, ParameterAnnotation } from './decoratorType';
export * from './decoratorType';
export declare const ControllerMap: Map<string, Object>;
export declare const ServiceMap: Map<string, Object>;
export declare function RequestBody(target: any, propertyKey: any, paramsIndex: number): void;
declare module 'koa' {
    interface Request {
        [key: string]: any;
    }
}
export declare function Controller(prefix?: string): (target: any) => void;
export declare function Service(alias?: string): (target: any) => void;
export declare function Autowired(target: any, propertyKey: any): void;
export declare function RequestMapping(url?: string): FunctionAnnotation;
export declare class InterceptorRegistry {
    interceptorMap: Map<any, any>;
    currentFnName: string;
    addInterceptor(fn: HandlerInterceptor): this;
    addPathPatterns(path: string): this;
    excludePathPatterns(path: string): this;
    getMap(): Map<any, any>;
}
export declare function Configuration(target: any): void;
export declare const Get: (url?: string) => FunctionAnnotation;
export declare const Post: (url?: string) => FunctionAnnotation;
export declare const Put: (url?: string) => FunctionAnnotation;
export declare const Delete: (url?: string) => FunctionAnnotation;
export declare const Options: (url?: string) => FunctionAnnotation;
export declare const Patch: (url?: string) => FunctionAnnotation;
export declare const Head: (url?: string) => FunctionAnnotation;
export declare const PathVariable: (params: string) => ParameterAnnotation;
export declare const RequestHeader: (params: string) => ParameterAnnotation;
export declare const GetCtx: (params: string) => ParameterAnnotation;
export declare const RequestParam: (params: string) => ParameterAnnotation;
export declare const load: (folder: string) => any;
