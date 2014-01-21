ANS Angularjs NstormJs web framework v 0.4.3
=========

Q.js流程化编程模型

DEMO： http://ans.wvovo.com/

安装方法：`npm install`

将 conf/config-default.js 更改为 config.js

运行程序 `node app.js`

运用框架 mongodb(Mongoose) , Nodejs , Express , Nstorm , AngularJs , Seajs(next version)


重构了目录结构 让前后端配置 以及函数可以公用

增加 Q.JS 作为异步编程的概念

更换mongo驱动 回 mongoose (mongoskin 已经不更新了 调试不方便)

重构mongoose 数据结构 创建公用mongoDB类

更新 angular.js 1.2.9

下一步：使用 seajs 作为加载器重新构造 ， 重构数据结构，重构用户交互界面

