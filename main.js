import App from './App'
import store from './store'

import $api from './common/common.js'
import $func from './common/func.js'
import $db from './common/db.js'
// import './common/md5/md5'
// const md5 = require('./common/md5/md5.js')
// console.log('1234');
// console.log(md5('1234'));

console.log(store.user);

// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
	...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
	const app = createSSRApp(App)
	app.use(store)
	app.config.globalProperties.$api = $api
	app.config.globalProperties.$func = $func
	app.config.globalProperties.$db = $db
	return {
		app
	}
}
// #endif