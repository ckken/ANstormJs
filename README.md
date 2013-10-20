Angularjs NstormJs web framework v 0.0.1
=========

author : @KenZR

sina weibo: http://weibo.com/cksky

blog: http://www.vcotime.com/

be good at : php javascript nodejs html css and so on;

临时DEMO： http://112.124.64.160:99/

安装方法：`npm install`

运行程序 `node app.js`

目前项目的model层为mongoose 感觉有点累赘 考虑用mongoskin代替
由于数据结构层比较复杂 可能考虑出一个新的分支

初始运行程序自动创建数据库

<pre>
├─app
│  ├─common
│  ├─conf      配置文件 设置数据库
│  ├─core
│  │  ├─config   
│  │  └─model
│  ├─model
│  ├─runtime
│  │  └─images
│  └─site
│      └─api
└─static
    ├─lib
    │  ├─common
    │  └─core
    ├─md
    ├─style
    │  ├─css
    │  └─js
    │      ├─holder
    │      └─respond
    └─view
        ├─blog
        └─member
</pre>
