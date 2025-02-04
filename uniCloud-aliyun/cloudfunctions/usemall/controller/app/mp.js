'use strict';

const { Controller } = require('uni-cloud-router');

module.exports = class MpController extends Controller { 
	
	// 首页
	async home () {
		let { rows, page, requestType, currentCity} = this.ctx.data;
		rows = rows || 8;
		// 当前用户是学生，设置requestType = 1
		// 当前用户是老师，设置requestType = 2
		requestType = requestType || 1;
		
		let response = { carousel: [], category: [], limited: [], hot: [] };
		let start = new Date().getTime();
		
		const carousel = this.db.collection('usemall-app-carousel').where({ state: '启用' }).orderBy('sort', 'asc').get();
		const category = this.db.collection('usemall-app-category').where({ state: '启用' }).orderBy('sort', 'asc').limit(8).get();
		
		let limited = [];
		limited = this.db.collection('usemall-goods').where({ state: '销售中', requestType: 0, city_name: currentCity }).orderBy('sort', 'asc').limit(rows).get();
		let limitedData = await Promise.all([limited]);
		// 如果当前城市数据为空，则请求全国数据
		if (!limitedData || limitedData.length <=0 || limitedData[0].data.length <= 0) {
			limited = this.db.collection('usemall-goods').where({ state: '销售中', requestType: 0}).orderBy('sort', 'asc').limit(rows).get();
		}
		limitedData = await Promise.all([limited]);
		// 原始逻辑注释掉
		// const hot = this.db.collection('usemall-goods').where({ state: '销售中', hot: 1 }).orderBy('sort', 'asc').limit(rows).get();
		// let hot = []
		// if (neg_city) {
		// 	hot = this.db.collection('usemall-goods').where({ state: '销售中', requestType: requestType, city_name: this.db.command.neq(city_name) }).orderBy('sort', 'asc').limit(rows).get();
		// } else {
		// 	hot = this.db.collection('usemall-goods').where({ state: '销售中', requestType: requestType, city_name: city_name }).orderBy('sort', 'asc').limit(rows).get();
		// }
		const hot = this.db.collection('usemall-goods').where({ state: '销售中', requestType: requestType, city_name: currentCity }).orderBy('last_modify_time', 'desc').limit(rows).get();
		
		const datas = await Promise.all([carousel, category, hot]);
		
		response.carousel = datas[0] && datas[0].data;
		response.category = datas[1] && datas[1].data;
		response.hot = datas[2] && datas[2].data;
		
		response.limited = limitedData[0].data
		
		let end = new Date().getTime();
		console.log(`耗时：${end - start}ms`);
		response.code = 0;
		response.msg = `耗时：${end - start}ms`;
		return response;
	}
	
}
