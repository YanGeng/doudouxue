<template>
	<view class="container-area padding-lr-sm padding-bottom-sm">
		<use-empty v-if="!islogin" e-style="round" e-type="unauthorized" tip="当前未授权" btn-tip="去登录" height="28vh"
			:auto="false" @goto="tologin"></use-empty>
		<uni-list v-if="islogin">
			<uni-list-item title="会话列表" @click="toPath('/pages/tabbar/index')" :link="true"
				:show-badge="unreadMsgCount>0" :badge-text="unreadMsgCount+''"
				:badge-style="{'background':'#f41500'}"></uni-list-item>
			<uni-list-item v-if="user_role == 'admin'" title="用户列表" @click="toPath('/uni_modules/uni-im/pages/userList/userList')"
				:link="true"></uni-list-item>
			<uni-list-item title="通讯录" @click="toPath('/uni_modules/uni-im/pages/contacts/contacts')" :link="true"
				:show-badge="notificationUnreadCount>0" :badge-text="notificationUnreadCount+''"
				:badge-style="{'background':'#f41500'}"></uni-list-item>
			<!-- <uni-list-item
				title="个人中心" @click="toPath('/uni_modules/uni-id-pages/pages/userinfo/userinfo?showLoginManage=true')" :link="true"
			></uni-list-item> -->
		</uni-list>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations,
		mapGetters
	} from 'vuex';
	import uniIm from '@/uni_modules/uni-im/sdk/index.js';
	export default {
		computed: {
			...mapGetters(['islogin', 'user_role', 'token', 'isPreLoginSucess']),
			unreadMsgCount() {
				return uniIm.conversation.unreadCount()
			},
			notificationUnreadCount() {
				return uniIm.notification.unreadCount()
			}
		},
		data() {
			return {
				isAdmin: false,
				isStudent: true,
				isTeacher: false
			}
		},
		watch: {
			user_role(e) {
				console.log('user_role changed: ', this.user_role)
				this.isStudent = this.user_role == 'member' || this.user_role == '学生' || this.user_role == 'student';
				this.isTeacher = this.user_role == 'teacher';
				this.isAdmin = this.user_role == 'admin';
				if (!this.isTeacher && !this.isAdmin) {
					this.isStudent = true;
				}
			}
		},
		onShow() {
			console.log("islogin", this.islogin, this.isStudent, this.isTeacher, this.isAdmin);
		},
		async onReady() {},
		methods: {
			// 跳转登录页
			tologin() {
				// #ifdef APP-PLUS
				if (!this.isPreLoginSucess) {
					// 一键登录预登陆，可以显著提高登录速度
					uni.preLogin({
						provider: 'univerify',
						success: (res) => {
							// 成功
							// this.setUniverifyErrorMsg();
							this.setPreLoginStatus(true);
							console.log("preLogin success: ", res);
						},
						fail: (res) => {
							this.setPreLoginStatus(false);
							// this.setUniverifyErrorMsg(res.errMsg);
							// 失败
							console.log("preLogin fail res: ", res);
						}
					})
				}
				// #endif

				this.$api.tologin();
			},
			//未读系统通知数量
			toPath(path) {
				uni.navigateTo({
					url: path,
					fail: () => {
						uni.switchTab({
							url: path,
							fail: (e) => {
								console.error(e);
							}
						})
					}
				});
			}
		}
	}
</script>

<style>
</style>