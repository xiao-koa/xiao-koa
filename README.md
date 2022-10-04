<h1 align="center">Xiao Koa</h1>
<p align="center">前端人快速开发后端服务的利器</p>
<p align="center">
   <a href="https://www.npmjs.com/package/xiao-koa">
    <img src="https://img.shields.io/npm/v/xiao-koa.svg">
  </a>
  <a href="https://npmcharts.com/compare/xiao-koa?minimal=true">
    <img src="https://img.shields.io/npm/dt/xiao-koa.svg">
  </a>
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



`index.ts`案例

~~~ts
import { Application, xiaoKoaApp } from "xiao-koa";

@Application
export default class TestApplication {
  main(app: xiaoKoaApp) {
    app.run(__dirname, 1234);
  }
}
~~~



## 疑问交流

QQ群: <a target="_blank" href="https://qm.qq.com/cgi-bin/qm/qr?k=HlKQBtl0Z6aZIrJ7LdY2XEH7-whn5Cn9&jump_from=webapi&authKey=Nyq0s9BesdTQYHlMMz854uAYhjR3VvL2QEOUUF/51rzIETlh/43E5Yr8Eg53tWE4">xiao-koa(917968816)</a>