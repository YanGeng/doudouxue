<template>
	<view class="container bg-main pos-r">
		<view class="padding-xl dflex-c dflex-flow-c">
			<view class="portrait-box margin-bottom">
				<image class="headimg border-radius-c"
					:src="(member && member.member_headimg) || '/static/images/user/default_head.jpg'"></image>
			</view>

			<view class="w-full dflex padding-bottom-sm">
				<view class="iconfont iconshouji margin-right"></view>
				<view class="flex1 dflex">
					<input class="border-line padding-sm flex1" type="number" data-key="mobile" maxlength="11"
						:value="mobile" @input="inputChange" placeholder="请输入手机号" />
					<view v-if="0 == 1" class="padding-tb-sm ft-dark" @click="send_code">获取</view>
				</view>
			</view>

			<view class="w-full dflex">
				<view class="iconfont iconmima margin-right"></view>
				<!-- #ifdef MP -->
				<input class="border-line padding-sm flex1" type="text" password data-key="password" maxlength="20"
					:value="password" @input="inputChange" @confirm="tologin" placeholder="请输入密码" />
				<!-- #endif -->

				<!-- #ifndef MP -->
				<input class="border-line padding-sm flex1" type="password" password data-key="password" maxlength="20"
					:value="password" @input="inputChange" @confirm="tologin" placeholder="请输入密码" />
				<!-- #endif -->
			</view>
			<view class="dflex-b w-full margin-bottom-sm">
				<!-- <view class="padding-tb-sm ft-dark" @click="toforget">忘记密码</view> -->
				<view class="padding-tb-sm ft-base" @click="toregister">立即注册</view>
			</view>
			<view class="w-full margin-top-xl">
				<view class="dflex-b border-radius-lg">
					<view class="tac padding-tb-sm flex1 bg-base fs" @click="tologin">登录</view>
				</view>
			</view>
			<view v-if="isPreLoginSucess" class="w-full margin-top">
				<view class="dflex-b border-radius-lg">
					<view class="tac padding-tb-sm flex1 bg-base fs" @click="loginByUniverify">本机手机号一键登录</view>
				</view>
			</view>
		</view>
		<view v-if="ismp" class="dflex-c margin-top-big">
			<!-- #ifdef MP-WEIXIN -->
			<!-- <button class="dflex-c dflex-flow-c no-border btn" lang="zh_CN" @click="mpWeixinTologin">
				<view class="iconfont padding-lr-sm border-radius-c fs-xxxl" :class="platform_icon"></view>
				<view class="dflex-c fs-sm ft-dark">{{ platform_name }} · 授权登录</view>
			</button> -->
			<!-- #endif -->
			<!-- #ifdef MP-BAIDU || MP-QQ -->
			<button class="dflex-c dflex-flow-c no-border btn" open-type="getUserInfo" lang="zh_CN"
				withCredentials="true" @getuserinfo="mpGetUserInfo">
				<view class="iconfont padding-lr-sm border-radius-c fs-xxxl" :class="platform_icon"></view>
				<view class="dflex-c fs-sm ft-dark">{{ platform_name }} · 授权登录</view>
			</button>
			<!-- #endif -->

			<!-- #ifdef MP-ALIPAY -->
			<view class="dflex-c dflex-flow-c no-border btn" open-type="getAuthorize" scope="userInfo"
				@click="onGetAuthorize" @error="onAuthError">
				<view class="iconfont padding-lr-sm border-radius-c fs-xxxl" :class="platform_icon"></view>
				<view class="dflex-c fs-sm ft-dark">{{ platform_name }} · 授权</view>
			</view>
			<!-- #endif -->

			<!-- #ifdef MP-TOUTIAO -->
			<view class="dflex-c dflex-flow-c no-border btn" open-type="getUserInfo" lang="zh_CN" withCredentials="true"
				@click="getUserInfo">
				<view class="iconfont padding-lr-sm border-radius-c fs-xxxl" :class="platform_icon"></view>
				<view class="dflex-c ft-dark">{{ platform_name }} · 授权</view>
			</view>
			<!-- #endif -->
		</view>
		<view class="w-full dflex-c margin-top-xl">
			<checkbox-group @change="checkboxChange">
				<label>
					<checkbox value="true" />
				</label>
			</checkbox-group>
			<text>我已阅读并同意</text>
			<view>
				<navigator url="/pages/user/privacy/service">《服务协议》</navigator>
			</view>
			<text>和</text>
			<view>
				<navigator url="/pages/user/privacy/privacy">《隐私政策》</navigator>
			</view>
		</view>

		<!-- 用云版权 -->
		<use-copyright class="pos-f w-full" style="bottom: -30rpx"></use-copyright>

		<!-- 弹出框 -->
		<view v-if="isshow" class="l-mask"></view>
		<view v-if="isshow" class="box-container">
			<view class="title"><text>授权手机号，同步会员|收货信息</text></view>
			<view class="btn-contaer">
				<button @click="cancel">取消</button>
				<button open-type="getPhoneNumber" @getphonenumber="mpPhoneNumber" withCredentials="true">授权</button>
			</view>
		</view>
	</view>
</template>

<script>
import { mapState, mapMutations, mapGetters } from 'vuex';
import uniIm from '@/uni_modules/uni-im/sdk/index.js';

export default {
	data() {
		return {
			isLoginingByUniverify: false,
			ismp: false,
			platform: '',
			platform_name: '',
			platform_icon: '',

			env: {},
			isshow: false,

			mobile: '',
			password: '',

			authorize: 0,
			isAgreed: false,
		};
	},
	computed: {
		...mapGetters(['member', 'islogin', 'isPreLoginSucess', 'token'])
	},

	onShow() {
		console.log('login Show', this.isLoginingByUniverify);
		// #ifdef MP-WEIXIN
		let lopts = uni.getLaunchOptionsSync();
		console.log(lopts);
		// #endif
		let _this = this;

		uni.getStorage({
			key: '__mobile',
			success(res) {
				_this.mobile = res.data;
			}
		});

		// 查看用户是否已授权获取用户数据
		if (uni.canIUse('getSetting')) {
			uni.getSetting({
				success(res) {
					console.log('getSetting ', res);
					_this.authorize = res.authSetting['scope.userInfo'];
					console.log('getSetting scope.userInfo authorize ', _this.authorize);
				}
			});
		}
	},
	onLoad() {
		let _this = this;

		this.$api.get_env(res => {
			this.env = res;
			console.log('this.env', this.env);
			this.ismp = this.env.is_mp;
			this.platform = this.env.platform;
			this.platform_icon = this.env.platform_icon;
			this.platform_name = this.env.platform_name;
		});
	},
	onReady() {
        console.log('onReady');
        // 页面初次渲染完成后，设置一个足够大的值使滚动到底部
        // this.scrollBottom();
        this.$nextTick(() => {
            // this.scrollBottomValue = 9999;
            // this.scrollToId = 'y-chat-bottom-view'
			if (this.isPreLoginSucess) {
            	this.loginByUniverify();
			}
        });
    },
	methods: {
		...mapMutations(['login', 'logout']),
		checkboxChange(e) {
			if (e.detail.value.includes('true')) {
				this.isAgreed = true;
			} else {
				this.isAgreed = false;
			}
			console.log('选中的值为：', e.detail.value, this.isAgreed);
		},
		loginByUniverify() {
			if (this.isLoginingByUniverify) {
				return
			}
			let _this = this;
			_this.isLoginingByUniverify = true;
			uni.login({
				provider: 'univerify',
				univerifyStyle: { // 自定义登录框样式
					//参考`univerifyStyle 数据结构`
					fullScreen: true,
					icon: {
						path: "/static/images/user/default_head.jpg", // 自定义显示在授权框中的logo，仅支持本地图片 默认显示App logo
						width: "60px",  //图标宽度 默认值：60px
						height: "60px"   //图标高度 默认值：60px
					},
					privacyTerms: {
						defaultCheckBoxState: false, // 条款勾选框初始状态 默认值： true
						isCenterHint: false, //未勾选服务条款时点击登录按钮的提示是否居中显示 默认值: false (3.7.13+ 版本支持)
						uncheckedImage: "", // 可选 条款勾选框未选中状态图片（仅支持本地图片 建议尺寸 24x24px）(3.2.0+ 版本支持)
						checkedImage: "", // 可选 条款勾选框选中状态图片（仅支持本地图片 建议尺寸24x24px）(3.2.0+ 版本支持)
						checkBoxSize: 25, // 可选 条款勾选框大小
						textColor: "#BBBBBB", // 文字颜色 默认值：#BBBBBB
						termsColor: "#5496E3", //  协议文字颜色 默认值： #5496E3
						prefix: "我已阅读并同意", // 条款前的文案 默认值：“我已阅读并同意”
						suffix: "并使用本机号码登录", // 条款后的文案 默认值：“并使用本机号码登录”
						privacyItems: [  // 自定义协议条款，最大支持2个，需要同时设置url和title. 否则不生效
							{
								url: "https://static-mp-0fe42d5b-82e4-482d-8ad1-81bb97905319.next.bspapp.com/health/#/pages/user/privacy/service", // 点击跳转的协议详情页面
								title: "《服务协议》" // 协议名称
							},
							{
								url: "https://static-mp-0fe42d5b-82e4-482d-8ad1-81bb97905319.next.bspapp.com/health/#/pages/user/privacy/privacy", // 点击跳转的协议详情页面
								title: "《隐私政策》" // 协议名称
							}
						]
					},
				},
				success(res) { // 登录成功
					console.log('登录成功', res.authResult);  // {openid:'登录授权唯一标识',access_token:'接口返回的 token'}
					console.log(res);
					let openid = res.authResult.openid; //拿到openid
					let access_token = res.authResult.access_token; //拿到access_token
					console.log(openid)
					console.log(access_token)

					// 在得到access_token和openid后，通过callfunction调用云函数
					uniCloud.callFunction({
						name: "getPhoneNumber",
						data: {
							openid,
							access_token
						}
					}).then(res1 => {
						console.log("获取成功");
						console.log(res1);
						// 获取用户的手机号
						let phoneNumber = res1.result.phoneNumber;
						//接下来就进行你自己的操作
						_this.$func.usemall
							.call('member/loginByUniverify', {
								phoneNumber: phoneNumber,
								openid: openid,
								access_token: access_token
							})
							.then(res => {
								console.log("login data: ", res);
								if (res.code == 200) {
									// 调用 store login
									_this.login(res.datas);
									
									let tmpToken = uni.getStorageSync('uni_id_token')
									console.log('uniIm.login uni_id_token:', tmpToken, res.datas)
									
									tmpToken = res.datas.user.token
									
									console.log('xxxxxxxxxxx uni_id_token:', tmpToken, _this.token)
									
									uniIm.login({
										//如果你项目的token不是存在storage内或key值不是token需要根据实际情况修改
										uni_id_token: _this.token,
										//如果你项目的用户信息不是存在storage内或key值不是current_user_id需要根据实际情况修改
										// user_id: uni.getStorageSync('current_user_id')
										
										// 与token字段，两个参数二选一
										// uni_id_token:  uni.getStorageSync('uni_id_token') 
									})

									_this.$api.msg('登录成功');
									// #ifndef H5

									console.log("_this.$api.pages: ", _this.$api.pages().length);
									if (_this.$api.pages().length > 1) {
										// 返回上一页
										console.log("_this.$api.pages: ", _this.$api.pages().length);
										_this.$api.timerout(() => {
											uni.navigateBack({});
										}, 200);

										return;
									}
									// #endif

									return;
								}

								_this.$api.msg(res.msg);
							});
					}).catch((err) => {
						// 执行失败后的操作
						//...
						//...
					})

					uni.closeAuthView();
					_this.isLoginingByUniverify = false;
				},
				fail(res) {  // 登录失败
					console.log('登录失败')
					console.log(res.errCode)
					console.log(res.errMsg)
					_this.isLoginingByUniverify = false;
				}
			})
		},
		inputChange(e) {
			const key = e.currentTarget.dataset.key;
			this[key] = e.detail.value;
		},
		toforget() {
			// 忘记密码
			uni.navigateTo({
				url: '/pages/login/forgot-password'
			});
		},
		toregister() {
			// 注册页
			uni.navigateTo({
				url: '/pages/login/register'
			});
		},

		tologin() {
			let _this = this;
			if (_this.is_login) return;

			if (!this.mobile) {
				this.$api.msg('请输入手机号');
				return;
			}

			if (!this.password) {
				this.$api.msg('请输入密码');
				return;
			}
			if (this.$api.trim(this.password).length < 4) {
				this.$api.msg('密码长度不能小于4位');
				return;
			}
			console.log('privacyCb', this.privacyCb, this.isAgreed);
			if (!_this.isAgreed) {
				this.$api.msg('为更好保障您的合法权益，请阅读并同意以下协议《服务协议》《隐私政策》');
				return;
			}

			this.$func.usemall
				.call('member/login', {
					username: this.mobile,
					password: this.password
				})
				.then(res => {
					console.log("login data: ", res);
					if (res.code == 200) {
						// 调用 store login
						_this.login(res.datas);
						
						let tmpToken = uni.getStorageSync('uni_id_token')
						console.log('uniIm.login uni_id_token:', tmpToken, _this.token, _this.islogin, res.datas)
						
						uniIm.login({
							//如果你项目的token不是存在storage内或key值不是token需要根据实际情况修改
							uni_id_token: _this.token,
							//如果你项目的用户信息不是存在storage内或key值不是current_user_id需要根据实际情况修改
							// user_id: uni.getStorageSync('current_user_id')
							
							// 与token字段，两个参数二选一
							// uni_id_token:  uni.getStorageSync('uni_id_token') 
						})
						
						_this.$api.msg('登录成功');
						// #ifndef H5
						if (_this.$api.pages().length > 1) {
							// 返回上一页
							_this.$api.timerout(() => {
								uni.navigateBack({});
							}, 200);
							
							return;
						}
						// #endif

						// _this.$api.alert('登录成功', () => {
						// 	// #ifndef H5
						// 	if (_this.$api.pages().length > 1) {
						// 		// 返回上一页
						// 		uni.navigateBack({});
						// 		return;
						// 	}
							
						// 	// _this.$api.tohome();
						// 	// #endif
							
						// 	// #ifdef H5
						// 	// uni.reLaunch({
						// 	//     url: '/pages/tabbar/home'
						// 	// })
						// 	// #endif
						// });
						
						// uni.setStorageSync('identify', "login");
						// if (uni.getStorageSync('identify') == 'login') {
						// 	console.log("set tabbar tony")
						// 	// uni.setTabBarItem({
						// 	// 	index: 2,
						// 	// 	// "pagePath": "/pages/tabbar/shopping",
						// 	// 	// "iconPath": "/static/images/tabbar/shopping.png",
						// 	// 	// "selectedIconPath": "/static/images/tabbar/shopping-active.png",
						// 	// 	// "text": "购物圈",
								
						// 	// 	"pagePath": "pages/tabbar/cart",
						// 	// 	"iconPath": "static/images/tabbar/cart.png",
						// 	// 	"selectedIconPath": "static/images/tabbar/cart-active.png",
						// 	// 	"text": "购物车"
						// 	// })
						// } 
						
						return;
					}

					_this.$api.msg(res.msg);
				});
		},

		cancel() {
			this.isshow = false;
			uni.navigateBack();
		},

		mpPhoneNumber(mp_phonenumber) {
			this.$api.msg('处理中');

			if (!mp_phonenumber.detail.encryptedData) {
				if (mp_phonenumber.detail.errMsg === 'getPhoneNumber:fail no permission' && this.platform === 'qq') {
					uni.showToast({
						title: 'QQ暂无法获取手机号',
						icon: 'none'
					});
				} else {
					uni.showToast({
						title: '您取消了授权，操作失败',
						icon: 'none'
					});
				}

				this.isshow = false;
				uni.navigateBack();
				return false;
			}
			console.log('------- mpPhoneNumber 用户授权，并获取用户基本信息和加密数据------');
			console.log(mp_phonenumber.detail);
		},

		// 微信授权登录，获取用户信息
		mpGetUserInfo(userinfo) {
			this.$api.msg('处理中');
			this.logout();

			this.$api.msg('请使用手机号+密码的方式登录');
			if (this.platform !== 'weixin' && this.platform !== 'baidu' && this.platform !== 'qq' && this.platform !== 'toutiao') {
				this.$api.msg('请使用手机号+密码的方式登录');
				return;
			}
		},
		// #ifdef MP-ALIPAY
		onGetAuthorize() {
			let _this = this;
			this.$api.msg('处理中');
			
			console.log('------- onGetAuthorize 用户授权，并获取用户基本信息 ------');
			
			uni.login({
				scopes: ['auth_base'], 
				success(mpres) {
					console.log('uni.login', mpres);
					if (mpres.errMsg == 'login:ok') {
						_this.$func.usemall
							.call('member/loginByAlipay', {
								code: mpres.code
							})
							.then(res => {
								if (res.code == 200) {
									console.log('member/loginByAlipay', res);
									// 调用 store login
									_this.login(res.datas);
									
									_this.$api.alert('登录成功', () => {
										if (_this.$api.pages().length > 1) {
											// 返回上一页
											uni.navigateBack({});
											return;
										}
										// 首页
										_this.$api.tohome();
									});
									return;
								}
			
								_this.$api.msg(res.msg);
							});
					}
				},
				fail(err) {
					console.log('uni.login', err);
				}
			});
		},
		onAuthError(res) {
			console.log('onAuthError', arguments);
			this.$api.msg(res.detail.errorMessage)
		},
		// #endif
		getUserInfo() {
			let _this = this;
			this.$api.msg('处理中');
			console.log('------- getUserInfo 用户授权，并获取用户基本信息和加密数据------');
		},
		getUserProfile() {
			uni.getUserProfile();
		},
		// #ifdef MP-WEIXIN
		mpWeixinTologin() {
			let _this = this;
			uni.login({
				provider: 'weixin',
				success(mpres) {
					console.log('uni.login', mpres);
					if (mpres.errMsg == 'login:ok') {
						_this.$func.usemall
							.call('member/loginByWeixin', {
								code: mpres.code
							})
							.then(res => {
								console.log('xxxxxxxxxxxxxxxxxxx', res);
								if (res.code == 200) {
									console.log('member/loginByWeixin', res);
									// 调用 store login
									_this.login(res.datas);
									
									_this.$api.alert('登录成功', () => {
										if (_this.$api.pages().length > 1) {
											// 返回上一页
											uni.navigateBack({});
											return;
										}
										// 首页
										_this.$api.tohome();
									});
									return;
								}

								_this.$api.msg(res.msg);
							});
					}
				},
				fail(err) {
					console.log('uni.login', err);
				}
			});
		},
		// #endif
	}
};
</script>

<style lang="scss">
page {
	background: #f4f4f4;
}

.container {
	padding-top: 5vh;
	width: 100vw;
	min-height: 100vh;
	overflow: hidden;
}

.portrait-box {
	image {
		width: 130rpx;
		height: 130rpx;
		border: 5rpx solid #fff;
	}
}

.l-mask {
	position: absolute;
	top: 0;
	left: 0;
	bottom: 0;
	right: 0;
	background: rgba(51, 51, 51, 0.3);
	z-index: 99;
}

.box-container {
	position: absolute;
	width: 500rpx;
	height: 300rpx;
	background: #fff;
	left: 50%;
	transform: translate(-50%, -50%);
	top: 50%;
	z-index: 999;
	border-radius: 10rpx;
	text-align: center;
	padding: 30rpx;

	.title {
		margin-top: 40rpx;
		font-size: 30rpx;
	}

	.btn-contaer {
		display: flex;
		position: absolute;
		bottom: 30rpx;
		left: 30rpx;
		right: 30rpx;
	}

	button {
		background: #eee;
		color: #333;
		width: 50%;
		font-size: 28rpx;

		&:last-child {
			margin-left: 10px;
			background: #26a92e;
			color: #fff;
		}
	}
}
</style>
