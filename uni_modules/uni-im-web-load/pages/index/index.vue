<template>
	<view class="page">
		<web-view v-if="url" :webview-styles="webviewStyles" :src="url" @message="onMessage" class="web-view" ref="web-view"></web-view>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				url: '',
				webviewStyles: {
					progress: {
						color: "#00aa55"
					}
				}
			}
		},
		async onLoad(options) {
			// 目标uid
			let toUid = '6686df138a5c7863b1fb1c3d';
			if (options.touid) {
				toUid = options.touid
			};
			// 托管im页面的地址，以http或https开头，例如：https://im.dcloud.net.cn 在部署完毕后到部署记录中获取，地址：http://ext.dcloud.net.cn/manage/one-click-deployment
			const imWebUrl = 'https://env-00jxt0xsfk5j-static.normal.cloudstatic.cn'
			// 要对话的客服的id。获取方式:直接打开imWebUrl，注册并登录后，在控制台执行`uni.imObservableData.currentUser._id`获取
			const user_id = toUid;//'6686df138a5c7863b1fb1c3d'
			// 要直达的im页面地址
			const path = '/#/uni_modules/uni-im/pages/index/index'
			/**
			 * 登录参数，
			 * 以下：三种模式，三选一
			 */
			console.log('uni.getStorageSync', uni.getStorageSync('uni_id_token'));
			const param = {
				/**
				 * 一、游客模式
				*/
				/*
					// 根据客户端特征生成用户_id，这里使用的是uni-app框架随机生成的，存储在localStorage内的设备id，也可以使用浏览器指纹等其他特征。
					_id: uni.getDeviceInfo().deviceId,
					nickname: '自定义用户昵称',
					avatar_file: {
						// 自定义用户头像链接地址
						url: 'https://img.yzcdn.cn/vant/cat.jpeg',
					}
				*/

				/**
				 * 二、 使用项目自身token的登录模式（任意服务端语言开发的项目可用）
				 * 此token最终会传给你配置的getUserInfo接口校验。
				 */
				
				// uni_id_token和token，两个参数二选一
				// 1. 主项目为unicloud且用户体系为uni-id的项目，可传uni_id_token
				uni_id_token:  uni.getStorageSync('uni_id_token') 
				
				// 2. 主项目为非unicloud项目，必须传token。关于值，如果你项目的token不是存在storage内或key值不是token需要根据实际情况修改
				// token: uni.getStorageSync('token'),
				// 如果token不是jwt未包含user_id需再传user_id。具体根据你提供的getUserInfo接口要求
				// user_id: uni.getStorageSync('current_user_id')
			}
			
			// 校验是否正确配置imWebUrl, user_id ,param
			if(!imWebUrl){
				return uni.showModal({
					content: '请配置imWebUrl',
					showCancel: false
				});
			}
			if(!user_id){
				return uni.showModal({
					content: '请配置user_id',
					showCancel: false
				});
			}
			if(Object.keys(param).length === 0){
				return uni.showModal({
					content: '请配置param',
					showCancel: false
				});
			}

			// 传 mainAppInfo 实现主项目也能监听到收到消息事件，以及实现App离线推送
			const {
				deviceId: device_id
			} = uni.getDeviceInfo()
			const {
				appId: appid
			} = uni.getAppBaseInfo()
			const {
				cid: push_clientid
			} = await uni.getPushClientId()
			param.mainAppInfo = {
				appid,
				device_id,
				push_clientid
			}

			this.url = `${imWebUrl + path}?login=${encodeURIComponent(JSON.stringify(param))}&user_id=${user_id}`
			console.log('this.url', this.url)
		},
		methods: {
			onMessage(e) {
				console.log('onMessage', e)
			}
		}
	}
</script>
<style>
	.page {
		width: 750rpx;
		height: 100%;
		flex: 1;
		background-color: #f8f8f8;
	}

	.web-view {
		width: 750rpx;
		flex: 1;
	}
</style>