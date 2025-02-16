import Vue from 'vue'
import App from './App'

import $config from './common/config.js'
import $api from './common/common.js'
import $db from './common/db.js'
import $func from './common/func.js'
import $store from './common/store.js'

// main.js
import uView from '@/uni_modules/uview-ui'
Vue.use(uView)

// 加载markdown渲染
import {
	MarkdownIt
} from "@/uni_modules/wtto-markdown/js_sdk/index";
import {
	katexPlugin
} from "@/uni_modules/wtto-markdown/js_sdk/katex";

// highlight
// import { createHighlighterCoreSync } from "shiki/core";
// import { createJavaScriptRegexEngine } from "shiki/engine/javascript";
// import { bundledLanguages } from "shiki/langs.mjs";
// import githubLight from "shiki/themes/github-light.mjs";
// import githubDark from "shiki/themes/github-dark.mjs";
// import { highlightPlugin } from "@/uni_modules/wtto-markdown/js_sdk/highlight";

import deflistPlugin from "markdown-it-deflist";
import {
	full as emoji
} from "markdown-it-emoji";
import insPlugin from "markdown-it-ins";
import markPlugin from "markdown-it-mark";
import subPlugin from "markdown-it-sub";
import supPlugin from "markdown-it-sup";
import footnotePlugin from "markdown-it-footnote";
import abbrPlugin from "markdown-it-abbr";
import containerPlugin from "markdown-it-container";

let markdownIt = MarkdownIt({
	typographer: true,
	linkify: true,
})
.use(emoji)
.use(subPlugin)
.use(supPlugin)
.use(insPlugin)
.use(markPlugin)
.use(deflistPlugin)
.use(footnotePlugin)
.use(abbrPlugin)
.use(containerPlugin, "warning")
.use(katexPlugin, {
	throwOnError: true
});

// import wImageCache from '@/uni_modules/w-image-cache'
// Vue.use(wImageCache)

// import tabBar from "@/components/tabbar/tabbar.vue"
// Vue.component('tabBar',tabBar)

// #ifdef H5 || MP-360
uni.canIUse = function(name) {
	return name in uni;
}
// #endif

// 测试阶段
$config.debug = process.env.NODE_ENV === 'development';

if (!$config.debug) {
	// 取消日志打印功能
	console.log = () => { }
}

// 注册当前环境 
$api.register_env((env) => {
	Vue.prototype.$env = env;
});


Vue.config.productionTip = false

Vue.prototype.$config = $config
Vue.prototype.$api = $api
Vue.prototype.$db = $db
Vue.prototype.$dbcmd = uniCloud.database().command;
Vue.prototype.$func = $func
Vue.prototype.$store = $store
Vue.prototype.$markdownIt = markdownIt

App.mpType = 'app'

const app = new Vue({
	...App
})

app.$mount()
