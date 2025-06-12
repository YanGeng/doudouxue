'use strict';
// const httpclient = require('@cloudbase/httpclient'); // 引入httpclient模块

exports.main = async (event, context) => {
	//event为客户端上传的参数
	// event里包含着客户端提交的参数
	// 2. 获取经纬度（从event参数中获取，需在调用云函数时传入）
	// const {
	// 	longitude,
	// 	latitude,
	// 	tianDiTuKey
	// } = event;

	// if (!longitude || !latitude) {
	// 	return {
	// 		code: 400,
	// 		message: '缺少经纬度或天地图密钥'
	// 	};
	// }

	let tianDiTuKey = 'be939765f283d3ae002f87643d87d976'
	let longitude = 121.327501
	let latitude = 31.293128
	// 3. 调用天地图API
	const url =
		`https://api.tianditu.gov.cn/geocoder?postStr={"lon":${longitude},"lat":${latitude},"ver":1}&type=geocode&tk=${tianDiTuKey}`;

	console.log('url is: ', url)
	const response = await uniCloud.httpclient.request(url, {
	      method: 'GET',
	      dataType: 'json'
	    });
	// const response = await httpclient.request(url, {
	// 	method: 'GET',
	// 	dataType: 'json' // 自动解析JSON响应
	// });

	console.log('url is: ', response)
	// 4. 返回合并结果
	return {
		code: 200,
		location: response.data
	};
};