import Vue from 'vue'
import Vuex from 'vuex'
import $config from './config.js'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		islogin: false,
		member: {},
		token: '',
		token_expired: 0,
		user_role: '学生',

		__key_member: 'usemall_member',
		__key_token: 'uni_id_token',
		__key_token_expired: 'uni_id_token_expired',
		__key_user_role: 'user_role',
	},
	mutations: {
		// 登录成功
		login(state, res) {
			// 用户已登录
			console.log(res)
			state.islogin = true;
			state.user_role = res.user.userInfo.role[0]
			console.log(state.user_role)
			state.member = res.member;
			state.token = res.user.token;
			state.token_expired = res.user.tokenExpired;

			// 存储会员 member 数据
			uni.setStorage({
				key: state.__key_member,
				data: state.member
			})

			// 存储uid token 数据
			uni.setStorage({
				key: state.__key_token,
				data: state.token
			})
			// 存储uid token_expired 数据
			uni.setStorage({
				key: state.__key_token_expired,
				data: state.token_expired
			})
			// 存储uid token_expired 数据
			uni.setStorage({
				key: state.__key_user_role,
				data: state.user_role
			})
			
			// uni.setTabBarItem({
			// 	index: 2,
			// 	// "pagePath": "/pages/tabbar/shopping",
			// 	// "iconPath": "/static/images/tabbar/shopping.png",
			// 	// "selectedIconPath": "/static/images/tabbar/shopping-active.png",
			// 	// "text": "购物圈",
				
			// 	"pagePath": "/pages/tabbar/cart",
			// 	"iconPath": "/static/images/tabbar/cart.png",
			// 	"selectedIconPath": "/static/images/tabbar/cart-active.png",
			// 	"text": "购物车"
			// })
		},
		
		// 加载 Token
		loadToken(state) {
			state.member = uni.getStorageSync(state.__key_member);
			state.token = uni.getStorageSync(state.__key_token);
			state.token_expired = uni.getStorageSync(state.__key_token_expired);
			state.user_role =  uni.getStorageSync(state.__key_user_role);
			
			if (state.token_expired > new Date().getTime()) {
				state.islogin = true;
			}
		},

		// 注销 
		logout(state) {
			state.islogin = false;
			state.member = {};
			state.token = '';
			state.token_expired = 0;
			state.user_role = '学生';

			uni.removeStorage({
				key: state.__key_member
			})
			uni.removeStorage({
				key: state.__key_token
			})
			uni.removeStorage({
				key: state.__key_token_expired
			})
			
			// uni.setTabBarItem({
			// 	index: 2,
			// 	"pagePath": "/pages/tabbar/shopping",
			// 	"iconPath": "/static/images/tabbar/shopping.png",
			// 	"selectedIconPath": "/static/images/tabbar/shopping-active.png",
			// 	"text": "购物圈"
				
			// 	// "pagePath": "pages/tabbar/cart",
			// 	// "iconPath": "static/images/tabbar/cart.png",
			// 	// "selectedIconPath": "static/images/tabbar/cart-active.png",
			// 	// "text": "购物车"
			// })
		},
		
		// token 令牌
		token(state, token, token_expired) {
			state.token = token;
			state.token_expired = token_expired;

			// 存储uid token 数据
			uni.setStorage({
				key: state.__key_token,
				data: state.token
			})
			// 存储uid token_expired 数据
			uni.setStorage({
				key: state.__key_token_expired,
				data: state.token_expired
			})
		},
		
		// 修改 member 数据
		putMember (state, user) {
			state.member = user;
			
			// 存储会员 member 数据
			uni.setStorage({
				key: state.__key_member,
				data: state.member
			})
		}
	},
	actions: {

	}
})

export default store
