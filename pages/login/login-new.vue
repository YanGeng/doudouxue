<template>
	<view class="login_container">
		<view class="iconfont icon-close" @click="onClose"></view>
		<view class="login_main">
			<view class="title-box Lefted">
				<view class="FW500 title">登录/注册</view>
			</view>
			<view class="welcome Lefted"> Welcome！ </view>
			<view class="login_form ">
				<view class="form-item Lefted">
					<view class="icon-box Lefted">
						<view class="iconfont icon-iphone icon"></view>
					</view>
					<view class="input-box Lefted">
						<!-- <input class="input" type="number" :value="formState.phone" maxlength="11" placeholder="请输入手机号"
							placeholder-class="placeholder" @input="checkPhoneChange" /> -->
						<input class="input" type="tel" v-model="formState.phone" maxlength="11" placeholder="请输入手机号"
							placeholder-class="placeholder" />
					</view>
				</view>
				<view class="form-item Lefted" v-if="!smsLogin">
					<view class="icon-box Lefted">
						<view class="iconfont icon-lock icon"></view>
					</view>
					<view class="input-box Lefted">
						<input v-if="!showPassword" class="input" type="password" password v-model="formState.password" maxlength="20"
							placeholder="请输入密码" placeholder-class="placeholder" />
						<input v-else class="input" type="text" v-model="formState.password" maxlength="20"
							placeholder="请输入密码" placeholder-class="placeholder" />
					</view>
					<view class="margin-right" @click="togglePasswordVisibility">
						<uni-icons v-if="!showPassword" type="eye-filled" size="30"></uni-icons>
						<uni-icons v-if="showPassword" type="eye" size="30"></uni-icons>
					</view>
				</view>
				<view class="form-item Lefted" v-if="smsLogin">
					<view class="icon-box Lefted">
						<view class="iconfont icon-key icon"></view>
					</view>
					<view class="input-box Lefted">
						<input class="input" type="number" :value="formState.captcha" maxlength="6" placeholder="请输入验证码"
							placeholder-class="placeholder" />
					</view>
					<button class="btn-captcha btn-active Centered"
						:class="!captchaClassStatus ? 'captcha-bg-1' : 'captcha-bg-2'" :disabled="captchaDisabled"
						@click="getCaptcha">
						{{ captchaTxt }}
					</button>
				</view>
				<view class="switch-pwd Betweened">
					<view class="pwd-txt" @click="onSwitchPwd">{{ !isCaptchaLogin ? '密码登录' : '注册' }}</view>
					<!-- <view class="forget-txt" v-show="isCaptchaLogin">密码忘记了？</view> -->
				</view>
			</view>
			<button class="btn-login btn-active Centered" @click="pwdLoginLocal">登录</button>
			<view class="login_agreement Centered">
				<checkbox-group @change="checkboxChange">
					<label>
						<checkbox value="true" />
					</label>
				</checkbox-group>
				<text>我已阅读并同意</text>
				<!-- #ifdef MP-WEIXIN || MP-BAIDU -->
				<!-- <text>登录/注册代表您已同意</text> -->
				<!-- #endif -->
				<text class="txt" @click="goUserServiceAgreement">《用户服务协议》</text>
				<text>和</text>
				<text class="txt" @click="goPrivacyAgreement">《隐私政策》</text>
			</view>

			<view class="login-cutline Betweened">
				<view class="line"></view>
				<view class="txt FW400 txt">or</view>
				<view class="line"></view>
			</view>
			<view class="login_third">
				<!-- <view class="Centered child" @click="wechatLoginLocal">
					<view class="iconfont icon-wechat-fill icon"></view>
				</view> -->
				
				<!-- #ifdef APP-PLUS -->
				<view class="Centered child" @click="loginByUniverify">
					<view class="iconfont icon-iphone icon"></view>
				</view>
				<!-- #endif -->
				<view v-if="false" class="Centered child vertical" @click="changeLoginType">
					<view v-if="!smsLogin" class="iconfont icon-messagefill icon"></view>
					<view v-if="smsLogin" class="iconfont iconfenxiaohuiyuan-01 icon"></view>
					<view v-if="!smsLogin" style="font-size: 20rpx;">验证码登录</view>
					<view v-if="smsLogin" style="font-size: 20rpx;">账号密码登录</view>
				</view>
				<!-- <view class="Centered child" @click="appleLoginLocal">
					<view class="iconfont icon-apple-fill icon"></view>
				</view> -->
			</view>
		</view>
	</view>
</template>

<script lang="ts" setup>
	import { useStore } from 'vuex';
	import uniIm from '@/uni_modules/uni-im/sdk/index.js';
	
	const store = useStore();
	const is_login = store.getters.islogin;
	const token = store.getters.token;
	const isPreLoginSucess = store.getters.isPreLoginSucess;

	const isLoginingByUniverify = ref(false)

	// 这里没有直接使用 mapMutations，而是直接从 store 调用 mutation
    const handleLogin = (data) => {
      store.commit('login', data);
    };

    const handleLogout = () => {
      store.commit('logout');
    };

	import { ref, watch, getCurrentInstance, onMounted, nextTick } from 'vue';

	const formState = ref({
		phone: '',
		password: '',
		captcha: '',
	})
	const showPassword = ref(false)
	const smsLogin = ref(false)
	const isCaptchaLogin = ref(true);
	const captchaDisabled = ref(false);
	const captchaClassStatus = ref(false);
	const captchaTxt = ref('获取验证码');
	const countdown = ref(0);

	// 获取当前组件实例
	const { appContext } = getCurrentInstance()!;

	watch(countdown, (newValue) => {
		captchaDisabled.value = newValue !== 0;
	});

	onMounted(() => {
		console.log('页面初次渲染完成', isPreLoginSucess)

		nextTick(() => {
			// DOM 更新后执行
			if (isPreLoginSucess) {
				loginByUniverify()
			}
		})
	})
	
	// 关闭页面
	const onClose = () => uni.navigateBack()
	// 校验手机号
	const checkPhoneChange = () => { };
	// 切换 验证码/密码 登录
	const onSwitchPwd = () => {
		// isCaptchaLogin.value = !isCaptchaLogin.value;
		// 注册页
		uni.navigateTo({
				url: '/pages/login/register'
			});
	};
	
	const togglePasswordVisibility = () => {
		console.log('togglePasswordVisibility b: ', showPassword);
		showPassword.value = !showPassword.value;
		console.log('togglePasswordVisibility a: ', showPassword);
	};
	
	const changeLoginType = () => {
		smsLogin.value = !smsLogin.value;
	}

	const checkboxValue = ref(false)
	const checkboxChange = (e) => {
		if (e.detail.value.includes('true')) {
			checkboxValue.value = true;
		} else {
			checkboxValue.value = false;
		}
		console.log('选中的值为：', e.detail.value, checkboxValue.value);
	}
	// 获取验证码
	const getCaptcha = () => {
		if (!formState.value.phone) {
			appContext.config.globalProperties.$api.msg('请输入手机号');
			return;
		}

		appContext.config.globalProperties.$func.usemall
			.call('member/sendSmsCode', {
				mobile: formState.value.phone.toString(),
				type: 'login'
			})
			.then(res => {
				console.log("login data: ", res);
				// if (res.code == 200) {
				// 	// 调用 store login
				// 	handleLogin(res.datas);

				// 	console.log('11111 uniIm.login uni_id_token:', token, is_login, res.datas)
				// 	let tmpToken = res.datas.user.token// uni.getStorageSync('uni_id_token')
				// 	console.log('uniIm.login uni_id_token:', tmpToken, is_login, res.datas)

				// 	uniIm.login({
				// 		//如果你项目的token不是存在storage内或key值不是token需要根据实际情况修改
				// 		uni_id_token: tmpToken,
				// 		//如果你项目的用户信息不是存在storage内或key值不是current_user_id需要根据实际情况修改
				// 		// user_id: uni.getStorageSync('current_user_id')

				// 		// 与token字段，两个参数二选一
				// 		// uni_id_token:  uni.getStorageSync('uni_id_token') 
				// 	})

				// 	appContext.config.globalProperties.$api.msg('登录成功');
				// 	// #ifndef H5
				// 	if (appContext.config.globalProperties.$api.pages().length > 1) {
				// 		// 返回上一页
				// 		appContext.config.globalProperties.$api.timerout(() => {
				// 			uni.navigateBack({});
				// 		}, 200);

				// 		return;
				// 	}
				// 	// #endif

				// 	return;
				// }

				appContext.config.globalProperties.$api.msg(res.msg);
			});

		if (countdown.value === 0) {
			// Start countdown
			countdown.value = 60;
			const timer = setInterval(() => {
				countdown.value--;
				if (countdown.value === 0) {
				clearInterval(timer);
				captchaTxt.value = '重新获取';
				} else {
				captchaTxt.value = `${countdown.value}s`;
				}
			}, 1000);
		}
	};
	// 手机号验证码登录
	const phoneLoginLocal = () => { };
	// 账号密码登录
	const pwdLoginLocal = () => { 
		// let _this = this;
		console.log('is_login: ', is_login, formState.value)
		if (is_login) return;

		if (!formState.value.phone) {
			appContext.config.globalProperties.$api.msg('请输入手机号');
			return;
		}

		if (!formState.value.password) {
			appContext.config.globalProperties.$api.msg('请输入密码');
			return;
		}
		if (appContext.config.globalProperties.$api.trim(formState.value.password).length < 4) {
			appContext.config.globalProperties.$api.msg('密码长度不能小于4位');
			return;
		}
		console.log('privacyCb', appContext.config.globalProperties.privacyCb, appContext.config.globalProperties.isAgreed);
		
		if (!checkboxValue.value) {
			appContext.config.globalProperties.$api.msg('为更好保障您的合法权益，请阅读并同意以下协议《服务协议》《隐私政策》');
			return;
		}

		appContext.config.globalProperties.$func.usemall
			.call('member/login', {
				username: formState.value.phone,
				password: formState.value.password
			})
			.then(res => {
				console.log("login data: ", res);
				if (res.code == 200) {
					// 调用 store login
					handleLogin(res.datas);

					console.log('11111 uniIm.login uni_id_token:', token, is_login, res.datas)
					let tmpToken = res.datas.user.token// uni.getStorageSync('uni_id_token')
					console.log('uniIm.login uni_id_token:', tmpToken, is_login, res.datas)

					uniIm.login({
						//如果你项目的token不是存在storage内或key值不是token需要根据实际情况修改
						uni_id_token: tmpToken,
						//如果你项目的用户信息不是存在storage内或key值不是current_user_id需要根据实际情况修改
						// user_id: uni.getStorageSync('current_user_id')

						// 与token字段，两个参数二选一
						// uni_id_token:  uni.getStorageSync('uni_id_token') 
					})

					appContext.config.globalProperties.$api.msg('登录成功');
					// #ifndef H5
					if (appContext.config.globalProperties.$api.pages().length > 1) {
						// 返回上一页
						appContext.config.globalProperties.$api.timerout(() => {
							uni.navigateBack({});
						}, 200);

						return;
					}
					// #endif

					return;
				}

				appContext.config.globalProperties.$api.msg(res.msg);
			});
	};
	// 微信登录
	const wechatLoginLocal = () => {
		uni.login({
			provider: 'weixin',
			// onlyAuthorize: true,
			success(mpres) {
				console.log('wechatLoginLocal uni.login', mpres);
				if (mpres.errMsg == 'login:ok') {
					appContext.config.globalProperties.$func.usemall
						.call('member/loginByWeixin', {
							code: mpres.code
						})
						.then(res => {
							console.log('xxxxxxxxxxxxxxxxxxx', res);
							if (res.code == 200) {
								console.log('member/loginByWeixin', res);
								// 调用 store login
								appContext.config.globalProperties.login(res.datas);
								
								appContext.config.globalProperties.$api.alert('登录成功', () => {
									if (appContext.config.globalProperties.$api.pages().length > 1) {
										// 返回上一页
										uni.navigateBack({});
										return;
									}
									// 首页
									appContext.config.globalProperties.$api.tohome();
								});
								return;
							}
		
							appContext.config.globalProperties.$api.msg(res.msg);
						});
				}
			},
			fail(err) {
				console.log('uni.login', err);
			}
		});
	};
	// 手机号一键登录
	const loginByUniverify = () => {
		if (isLoginingByUniverify.value) {
			return
		}
		
		isLoginingByUniverify.value = true;
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
					appContext.config.globalProperties.$func.usemall
						.call('member/loginByUniverify', {
							phoneNumber: phoneNumber,
							openid: openid,
							access_token: access_token
						})
						.then(res => {
							console.log("login data: ", res);
							if (res.code == 200) {
								// 调用 store login
								handleLogin(res.datas);

								let tmpToken = uni.getStorageSync('uni_id_token')
								console.log('uniIm.login uni_id_token:', tmpToken, res.datas)

								tmpToken = res.datas.user.token

								console.log('xxxxxxxxxxx uni_id_token:', tmpToken, token)

								uniIm.login({
									//如果你项目的token不是存在storage内或key值不是token需要根据实际情况修改
									uni_id_token: tmpToken,
									//如果你项目的用户信息不是存在storage内或key值不是current_user_id需要根据实际情况修改
									// user_id: uni.getStorageSync('current_user_id')

									// 与token字段，两个参数二选一
									// uni_id_token:  uni.getStorageSync('uni_id_token') 
								})

								appContext.config.globalProperties.$api.msg('登录成功');
								// #ifndef H5

								console.log("_this.$api.pages: ", appContext.config.globalProperties.$api.pages().length);
								if (appContext.config.globalProperties.$api.pages().length > 1) {
									// 返回上一页
									console.log("_this.$api.pages: ", appContext.config.globalProperties.$api.pages().length);
									appContext.config.globalProperties.$api.timerout(() => {
										uni.navigateBack({});
									}, 200);

									return;
								}
								// #endif

								return;
							}

							appContext.config.globalProperties.$api.msg(res.msg);
						});
				}).catch((err) => {
					// 执行失败后的操作
					//...
					//...
				})

				uni.closeAuthView();
				isLoginingByUniverify.value = false;
			},
			fail(res) {  // 登录失败
				console.log('登录失败')
				console.log(res.errCode)
				console.log(res.errMsg)
				isLoginingByUniverify.value = false;
			}
		})
	}
	// QQ登录
	const qqLoginLocal = () => { };
	// Apple登录
	const appleLoginLocal = () => { };
	// 用户服务协议
	const goUserServiceAgreement = () => { 
		console.log('goUserServiceAgreement is clicked')
		uni.navigateTo({
				url: '/pages_user/user/privacy/service'
			});
	};
	// 隐私政策
	const goPrivacyAgreement = () => {
		uni.navigateTo({
      		url: "/pages_user/user/privacy/privacy"
      	});
	 };
</script>

<style lang="scss">
	@import 'login.scss';

	page {
		background: $page-bg-white;
		box-sizing: border-box;
	}
	
	/* 添加垂直排列样式 */
	.vertical {
	  flex-direction: column; /* 修改为垂直方向 */
	  align-items: center;    /* 水平居中对齐 */
	  justify-content: center; /* 垂直居中对齐 */
	}
</style>