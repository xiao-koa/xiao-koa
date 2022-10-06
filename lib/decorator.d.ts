import 'reflect-metadata';
import { FunctionAnnotation, ParameterAnnotation } from './decoratorType';
import { Next } from 'koa';
export declare const ControllerMap: Map<string, Object>;
export declare const ServiceMap: Map<string, Object>;
export declare function RequestBody(target: any, propertyKey: any, paramsIndex: number): void;
export declare function Controller(prefix: string): (target: any) => void;
export declare function Service(alias?: string): (target: any) => void;
export declare function Autowired(target: any, propertyKey: any): void;
export declare function RequestMapping(url: string): FunctionAnnotation;
export declare function Configuration(target: any): void;
export declare const Get: (url: string) => FunctionAnnotation;
export declare const Post: (url: string) => FunctionAnnotation;
export declare const Put: (url: string) => FunctionAnnotation;
export declare const Delete: (url: string) => FunctionAnnotation;
export declare const Options: (url: string) => FunctionAnnotation;
export declare const Patch: (url: string) => FunctionAnnotation;
export declare const Head: (url: string) => FunctionAnnotation;
export declare const PathVariable: (params: string) => ParameterAnnotation;
export declare const RequestHeader: (params: string) => ParameterAnnotation;
export interface HandlerInterceptor {
    preHandle(HttpServletRequest: any, HttpServletResponse: any, next: Next): any;
}
export declare interface WebMvcConfigurer {
    addInterceptors(registry: registryType): void;
}
declare type registryType = {
    addInterceptor(fn: WebMvcConfigurer): Function;
    addPathPatterns(path: string): Function;
};
export declare const load: (folder: string) => any;
export {};
