'use strict';

let config = {
	debug: !0,
	version: '1.0.0.240705',
	
	route: {
		home: '/pages/tabbar/home',
		login: '/pages/login/login',
		order: '/pages/user/order/order',
		pay: '/pages/pay/pay',
		search: '/pages/home/search/search',
		goods: '/pages/goods/goods',
		goodslist: '/pages/goods/goods-list'
	},
	provider: '',
	provider_names: {
		'weixin': '微信',
		'qq': 'QQ',
		'alipay': '支付宝',
		'baidu': '百度',
		'toutiao': '头条',
	},
	
	const: {
		__app: '__app',
		__member: '__member',
		__access_token: 'USE_ACCESS_TOKEN'
	},
	
};

export default config