'use strict';
exports.main = async (event, context) => {
	//event为客户端上传的参数
	// event里包含着客户端提交的参数
	let data = await uniCloud.getPhoneNumber({
		appid: '__UNI__15FFEB9', // 替换成自己开通一键登录的应用的DCloud appid，使用callFunction方式调用时可以不传（会自动取当前客户端的appid），如果使用云函数URL化的方式访问必须传此参数
		provider: 'univerify',
		access_token: event.access_token,
		openid: event.openid
	})
	
	return data//返回的data里包含手机号
	//返回数据给客户端
	// return event
};
