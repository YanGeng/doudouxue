<template>
	<!-- 热卖产品 -->
	<view class="use-hot-goods">
		<!-- 列表标题 -->
		<use-list-title v-if="hotDatas && hotDatas.length > 0" :title="title" size="32" fwt="600" :type="titleType" color="#333" iconfont="iconremen" @goto="hot"></use-list-title>
		
		<view class="list dflex-b dflex dflex-wrap-w w-full">
			<view v-for="(item, index) in hotDatas" :key="index" class="item border-radius-sm padding-bottom-sm" @click="to_detail(item)">
				<view class="image-wrapper border-radius"><image mode="aspectFill" :lazy-load="true" :src="item.img"></image></view>
				<text class="title clamp padding-sm">{{item.name }} {{ item.description.split('\n').slice(0,5).join('\n') }}</text>
				<view class="padding-lr-sm dflex-b">
					<text class="price_sm">{{ item.price / 100 }}</text>
					<text class="text_cs">{{ item.shoukeType ? item.shoukeType.join() : '' }}</text>
					<!-- <text class="m-price">{{ item.market_price / 100 }}</text> -->
				</view>
				<view class="padding-lr-sm padding-top-xs dflex-b">
					<text class="consignee">{{ item.consignee }}</text>
					<text class="consignee">{{ item.school || item.area_name }}</text>
				</view>
			</view>
		</view>
		
		<!-- <view v-for="(item,index) in hotDatas" :key="index" class="flexlist-item">
			<image @click="to_detail(item)" :src="item.img" mode="aspectFill" class="flexlist-img">
			</image>
			<view class="flex-1">
				<text @click="to_detail(item)" class="flexlist-title clamp-2">{{item.name}}</text>
				<view @click="to_detail(item)" class="flex mgb-5">
					<view class="cl2 f12 mgr-5">评价</view>
					<view class="cl-num f12 mgr-10">9.0</view>
					<view class="cl2 f12 mgr-5">订单</view>
					<view class="cl-num f12 mgr-10">23</view>
				</view>
				<text @click="to_detail(item)" class="flexlist-desc clamp-2">
					{{ item.description || item.name }}
				</text>
			</view>
		</view> -->
		
		<!-- <view class="dflex-s dflex-wrap-w">
			<view class="item padding-bottom-sm dflex dflex-flow-c"
				v-for="(item, index) in hotDatas" :key="index" @click="to_detail(item)">
				<image :lazy-load="true" :src="item.img"></image>
				<text class="tac clamp margin-top-sm">{{ item.name }}</text>
			</view>
		</view> -->
		
		<!-- 用云版权 -->
		<!-- <use-copyright></use-copyright> -->
	</view>
</template>

<script>
export default {
	props: {
		title: {
			type: String,
			default: '热卖产品'
		},
		titleType: {
			type: String,
			default: 'square'
		},
		autoload: {
			type: String,
			default: 'auto'
		},
		datas: {
			type: Array,
			default: () => []
		}
	},
	data() {
		return {
			hotDatas: []
		};
	},
	watch: {
		datas(){
			this.hotDatas = this.datas;
		}
	},
	created() {
		if(this.autoload === 'auto'){
			this.loadData();
		}
	},
	methods: {
		loadData() {
			this.$db['usemall-goods'].where('state == "销售中" && hot == 1').tolist({ rows: 8, orderby: 'sort asc' })
				.then(res=>{
					// console.log('usemall-goods',res);
					if(res.code === 200){
						this.hotDatas = res.datas || [];
					}
				})
		},
		goto() {
			console.log('goto');
			this.$emit('goto', {
				type: 'goto'
			});
		},
		hot() {
			this.$api.togoodslist({hot: 1});
		},
		to_detail(options) {
			this.$api.togoods({id: options._id});
		},
		subString(str) {
			return str.substr(0, 36) + "..."
		}
	}
};
</script>

<style lang="scss">
.use-hot-goods {
	background-color: #f3f4f6;
	
	.list{
		padding: 0 3vw 20rpx;
	}
	
	.item { 
		width: 46vw;
		overflow: hidden;
		margin-top: 2vw;
		background: #fff;

		&:nth-child(2n) {
			margin-left: 1vw;
		}
		&:nth-child(2n + 1) {
			margin-right: 1vw;
		}
	}
	
	.image-wrapper {
		width: 100%;
		// height: 100%;
		height: 300rpx;
		overflow: hidden;
	
		image {
			width: 100%;
			height: 100%;
			opacity: 1;
		}
	}
	
	.consignee {
		color: #878787;
		font-size: 24rpx;
	}
	
	.text_cs {
		color: #1f1f1f;
		font-size: 24rpx;
	}
	
	.price_sm{font-size: 24rpx; color: #ff6a6c; line-height: 1; font-weight: 580;}
	.price_sm::before{ content: '￥'; font-size: 24rpx; }
	.price_sm::after{ content: attr(data-decimal); font-size: 24rpx; }
}
</style>
