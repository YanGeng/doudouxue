<template>
	<view class="container">
		<use-list-title title="个人资料" iconfont=" " @goto="to"></use-list-title>
		<view class="gap"></view>
		
		<use-list-title v-if="aboutData && aboutData._id" title="关于豆豆学" iconfont=" " @goto="toabout"></use-list-title>
		<view v-if="aboutData && aboutData._id" class="gap"></view>
		
		<!-- #ifdef MP-ALIPAY -->
		<view class="use-item padding-left">
			<button class="no-border wh-full tal" open-type="feedback" @click="tofeedback">意见反馈</button>
		</view>
		<!-- #endif -->
		
		<!-- #ifndef MP-ALIPAY -->
		<view class="use-item">
			<button class="no-border wh-full tal" open-type="feedback" @click="tofeedback">意见反馈</button>
		</view>
		<!-- <use-list-title v-if="aboutData && aboutData._id" title="意见反馈" iconfont=" " @click="tofeedback"></use-list-title> -->
		<!-- #endif -->
		<view class="gap"></view>
		
		<use-list-title title="账号注销" iconfont=" " tip="清空账号所有信息" @goto="zhuxiao"></use-list-title>
		<view class="gap"></view>
		
		<use-list-title title="豆豆学" iconfont=" " tip="1.0.0"></use-list-title>
		<view class="gap"></view>
		
		<view class="use-item log-out-btn tac" @click="tologin">
			<text>切换账号</text>
		</view>
		<view class="gap"></view>
		
		<view class="use-item log-out-btn tac" @click="tologout">
			<text>退出登录</text>
		</view>

		<view class="gap"></view>
		<view class="gap"></view>
		<view class="gap"></view>
		<view class="gap"></view>
		<view class="gap"></view>
		<view class="gap"></view>
		<view class="gap"></view>
		<view class="gap"></view>
		<view class="gap"></view>
		<view class="footer">
			<view>
				<navigator url="/pages/user/privacy/service" style="color: blue;">《服务协议》</navigator>
			</view>
			<text>和</text>
			<view>
				<navigator url="/pages/user/privacy/privacy" style="color: blue;">《隐私政策》</navigator>
			</view>
            <!-- <button @click="goToPrivacyPolicy">隐私政策</button>
            <button @click="goToServiceAgreement">服务协议</button> -->
        </view>
	</view>
</template>

<script>
	import { mapState, mapMutations } from 'vuex';
	const _about = 'usemall-app-about'
	export default {
		data() {
			return {
				version: '1.0.0',
				aboutData: {}
			};
		},
		onLoad(options) {
			this.$db[_about].tofirst().then(res=>{
				if(res.code === 200){
					this.aboutData = res.datas;
					// console.log('this.aboutData', this.aboutData);
					return
				}
			})
		},
		onShow() {
			this.version = '版本 ' + this.$config.version;
		},
		computed: {
			...mapState(['member'])
		},
		methods: {
			...mapMutations(['logout']),
			// 个人资料
			to() {
				uni.navigateTo({
					url:'/pages/user/setting/personal'
				})
			},
			// 关于豆豆学
			toabout() {
				// if (this.aboutData.type == '网页') {
				// 	uni.navigateTo({
				// 		url: `/pages/content/web?url=${this.aboutData.url}`
				// 	});
				// } else if (this.aboutData.type == '内容') {
				// 	uni.setStorage({
				// 		key: '__rich_text',
				// 		data: this.aboutData.content,
				// 		success() {
				// 			uni.navigateTo({
				// 				url: '/pages/content/rich-text'
				// 			})	
				// 		}
				// 	})
				// } 
			},
			zhuxiao() {
				let _this = this;
				uni.showModal({
					title: '提示',
					content: '确认注销账号',
					success: function (res) {
						if (res.confirm) {
							_this.$func.usemall.call('member/deleteUser', '', true).then(res => {
								console.log('member/deleteUser', res, res.code);
								if (res.code == 200) {
									console.log('member/deleteUser success', res, res.code);
									_this.$api.msg('注销成功');
									_this.logout();
									_this.$api.timerout(() => {
										_this.$api.tohome();
									}, 200);
								}
							});
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			},
			tofeedback(){
				// this.$api.msg('打开右上角-反馈功能');
			},
			// 切换账号
			tologin(){
				this.$api.tologin();
			},
			// 退出登录
			tologout() {
				uni.showModal({
					content: '退出登录',
					success: (e) => {
						if (e.confirm) {
							this.$api.msg('退出成功');
							this.logout();
							
							this.$api.timerout(() => {
								this.$api.tohome();
							}, 200);
						}
					}
				});
			}
		}
	}
</script>

<style lang='scss'>
	page {
		background: $page-color-base;
	}

	.use-item {
		height: 100rpx;
		line-height: 100rpx;
		position: relative;
		background: #fff;
		
		switch {
			transform: translateX(16rpx) scale(.84);
		}
		
		button {
			line-height: 100rpx;
			background: #fff;
			font-size: 15px;
		}
	}

	.footer {
		display: flex;
		justify-content: center;
		padding: 10px;
		background-color: #f5f5f5;
		// border-top: 1px solid #ccc;
	}
</style>
