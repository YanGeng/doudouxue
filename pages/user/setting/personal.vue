<template>
	<view class="container">
		<view class="dflex-c pos-r margin-bottom margin-top">
			<view class="portrait-box">
				<image class="border-radius-c" :src="member.member_headimg || '/static/images/user/default4.webp'">
				</image>
			</view>
			<view class="margin-left-sm">
				<view>
					<text class="username">{{ member.member_name || '严选' }}</text>
				</view>
				<view v-if="member.member_city"><text>{{ member.member_city }}</text></view>
			</view>
		</view>
		
		<!-- <use-list-title title="昵称" iconfont="" :tip="member.member_name || member.member_nickname" @goto=""></use-list-title> -->
		<view class="use-item padding-lr-xl dflex-b">
			<text class="tac">昵称</text>
			<input type="text" v-model="member.member_nickname" placeholder="你的昵称"/>
			<!-- <input>{{ member.member_name || member.member_nickname }}</input> -->
		</view>
		<view class="use-item padding-lr-xl dflex-b">
			<text class="tac">昵称</text>
			<text>{{ member.member_name || member.member_nickname }}</text>
		</view>
		<view class="gap"></view>
		<view class="use-item padding-lr-xl dflex-b">
			<text class="tac">性别</text>
			<text>{{ (member.member_gender == 0 ? '未知' : member.member_gender == 1 ? '男' : '女') || '未知' }}</text>
		</view>
	</view>
</template>

<script>
	import { mapState } from 'vuex';
	export default {
		computed: {
			...mapState(['islogin', 'member'])
		},
		data() {
			return {
			};
		},
		onShow() {
			if (!this.islogin) {
				this.$api.msg('账号未登录');
				return;
			}
		},
		methods:{
			
		}
	}
</script>

<style lang='scss'>
	page {
		background: $page-color-base;
	}

	input {
        font-size: 14px;
		text-align: right;
    }

	image {
		width: 130rpx;
		height: 130rpx;
	}

	.use-item {
		height: 100rpx;
		line-height: 100rpx;
		position: relative;
		background: #fff;
	}
</style>
