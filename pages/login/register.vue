<template>
	<view class="container bg-main pos-r">

		<view class="padding-xl dflex-c dflex-flow-c">
			<view class="portrait-box margin-bottom">
				<image class="headimg border-radius-c" :src="(member && member.member_headimg) || '/static/images/user/default4.jpg'"></image>
			</view>

			<view class="w-full dflex padding-bottom-sm">
				<view class="iconfont iconshouji margin-right"></view>
				<view class="flex1 dflex">
					<input class="border-line padding-sm flex1" type="number" data-key="mobile" maxlength="11"
						:value="mobile" @input="inputChange" placeholder="请输入手机号" />
					<view v-if="0 == 1" class="padding-tb-sm ft-dark">获取</view>
				</view>
			</view>

			<view class="w-full dflex padding-bottom-sm">
				<view class="iconfont iconmima margin-right"></view>
				<!-- #ifdef MP -->
				<input class="border-line padding-sm flex1" type="text" password data-key="password" maxlength="20"
					:value="password" @input="inputChange" placeholder="请输入密码" />
				<!-- #endif -->
				<!-- #ifndef MP -->
				<input class="border-line padding-sm flex1" type="password" password data-key="password" maxlength="20"
					:value="password" @input="inputChange" placeholder="请输入密码" />
				<!-- #endif -->

			</view>

			<!-- <view class="w-full dflex padding-bottom-sm">
				<view class="iconfont iconyanzheng margin-right"></view>
				<view class="border-line flex1 dflex">
					<input class="padding-sm flex1" type="number" data-key="code" maxlength="6" :value="code"
						@input="inputChange" @confirm="register" placeholder="请输入验证码" />
					<view v-if="!is_send" class="padding-tb-sm ft-base" @click="sendCode">发送验证码</view>
					<view v-else class="padding-tb-sm ft-base">{{code_time}}s 重新获取</view>
				</view>
			</view> -->
			
			<view class="w-full dflex padding-bottom-sm">
				<view class="iconfont iconfenxiaodingdan-01 margin-right"></view>
				<view class="dflex-e flex1 padding-left-sm">
					<uni-data-checkbox :multiple="false" v-model="selectMemberRole" :localdata="member_role"
						@change="changeMemberRole"></uni-data-checkbox>
				</view>
				<!-- <view class="uni-list">
				<view class="uni-list-cell"> -->
					<!-- <input class="border-line padding-sm flex1" type="text" password data-key="password" maxlength="20"
						:value="password" @input="inputChange" placeholder="选择类型" /> -->
<!-- 					<view class="uni-list-cell-left border-line padding-sm flex1">
										当前选择
					</view> -->
					<!-- <view class="uni-list-cell-db">
						<picker @change="bindPickerChange" :value="member_index" :range="member_type">
							<view class="uni-input padding-sm flex1">
								{{member_type[member_index]}}
							</view>
						</picker>
					</view> -->
					<!-- <view class="uni-list-cell-db">
										<picker mode="time" :value="time" start="09:01" end="21:01" @change="bindTimeChange">
											<view class="uni-input">{{time}}</view>
										</picker>
									</view> -->
								<!-- <view class="uni-list-cell-left">
									当前选择
								</view> -->
<!-- 								<view class="uni-list-cell-db">
									<picker @change="bindPickerChange" :value="index" :range="array">
										<view class="uni-input">{{array[index]}}</view>
									</picker>
								</view> -->
				<!-- </view>
				</view> -->
			
			</view>
			<view class="w-full margin-top-xl">
				<view class="dflex-b border-radius-lg">
					<view class="tac padding-tb-sm flex1 bg-base fs" @click="register">注册</view>
				</view>
			</view>
			<view class="w-full dflex-c margin-top-xl">
				<checkbox-group @change="checkboxChange">
					<label>
						<checkbox value="true"/>
					</label>
				</checkbox-group>
				<text>我已阅读并同意</text>
				<view><navigator url="/pages/user/privacy/service">《服务协议》</navigator></view>
				<text>和</text>
				<view><navigator url="/pages/user/privacy/privacy">《隐私政策》</navigator></view>
			</view>
		</view>

		<!-- 用云版权 -->
		<use-copyright class="pos-f w-full" style="bottom: -30rpx"></use-copyright>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex';

	export default {
		data() {
			return {
				env: {},
				is_show: false,

				mobile: '',
				password: '',
				code: '',

				is_register: false,
				is_send: false,
				code_time: 30,
				timer: 0,
				member_type: ['student', 'teacher'],
				// member_index: 0,
				member_role: [{
						"value": 0,
						"text": "我是学生"
					},
					{
						"value": 1,
						"text": "我是老师"
					},
				],
				selectMemberRole: 0,
				// privacyCb: false,
				isAgreed: false,
			};
		},
		computed: {
			...mapState(["member"])
		},

		// 页面加载获取 wx.login code
		onShow() {
			console.log('login Show');
			// #ifdef MP-WEIXIN
			let lopts = uni.getLaunchOptionsSync();
			// #endif
		},
		onLoad() {
			this.$api.get_env((res) => {
				this.env = res;
				// console.log(this.env);
				this.is_mp = this.env.is_mp;
				this.platform = this.env.platform;
				this.platform_icon = this.env.platform_icon;
				this.platform_name = this.env.platform_name;
			});
		},
		methods: {
			checkboxChange(e) {
				if (e.detail.value.includes('true')) {
					this.isAgreed = true;
				} else {
					this.isAgreed = false;
				}
				console.log('选中的值为：', e.detail.value, this.isAgreed);
			},
				
			changeMemberRole(e) {
				this.selectMemberRole = e.detail.value;
				console.log('e:', this.value, this.selectMemberRole);
			},
			
			bindPickerChange: function(e) {
			            console.log('picker发送选择改变，携带值为', e.detail.value)
			            this.member_index = e.detail.value
			        },
					
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
				if (!/(^1[3|4|5|7|8|9][0-9]{9}$)/.test(this.mobile)) {
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
					type: 'register'
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

					this.is_send = false;
					this.code_time = 30;
					this.$api.msg(res.msg);
				});
			},
			tologin() {
				// 登录页
				uni.navigateBack({});
			},
			register() {
				let _this = this;
				
				console.log('privacyCb', this.privacyCb, this.isAgreed);
				if (!_this.isAgreed) {
					this.$api.msg('为更好保障您的合法权益，请阅读并同意以下协议《服务协议》《隐私政策》');
					return;
				}
				
				if (_this.is_register) return;

				if (!this.mobile) {
					this.$api.msg('请输入手机号');
					return;
				}
				if (!/(^1[3|4|5|7|8|9][0-9]{9}$)/.test(this.mobile)) {
					this.$api.msg('请输入正确的手机号码');
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
				// if (!this.code) {
				// 	this.$api.msg('请输入验证码');
				// 	return;
				// }
				
				// #ifdef H5 || MP-360 || APP-PLUS
				uni.getUserProfile = (x) => {
					if (typeof x.success === 'function') {
						x.success({ userInfo: {} });
					}
				};
				// #endif

				uni.getUserProfile({
					desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
					lang: 'zh_CN',
					success: res => {
						// console.log('getUserProfile', res);
						this.is_register = true;
						this.$func.usemall.call('member/register', {
							username: this.mobile,
							password: this.password,
							code: this.code,
							user: res.userInfo,
							member_type: this.member_type[this.selectMemberRole]
						}).then(res => {
							this.is_register = false;
							if (res.code == 200) {
						
								this.$api.alert('注册成功', () => {
									if (this.$api.pages().length > 1) {
										uni.setStorage({
											key: '__mobile',
											data: this.mobile
										})
										// 跳转登录
										uni.navigateBack();
										return;
									}
									// 登录页
									this.$api.tologin();
									return;
								});
						
								return;
							}
						
							this.$api.msg(res.msg);
						});
						
					}
				});
			}

		},

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
	
	.custom-checkbox {
		width: 10upx;
		height: 10upx;
		/* 修改边框样式 */
		// border: 2px solid #007aff;
		/* 修改圆角 */
		// border-radius: 5px;
	}
</style>
