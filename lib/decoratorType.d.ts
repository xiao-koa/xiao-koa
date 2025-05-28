import { DefaultContext, DefaultState, Next, ParameterizedContext } from 'koa';
import { InterceptorRegistry } from './decorator';
export { DefaultContext, DefaultState, Next, ParameterizedContext };
export type Prototype = {
    constructor: Function;
} & any;
export type Constructor = {
    new (...args: any[]): {
        name: string;
    };
};
export interface FunctionAnnotation {
    <T>(target: Prototype, propertyKey: PropertyKey, descriptor: TypedPropertyDescriptor<T>): void;
}
export interface ConstructorAnnotation {
    <T extends Constructor>(constructor: T): T;
}
export interface PropertyAnnotation {
    (target: Prototype, propertyKey: PropertyKey): void;
}
export interface ParameterAnnotation {
    (target: Prototype, propertyKey: PropertyKey, parameterIndex: number): void;
}
export type RequestMethod = 'get' | 'post' | 'put' | 'delete' | 'options' | 'patch' | 'head';
export declare enum Features {
    BaseUrl = 0,
    DataParams = 1
}
export type paramsType = 'PathVariable' | 'RequestHeader' | 'RequestBody';
export interface HandlerInterceptor {
    preHandle(ctx: ParameterizedContext, next: Next): any;
}
export declare interface WebMvcConfigurer {
    addInterceptors(registry: registryType): void;
}
export type registryType = InstanceType<typeof InterceptorRegistry>;
export type curInterceptorType = {
    fn: HandlerInterceptor;
    addPath: string[];
    excludePath: string[];
};
