// envConfig.ts
const envConfig = {
	debug: !0,
	dev: {
		baseUrl: 'http://127.0.0.1',
	},
	prod: {
		baseUrl: 'https://your-production-url.com',
	},
	route: {
		home: '/pages/tabbar/home',
		login: '/pages/login/login-new',
		order: '/pages/user/order/order',
		pay: '/pages/pay/pay',
		search: '/pages/home/search/search',
		goods: '/pages/goods/goods',
		goodslist: '/pages/goods/goods-list'
	},
};

export default envConfig;