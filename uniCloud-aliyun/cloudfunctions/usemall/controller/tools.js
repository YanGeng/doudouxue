'use strict';

const {
	Controller
} = require('uni-cloud-router');

module.exports = class MemberController extends Controller {
	// 登录
	async getLocation() {
		let response = {
			code: 1,
			data: null
		};
	
		const {
			longitude,
			latitude
		} = this.ctx.data
		
		let tianDiTuKey = 'be939765f283d3ae002f87643d87d976'
		// let longitude = 121.327501
		// let latitude = 31.293128
		// 3. 调用天地图API
		const url =
			`https://api.tianditu.gov.cn/geocoder?postStr={"lon":${longitude},"lat":${latitude},"ver":1}&type=geocode&tk=${tianDiTuKey}`;
		
		console.log('url is: ', url)
		const result = await uniCloud.httpclient.request(url, {
		      method: 'GET',
		      dataType: 'json'
		    });
		
		console.log('url is: ', result)
		// 4. 返回合并结果
		if (result.status == 200) {
			response.code = 0;
			response.data = result.data
		}
		
		return response;
	}
}