<template>
	<view class="use-empty-container">
		<web-view v-if="url" :webview-styles="webviewStyles" :fullscreen="false" :src="url" @message="onMessage" ref="web-view"></web-view>
	</view>
</template>

<script>
export default {
    watch: {
		token(newVal, oldVal) {
			console.log('uni_id_token change:', newVal, oldVal);
			if (newVal != oldVal) {
                this.url = '';
                // token变了，则清楚历史数据，重新挂载新webvie。修复bug：新token可回退到上一个token的历史记录中
                setTimeout(() => {
                    this.loadWebView();
                }, 20);
                // this.loadWebView();
			}
				
			console.log('current url:', this.url);
		},
        touid(newVal, oldVal) {
            if (newVal != oldVal) {
                this.loadWebView();
			}
        },
        refresh(newVal, oldVal) {
            if (newVal != oldVal) {
                console.log('refresh: ', newVal);
                this.loadWebView();
                console.log('mmmmmmmmmmmmmmmmmmmmmmmmmmmm:', this.url);
            }
        }
	},
	props: {
		touid: {
			type: String,
			default: ''
		},
		token: {
			type: String,
			default: ''
		},
		refresh: {
			type: Boolean,
			default: false
		}
	},
	computed: {
		dtype: {
			get(){
				console.log('get dtype', arguments);
				let imgobj = this.imgs.find(x => x.type == this.eType);
				this.imgurl = imgobj ? imgobj.url : this.imgurl_dft;
				return this.eType
			},
			set(val){
				console.log('set dtype', arguments);
			}
		}
	},
	data() {
		return {
            webviewStyles: {
				progress: {
					color: "#00aa55"
				}
			},
            customWebview: {
            /* 设置 web-view 的宽度为 80% */
                width: '50%'
            /* 可以根据需要设置其他样式 */
            // margin: 0 auto; 
            },
			imgurl_dft: '/static/images/empty/empty.jpg',
			imgurl: '',
			imgs: [
				{ type: 'cart', url: '/static/images/empty/cart.jpg' },
				{ type: 'search', url: '/static/images/empty/search.jpg' },
				{ type: 'other', url: '/static/images/empty/empty.jpg' }
			],
            imWebUrl: 'https://env-00jxt0xsfk5j-static.normal.cloudstatic.cn',
			path: '/#/uni_modules/uni-im/pages/index/index',
			param: {},
            url: '',
            backButtonPress: 0,
		};
	},
    onShow(options) {
		console.log('onShowonShowonShowonShowonShowonShow', this.cur_token, this.token);
	},
    created() {
		this.loadWebView();
        console.log('xxxxxxxxxxxxxxxxxxxx', this.cur_token, this.token);
	},
	methods: {
		to() {
			this.$emit('goto', {
				type: 'goto'
			});

			if (this.auto) {
				// 跳转指定页
				uni.switchTab({
					url: this.btnGoto
				})
			}
		},
        // 加载webView
		async loadWebView() {
			// 托管im页面的地址，以http或https开头，例如：https://im.dcloud.net.cn 在部署完毕后到部署记录中获取，地址：http://ext.dcloud.net.cn/manage/one-click-deployment
			// const imWebUrl = 'https://env-00jxt0xsfk5j-static.normal.cloudstatic.cn'
			// 要对话的客服的id。获取方式:直接打开imWebUrl，注册并登录后，在控制台执行`uni.imObservableData.currentUser._id`获取
			// const user_id = '679cab7edfa50110f6a894c8'
			// 要直达的im页面地址
			// const path = '/#/uni_modules/uni-im/pages/index/index'
			/**
			 * 登录参数，
			 * 以下：三种模式，三选一
			 */
            
        
			this.param.uni_id_token = this.token;
			// {
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
				// uni_id_token:  this.uni_id_token
				
				// 2. 主项目为非unicloud项目，必须传token。关于值，如果你项目的token不是存在storage内或key值不是token需要根据实际情况修改
				// token: uni.getStorageSync('token'),
				// 如果token不是jwt未包含user_id需再传user_id。具体根据你提供的getUserInfo接口要求
				// user_id: uni.getStorageSync('current_user_id')
			// }
			
			// 校验是否正确配置imWebUrl, user_id ,param
			if(!this.imWebUrl){
				return uni.showModal({
					content: '请配置imWebUrl',
					showCancel: false
				});
			}
			// if(!user_id){
			// 	return uni.showModal({
			// 		content: '请配置user_id',
			// 		showCancel: false
			// 	});
			// }
			if(Object.keys(this.param).length === 0){
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
			this.param.mainAppInfo = {
				appid,
				device_id,
				push_clientid
			}
            
            let timestamp = new Date().getTime();
			console.log('kkkkkkkkkkkkkkkkkkkkkkkk', this.touid, this.url, this.param);
            if (typeof this.touid === 'undefined' || !this.touid) {
			    this.url = `${this.imWebUrl + this.path}?login=${encodeURIComponent(JSON.stringify(this.param))}&timeflag=${timestamp}`;
            } else {
                this.url = `${this.imWebUrl + this.path}?login=${encodeURIComponent(JSON.stringify(this.param))}&user_id=${this.touid}&timeflag=${timestamp}`;
            }
			console.log('yyyyyyyyyyyyyyy', this.touid, this.url, this.param);
		},
		onMessage(e) {
			console.log('onMessage', e)
		}
	}
};
</script>

<style lang="scss">
.use-empty-container{
    position: relative;
    display: flex;
    justify-content: center; /* 水平方向居中 */
    // align-items: center;
    // width: 100%;
}
</style>
