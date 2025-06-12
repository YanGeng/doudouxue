<template>
	<view class="container bg-drak" :class="{ 'margin-bottom-big': !empty }">
		<!-- 00. 未授权登录 -->
		<use-empty v-if="!islogin" e-style="round" e-type="unauthorized" tip="当前未授权" btn-tip="去登录" height="28vh"
			:auto="false" @goto="tologin"></use-empty>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations,
		mapGetters
	} from 'vuex';
	
	export default {
		computed: {
			...mapGetters(['islogin', 'user_role', 'token', 'isPreLoginSucess'])
		},
		methods: {
			...mapMutations(['setPreLoginStatus']),
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
		}
	}
</script>

<style>
</style>