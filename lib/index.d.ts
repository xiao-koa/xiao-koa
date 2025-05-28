/// <reference types="node" />
import 'reflect-metadata';
import { Middleware } from 'koa';
import { Server } from 'http';
import serve from 'koa-static';
export * from './decorator';
export declare function Application(target: any): void;
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
