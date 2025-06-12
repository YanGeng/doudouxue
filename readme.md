# uni-basic-app

#### 介绍
{**uniapp快速开发基础框架，兼容APP MINI H5**}

#### 架构
基于uniapp & vue3 + vuex + ts + sass

#### 安装教程

1.  hbuilderx [https://www.dcloud.io/hbuilderx.html](https://www.dcloud.io)
2.  hbuilderx 目前支持 4.15.2024050802，向下兼容未知
3.  iconfont库[https://www.iconfont.cn/collections/detail?spm=a313x.collections_index.i1.d9df05512.7cf73a81I1QNvo&cid=48978](https://www.iconfont.cn)

#### 使用说明

1.  自定义主题theme.scss 需要在uni.scss 中引入@import '@/static/style/theme.scss';
2.  下载后 如需运行在小程序使用，请在manifest.json中填写小程序的appid;
3.  xxxx
4.  xxxx

#### 参与贡献

1.  Fork 本仓库
2.  新建 Feat_xxx 分支
3.  提交代码
4.  新建 Pull Request


#### 目录

```

- ├── api            # 请求封装存放目录
- ├── common         # 公共文件目录
- │   ├── config       # 请求私有配置
- │   ├── http         # 请求
- │   │   ├── interceptor.ts  # 拦截器
- │   │   └── request.ts      # 方法
- │   ├── md5          # md5加密
- ├── components     # 公共组件目录
- ├── wxcomponents   # 小程序组件目录，即存放的是小程序原生类型的组件，而非vue类型的组件
- ├── libs           # 公共库
- │   ├── enums        # 枚举
- │   ├── hooks        # hooks
- │   ├── utils        # 通用方法
- ├── pages          # 业务页面文件存放的目录
- │   ├── tabbar       # 底部tabbar目录
- ├── platforms      # 存放各平台专用页面的目录，每个平台起名参照文档，各平台会条件编译
- ├── static         # 存放应用引用的本地静态资源（如图片、视频等）的目录，注意：静态资源都应存放于此目录
- ├── store          # VUEX全局状态管理
- │   ├── modules      # 模块
- │   │   ├── user.js    # 用户信息相关
- │   │   └── app.js     # other
- │   ├── index.js     # store 创建主文件 并导出
- ├── types          # 参数类型定义
- ├── uni_modules    # 存放[uni_module](/uni_module) 插件市场下载的组件默认存放目录
- ├── unpackage      # 非工程代码，一般存放运行或发行的编译结果
- ├── .gitignore     # git提交排除的文件或文件夹
- ├── App.vue        # 应用配置，用来配置App全局样式以及监听 应用生命周期
- ├── index.html     # 
- ├── main.js        # Vue初始化入口文件
- ├── manifest.json  # 配置应用名称、appid、logo、版本等打包信息
- ├── pages.json     # 配置页面路由、导航条、选项卡等页面类信息
- ├── README.md      # 项目介绍
- ├── tsconfig.json  # ts配置
- ├── uni.scss       # 内置的常用样式变量

```

#### 相关问题描述

```

1. vue3 不再支持过滤器 filter
2. h5 目前只能识别 main.js .js结尾的入口文件（20240520）
3. 关于微信小程序，官方为保护用户隐私，不允许直接进行授权登录，需要用户先体验后，才可以进行登录，针对此情形，提供两点解决方案。
	【1、如需直接进度登录页，即针对企业型小程序，需在登录页添加 员工内部使用等相关描述，2、用户可正常浏览小程序，当用户执行相关操作后即可触发登录鉴权】
4. 使用component 渲染一个“元组件”为动态组件。依 is 的值，来决定哪个组件被渲染。【APP、H5支持 MINI暂不支持（20240531）】
5. 使用jsx、tsx语法【APP、H5支持 MINI暂不支持（20240531）】
6. 关于微信分享转发功能，需要现在微信后台完成微信认证，如不进行微信认证，onShareAppMessage api将无法进行自定义title image
7. vue3版本 关于引用uni_modules下组件，如果发现控制台报错，请重新运行小程序

```

