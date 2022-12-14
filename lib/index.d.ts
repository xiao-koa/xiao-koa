/// <reference types="node" />
import 'reflect-metadata';
import { Middleware } from 'koa';
import { Server } from 'http';
export * from './decorator';
export declare function Application(target: any): void;
export declare class xiaoKoaApp {
    globalPrefix: string;
    dir: string | null;
    JsonStr: any;
    run(dir: string, prot?: number): Server;
    use(fn: Middleware): void;
    mount(fn: Function): void;
    setGlobalPrefix(prefix: string): void;
}
