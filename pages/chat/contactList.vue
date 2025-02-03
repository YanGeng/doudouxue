<template>
	<view class="page">
		<view>
			<chat-webview :token="token" :touid="toUid"></chat-webview>
		</view>

		<!-- 严选版权 -->
		<use-copyright></use-copyright>
	</view>
</template>
<script>
	import { mapState } from 'vuex';
	export default {
		computed: {
			...mapState(['islogin', 'user_role', 'token'])
		},
		data() {
			return {
				url: '',
				webviewStyles: {
					progress: {
						color: "#00aa55"
					}
				},
				toUid: '6686df138a5c7863b1fb1c3d'
			}
		},
		onLoad(options) {
			console.log('gggggggggggggg', this.options, this.token);
			// 目标uid
			if (options.touid) {
				this.toUid = options.touid
			};
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