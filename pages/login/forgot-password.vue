<template>
	<view class="container bg-main pos-r">

		<view class="padding-xl dflex-c dflex-flow-c">
			<view class="portrait-box margin-bottom">
				<image class="headimg border-radius-c" :src="(member && member.member_headimg) || '/static/images/user/default_head.jpg'"></image>
			</view>

			<view class="w-full dflex padding-bottom-sm">
				<view class="iconfont iconshouji margin-right"></view>
				<view class="flex1 dflex">
					<input class="border-line padding-sm flex1" type="number" data-key="mobile" maxlength="11" :value="mobile" @input="inputChange"
					 placeholder="请输入手机号" />
					<view v-if="0 == 1" class="padding-tb-sm ft-dark">自动获取</view>
				</view>
			</view>

			<view class="w-full dflex padding-bottom-sm">
				<view class="iconfont iconmima margin-right"></view>
				<!-- #ifdef MP -->
				<input class="border-line padding-sm flex1" type="text" password data-key="password" maxlength="20" :value="password"
				 @input="inputChange" placeholder="请输入新密码" />
				<!-- #endif -->
				<!-- #ifndef MP -->
				<input class="border-line padding-sm flex1" type="password" password data-key="password" maxlength="20" :value="password"
				 @input="inputChange" placeholder="请输入新密码" />
				<!-- #endif -->

			</view>

			<!-- <view class="w-full dflex padding-bottom-sm">
				<view class="iconfont iconyanzheng margin-right"></view>
				<view class="border-line flex1 dflex">
					<input class="padding-sm flex1" type="number" data-key="code" maxlength="6" :value="code" @input="inputChange"
					 @confirm="submit" placeholder="请输入验证码" />
					<view v-if="!is_send" class="padding-tb-sm ft-base" @click="sendCode">发送验证码</view>
					<view v-else class="padding-tb-sm ft-base">{{code_time}}s 重新获取</view>
				</view>
			</view> -->
			<view class="w-full margin-top-xl">
				<view class="dflex-b border-radius-lg">
					<view class="tac padding-tb-sm flex1 bg-base fs" @click="changePwd">本机手机号一键验证修改</view>
				</view>
			</view>
		</view>

		<!-- 用云版权 -->
		<use-copyright class="pos-f w-full" style="bottom: -30rpx"></use-copyright>
	</view>
</template>

<script>
	import {
		mapState,
		mapGetters
	} from 'vuex';

	export default {
		data() {
			return {
				env: {},
				__token: '',
				is_show: false,

				mobile: '',
				password: '',
				code: '',

				is_submit: false,
				is_send: false,
				code_time: 30,
				timer: 0,
				isLoginingByUniverify: false
			};
		},
		computed: {
			...mapGetters(["member"])
		},

		// 页面加载获取 wx.login code
		onShow() {
			// #ifdef MP-WEIXIN
			let lopts = uni.getLaunchOptionsSync();
			console.log(lopts);
			// #endif
		},
		onLoad() {
			this.$api.get_env((res) => {
				this.env = res;
				console.log(this.env);
				this.is_mp = this.env.is_mp;
				this.platform = this.env.platform;
				this.platform_icon = this.env.platform_icon;
				this.platform_name = this.env.platform_name;
			});
		},
		methods: {
			inputChange(e) {
				const key = e.currentTarget.dataset.key;
				this[key] = e.detail.value;
			},

			// 发送验证码
			sendCode() {
				let _this = this;

				if (!this.mobile) {
					this.$api.msg('请输入手机号');
					return;
				}
				if (!/(^1[3|4|5|6|7|8|9][0-9]{9}$)/.test(this.mobile)) {
					this.$api.msg('请输入正确的手机号码');
					return;
				}

				if (this.is_send) return;

				uni.showLoading({
					title: '发送中'
				})
				
				
				this.code_time = 30;
				this.is_send = true;
				
				this.$func.usemall.call('member/sendSmsCode', {
					mobile: this.mobile,
					type: 'forgot-password',
					platform: _this.env.platform,
				}).then(res => {
					uni.hideLoading();
					
					if (res.code == 200) {
				
						this.$api.alert('验证码已发送', () => {
							this.timer = setInterval(() => {
								--this.code_time;
				
								if (this.code_time <= 0) {
									clearInterval(this.timer)
									this.is_send = false;
									this.code_time = 30;
									return;
								}
							}, 1000);
						});
						
						return;
					}
				
					this.$api.msg(res.msg);
				});
			},
			changePwd() {
				let _this = this;
				if (this.is_submit) return;

				if (!this.mobile) {
					this.$api.msg('请输入手机号');
					return;
				}
				if (!/(^1[3|4|5|6|7|8|9][0-9]{9}$)/.test(this.mobile)) {
					this.$api.msg('请输入正确的手机号码');
					return;
				}

				if (!this.password) {
					this.$api.msg('请输入新密码');
					return;
				}
				if (this.$api.trim(this.password).length < 4) {
					this.$api.msg('密码长度不能小于4位');
					return;
				}

				if (this.isLoginingByUniverify) {
					return
				}
				
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
							if (phoneNumber != _this.mobile) {
								_this.$api.msg('输入手机号与当前手机号不一致');
								return
							}

							//接下来就进行你自己的操作
							_this.$func.usemall
								.call('member/changePwdByUniverify', {
									phoneNumber: phoneNumber,
									passwordNew: _this.password,
									openid: openid,
									access_token: access_token
								})
								.then(res => {
									console.log("login data: ", res);
									if (res.code == 200) {
										_this.$api.msg('修改密码成功');
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
			submit() {
				let _this = this;
				if (this.is_submit) return;

				if (!this.mobile) {
					this.$api.msg('请输入手机号');
					return;
				}
				if (!/(^1[3|4|5|6|7|8|9][0-9]{9}$)/.test(this.mobile)) {
					this.$api.msg('请输入正确的手机号码');
					return;
				}

				if (!this.password) {
					this.$api.msg('请输入新密码');
					return;
				}
				if (this.$api.trim(this.password).length < 4) {
					this.$api.msg('密码长度不能小于4位');
					return;
				}

				if (!this.code) {
					this.$api.msg('请输入验证码');
					return;
				}
				
				const data = {
					mobile: _this.mobile,
					password: _this.password,
					code: _this.code,
					platform: _this.env.platform
				};
				console.log(data);

				_this.is_submit = true;
				
				this.$func.usemall.call('member/forgotPassword', data).then(res => {
					_this.is_submit = false;
					if (res.code == 200) {
					
						_this.$api.alert('密码已修改', () => {
							if (_this.$api.pages().length > 1) {
								uni.setStorage({
									key: '__mobile',
									data: _this.mobile
								})
								// 跳转登录
								uni.navigateBack();
								return;
							}
							// 登录页
							_this.$api.tologin();
							return;
						});
						
						return;
					}
					
					_this.$api.msg(res.msg);
				});
			},
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
</style>
