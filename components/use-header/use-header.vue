<template>
	<view>
		<view class="use-header dflex padding-lr w-full bg-main" :class="fixed ? 'fixed' : ''">
			<!-- 头部组件 -->
			<view class="address" @click="selectCity">
				<text>{{ currentCity }}</text> 
			<view class="local-iconfont iconjiantou padding-lr-xs" @click="selectCity"></view>
			</view>
			<view class="use-search dflex-b border-radius-lg padding-lr w-full" @click="search">
				<text>{{ searchTip }}</text>
				<view class="iconfont iconsousuo-01"></view>
			</view>
		</view>
		
		<!-- 头部组件占位符 -->
		<view v-if="fixed && placeholder" class="use-header-placeholder"></view>
	</view>
</template>

<script>
export default {
	props: {
		fixed: {
			type: [Number, Boolean],
			default: false
		},
		placeholder: {
			type: [Number, Boolean],
			default: !0
		},
		searchAuto: {
			type: [Number, Boolean],
			default: !0
		},
		searchTip: {
			type: String,
			default: '搜索关键字'
		},
		currentCity: {
			type: String,
			default: '上海市'
		}
	},
	data() {
		return {
		};
	},
	methods: {
		search() {
			this.$emit('search', {
				type: 'search'
			});

			if (this.searchAuto) {
				// 跳转搜索页
				uni.navigateTo({
					url: '/pages/home/search/search'
				})
			}
		},
		selectCity() {
			// console.log("selectCity");
			uni.navigateTo({
				url: '/pages/user/address/citys'
			})
			// console.log("selectCity 2");
		},
	}
};
</script>

<style lang="scss">
.use-header-placeholder {
	height: 100rpx;
}

.use-header {
	height: 100rpx;
}

.use-search {
	height: 70rpx;
	line-height: 70rpx;
	background-color: #f5f5f5;

	text {
		color: #c0c0c0;
	}

	.iconfont {
		font-size: $font-base + 6upx;
		color: #c0c0c0;
	}
}

.local-iconfont {
  font-family: 'iconfont';
  font-size: $font-base; /* 默认大小 */
}

.address {
	// width: 200rpx;
	display: flex; /* 启用 Flexbox 布局 */
	flex-direction: row; /* 子元素横向排列（默认值，其实可以省略） */
	/* 可选：如果你想让子元素之间有空隙，可以添加 justify-content 或 space-between 等 */
	justify-content: space-between; /* 子元素之间的空隙均匀分布 */
	text {
		// color: #ff0000;
		white-space: nowrap;
		font-size: 30rpx;
	}
}
</style>
