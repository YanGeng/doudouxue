'use strict';
const uniPush = uniCloud.getPushManager({appId:"__UNI__15FFEB9"}) 
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)
	
	//返回数据给客户端
	return await uniPush.sendMessage({
			"push_clientid": "1fab98af027bdc2a07aad82460274339", 	//填写上一步在uni-app客户端获取到的客户端推送标识push_clientid
			"title": "通知栏显示的标题",	
			"content": "通知栏显示的内容",
			"payload": {
				"text":"体验一下uni-push2.0jj"
			},
			"force_notification": true
		})

	// return event
};
