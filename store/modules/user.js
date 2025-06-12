import { miniLoginApi } from '@/api/login';

let user = {
	state: {
		// token: uni.getStorageSync("token") || null,
		// isLogin: !!uni.getStorageSync("token"),
		userInfo: uni.getStorageSync("userInfo") || {},
		islogin: false,
		member: {},
		token_changed: false,
		token: '',
		token_expired: 0,
		// 'student', 'teacher', 'admin'，默认为'student'
		user_role: 'student',
		current_city: '上海市',
		location_city: {},
		
		// ai对话记录
		ai_chat_list: [],
		conversation_id: '',
		
		message_page_refresh_time: 0,
		
		// 一键登录
		isPreLoginSucess: false,
		
		__key_message_page_refresh_time: 'message_page_refresh_time',
		__key_member: 'usemall_member',
		__key_token_changed: 'token_changed',
		__key_token: 'uni_id_token',
		__key_token_expired: 'uni_id_token_expired',
		__key_user_role: 'user_role',
		__key_current_city: 'current_city',
		__key_location_city: 'location_city',
		__key_ai_chat_list: 'ai_chat_list',
		__key_conversation_id: 'conversation_id',
		__key_isPreLoginSucess: 'isPreLoginSucess'
	},
	mutations: {
		updateToken(state, token) {
			state.token = token;
			state.islogin = true;
		},

		updateUserInfo(state, userInfo) {
			state.userInfo = userInfo;
		},

		// logout(state) {
		// 	uni.removeStorageSync('token');
		// 	uni.removeStorageSync('userInfo');
		// 	state.token = null;
		// 	state.isLogin = false;
		// 	state.userInfo = {};
		// },
		
		// 新增from doudouxue
		// 更新 conversation_id
		updateConversationId(state, conversationId) {
			state.conversation_id = conversationId;
			uni.setStorage({
				key: state.__key_conversation_id,
				data: state.conversation_id
			})
		},
		
		// 更新选择地址
		updateCurrentCity(state, city) {
			state.current_city = city;
			uni.setStorage({
				key: state.__key_current_city,
				data: state.current_city
			})
		},
		
		// 更新定位地址
		updateLocationCity(state, city) {
			state.location_city = city;
			uni.setStorage({
				key: state.__key_location_city,
				data: state.location_city
			})
		},
		
		// 更新ai对话记录
		updateAiChatList(state, chatList) {
			state.ai_chat_list = chatList;
			uni.setStorage({
				key: state.__key_ai_chat_list,
				data: state.ai_chat_list
			})
		},
		
		// 更新用户身份
		updateUserRole(state, userRole) {
			state.user_role = userRole;
			uni.setStorage({
				key: state.__key_user_role,
				data: state.user_role
			})
		},
		
		// 更新刷新时间
		updateMessagePageRefreshTime(state, messagePageRefreshTime) {
			state.message_page_refresh_time = messagePageRefreshTime;
			uni.setStorage({
				key: state.__key_message_page_refresh_time,
				data: state.message_page_refresh_time
			})
		},
		
		// 更新token变化状态
		updateTokenChanged(state, tokenChanged) {
			state.token_changed = tokenChanged;
			uni.setStorage({
				key: state.__key_token_changed,
				data: state.token_changed
			})
		},
		
		// 登录成功
		login(state, res) {
			// 用户已登录
			console.log(res)
			state.user_role = res.user.userInfo.role[0]
			// console.log(state.user_role)
			state.member = res.member;
			if (res.user.token != state.token) {
				state.token_changed = true;
			} else {
				state.token_changed = false;
			}
		
			state.token = res.user.token;
			state.token_expired = res.user.tokenExpired;
		
			
			uni.setStorage({
				key: state.__key_token_changed,
				data: state.token_changed
			})
		
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
			
			state.islogin = true;
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
			state.current_city = uni.getStorageSync(state.__key_current_city);
			state.location_city = uni.getStorageSync(state.__key_location_city);
			state.ai_chat_list = uni.getStorageSync(state.__key_ai_chat_list);
			state.conversation_id = uni.getStorageSync(state.__key_conversation_id);
			
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
			state.user_role = 'student';
		
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
		},
		
		setPreLoginStatus (state, isPreLoginSucess) {
			state.isPreLoginSucess = isPreLoginSucess;
			
			// 存储预登陆数据
			uni.setStorage({
				key: state.__key_isPreLoginSucess,
				data: state.isPreLoginSucess
			})
		}
	},
	actions: {
		async miniLogin({
			commit,
			state
		}, params) {
			try {
				const res = await miniLoginApi(params);
				const result = res.data;
				if (res.code === 200) {
					commit('updateToken', result.token);
					commit('updateUserInfo', result.userInfo);
					uni.setStorageSync("token", result.token);
					uni.setStorageSync("userInfo", result.userInfo);
					return Promise.resolve(res);
				} else {
					return Promise.reject(res);
				}
			} catch (error) {
				return Promise.reject(error);
			}
		},
	},
	getters: {
		islogin: state => state.islogin,
		isLoggedIn: state => state.islogin,
		getToken: state => state.token,
		getUserInfo: state => state.userInfo,
		userRole: state => state.user_role,
		member: state => state.member,
		user_role: state => state.user_role,
		isPreLoginSucess: state => state.isPreLoginSucess,
		current_city: state => state.current_city,
		token: state => state.token,
	}
}

export default user;