<template>
	<view class="wh-full">
		<!-- 头部组件 -->
		<!-- <use-header :fixed="headerFixed" :placeholder="headerPlaceholder" :search-tip="searchTip" :search-auto="searchAuto"></use-header> -->
		<view class="use-header dflex w-full bg-main fixed">
		            <scroll-view class="scroll">
		                <view class="scroll-item" 
		                v-for="(item,index) in scrollTitle" 
		                :key="index" 
		                @tap="handleSelected(index)" 
		                :class="{on: item.value === findType}">
		                    <view class="container">
		                        {{item.title}}
		                    </view>
		                </view>
		            </scroll-view>
		        </view>

		<!-- 分类 -->
		<view class="category dflex-s h-full padding-top-big">
			<!-- 左侧一级分类 -->
			<view class="h-full left">
				<scroll-view scroll-y class="h-full">
					<view v-for="item in fdatas" :key="item._id" class="item dflex-c"
						:class="{ active: item._id === cid || item.cid === cid}" @click="fSelect(item)">{{ item.name }}</view>
				</scroll-view>
			</view>

			<!-- 右侧 1二级分类 2商品列表 -->
			<scroll-view class="h-full right bg-main" scroll-with-animation scroll-y :scroll-top="top"
				:style="{ height: scrollHeight }" @scroll="onScroll" @scrolltolower="onScrolltolower" refresher-enabled="true" @refresherrefresh="onRefresherRefresh" :refresher-triggered="isRefreshing">
				<!-- 右侧二级分类 -->
				<view class="dflex-s dflex-wrap-w" v-if="mode == 1">
					<view class="item padding-bottom-sm dflex dflex-flow-c" v-if="item.pid == cid"
						v-for="item in sdatas" :key="item._id" @click="togoodslist(item)">
						<image :lazy-load="true" :src="item.img"></image>
						<text class="tac clamp margin-top-sm">{{ item.name }}</text>
					</view>
				</view>

				<!-- 右侧分类对应商品列表 -->
				<view v-if="mode == 2">
					<!-- 空白页 -->
					<use-empty v-if="empty" e-style="round" tip="无商品数据" height="90vh"></use-empty>

					<view v-else class="padding-lr-sm" v-for="(item, index) in goodsDatas" :key="index"
						@click="togoods(item)">
						<view class="goods padding-top-lg padding-lr-sm bg-main">
							<view class="goods-left">
								<image class="border-radius-xs wh-full" mode="aspectFill" :lazy-load="true" :src="item.img"></image>
							</view>
							<view class="margin-left-sm pos-r w-full">
								<text class="clamp-2">{{ item.name }} {{ item.description }}</text>
								<view class="dflex-b price-box padding-top-sm w-full">
									<text v-if="!(item.cid === 10001)" class="price_sm">{{ item.price / 100 }}</text>
									<text class="consignee">{{ item.school || item.area_name }}</text>
								</view>
							</view>
						</view>
					</view>

					<!-- 上拉加载更多 -->
					<use-loadmore v-if="!empty" :type="loadmoreType"></use-loadmore>
					<!-- 置顶 -->
					<use-totop ref="usetop" bottom="150" :style="{ marginBottom: navHeight + 'px' }" @to="totop"></use-totop>
				</view>
			</scroll-view>
		</view>

		<!-- 切换模式 1二级分类 2商品列表 -->
		<view class="fixed-top" :style="{ marginBottom: navHeight + 'px' }" @click="changeMode">
			<text class="iconfont iconpailie" v-if="findType == 1"></text>
			<text class="iconfont iconpailie02" v-if="findType == 2"></text>
		</view>
	</view>
</template>

<script>
	const _goods = 'usemall-goods'
	const _goodscategory = 'usemall-goods-category'
	import { mapState } from 'vuex';
	export default {
		computed: {
			...mapState(['islogin', 'member', 'user_role', 'current_city'])
		},
		data() {
			return {
				items: ['选项1', '选项2', '选项3'],
				// 1分类列表 2商品列表
				mode: 2,
				// 兼容支付宝 height 显示 bug
				scrollHeight: '100%',

				// 头部参数
				headerPlaceholder: 0,
				headerFixed: !0,
				searchAuto: !0,
				searchTip: '请输入搜索关键字',

				// findWho: 1,
				// 当前选中分类ID
				cid: 0,
				// 一级数据
				fdatas: [],
				// 二级数据
				sdatas: [],

				// 商品列表
				goodsDatas: [],
				empty: false,
				hasmore: 0,
				loadmoreType: 'more',
				// 商品请求数据
				reqdata: {
					rows: 20,
					page: 1
				},

				top: 0,
				scrollTop: 0,
				navHeight: 0,
				scrollTitle: [
					{
				        title: '找老师',
				        value: 1,
				    },
				    {
				        title: '找学生',
				        value: 2,
				    }
				],
				// requestType: '学生',
				// 请求数据
				reqdata: {
					page: 1,
					rows: 8,
					sidx: 'last_modify_time',
					sord: 'desc',
					requestType: 1,
					currentCity: '',
					otherCity: false
				},
				findType: 1,
				isRefreshing: false,
			};
		},
		activated() {
		  console.log('当前组件被激活：显示');
		},
		deactivated() {
		  console.log('当前组件隐藏');
		},
		watch: {
			goodsDatas(e) {
				// 监听数据，呈现空白页
				let empty = e.length === 0;
				if (this.empty !== empty) {
					this.empty = empty;
				}
			},
			current_city(e) {
				this.loadGoodsDatas('refresh');
			}
		},
		onPageScroll(e) {
			//this.scrollTop = e.scrollTop;
			this.$refs.usetop.change(e.scrollTop);
		},
		onLoad() {
			// #ifdef MP-ALIPAY
			this.scrollHeight = (this.$env.windowHeight - this.$env.sis.titleBarHeight) + 'px';
			// #endif

			// 获取存储的模式
			// this.mode = uni.getStorageSync('category.mode') || 1;

			this.loadData(() => {
				if (this.mode == 2) {
					// 加载商品数据
					this.loadGoodsDatas('refresh')
				}
			});
		},
		onShow() {
			console.log('current_city: ', this.current_city);
			// 获取存储的模式
			// this.mode = uni.getStorageSync('category.mode') || 1;
			
			// this.loadData(() => {
			// 	if (this.mode == 2) {
			// 		// 加载商品数据
			// 		this.loadGoodsDatas()
			// 	}
			// });
		},
		// 下拉刷新
		onPullDownRefresh() {
			// this.loadData(() => {
			// 	uni.stopPullDownRefresh();
			// });
		},
		onReachBottom() {
			console.log("reach bottom");
		},
		methods: {
			onRefresherRefresh() {
				if (this.mode == 2) {
					this.isRefreshing = true;
					// 加载商品数据
					this.loadGoodsDatas('refresh', () => {
						this.isRefreshing = false;
						uni.stopPullDownRefresh();
					})
				};
			},
			onScrolltolower() {
				if (this.mode == 2) {
					// 加载商品数据
					this.loadGoodsDatas()
				}
				console.log('hit the bottom');
			},
			handleSelected(index) {
			    // this.scrollTitle[index].selected = true
			    // for (let i = 0; i < this.scrollTitle.length; i++) {
			    //     if (i != index) {
			    //         this.scrollTitle[i].selected = false
			    //     }
			    // }
				console.log('index', index);
				if (index == 0) {
					// this.findWho = 1;
					this.findType = 1;
					// this.requestType = '学生';
				} else if (index == 1) {
					// this.findWho = 2;
					this.findType = 2;
					// this.requestType = '教师';
				}
				
				this.loadGoodsDatas('refresh');
				console.log("index is: ", index, this.findType);
			},
			async loadData(callback) {
				this.$db[_goodscategory].where({ state: '启用' }).tolist({rows:50,orderby:'sort asc'}).then(res => {
					if (res.code === 200) {
						// console.log("res: ", res);
						this.fdatas = [];
						this.sdatas = [];

						res.datas.forEach(item => {
							if (!item.pid) {
								// pid为父级id, 不存在 pid || pid=0 为一级分类
								this.fdatas.push(item);
							} else {
								// 二级分类
								this.sdatas.push(item);
							}
						});

						if (this.fdatas.length > 0) {
							this.cid = this.fdatas[1].cid || this.fdatas[1]._id;
						}
						
						if (typeof callback === 'function') {
							// 数据加载完成回调函数
							callback();
						}
					}
				})
			},
			// 加载商品数据
			loadGoodsDatas(type = 'add', callback) {
				if (this.mode != 2) {
					return;
				}
				
				if (this.loadmoreType === 'loading') {
					if (typeof callback === 'function') {
						// 数据加载完成回调函数
						callback();
					}
					// 防止重复加载
					return;
				}
							
				console.log('type', type, callback);
				if (type == 'refresh') {
					// 从首页开始加载
					this.reqdata.page = 1;
					this.reqdata.otherCity = false;
				}
				
				// 没有更多直接返回
				if (type === 'add') {
					if (this.loadmoreType === 'nomore') {
						if (typeof callback === 'function') {
							// 数据加载完成回调函数
							callback();
						}
						return;
					}
					// 加载中
					this.loadmoreType = 'loading';
				} else {
					// 更多
					this.loadmoreType = 'more'
				}
				
				// 根据当前 cid 加载商品数据列表
				let whereStr = '';
				if (this.cid.length > 5) {
					whereStr = `'${this.cid}' in cids`;
				} else {
					whereStr = `${this.cid} in cids`;
				}
				this.reqdata.cid = this.cid;
				if (this.cid === 10001) {
					this.reqdata.requestType = 0;
				} else {
					this.reqdata.requestType = this.findType;
				}
				
				this.reqdata.currentCity = this.current_city;
				console.log("this.reqdata: ", this.reqdata);
				// console.log("this.reqdata: ", this.reqdata);
				// this.$db[_goods]
				// 	.where(`state == "销售中"`)
				// 	.where(whereStr).tolist(this.reqdata).then(res => {
					this.$func.usemall.call('goods/list', this.reqdata).then(res => {
						if (res.code === 200) {
							if (type == 'refresh') {
								this.goodsDatas = [];
							}
							
							let newData = res.datas.goods;
							this.goodsDatas = [...this.goodsDatas, ...newData];
							console.log("this.goodsDatas 1: ", this.goodsDatas);
							if (res.datas.goods.length >= this.reqdata.rows) {
								// if (this.reqdata.page == 1) this.hasmore = !0;
								this.reqdata.page++;
								this.loadmoreType = 'more'
							} else {
								// otherCity == true, 说明已经查询过非当前城市数据
								if (this.reqdata.otherCity) {
									this.loadmoreType = 'nomore';
								} else {
									// otherCity == false, 说明当前城市没有数据，但其他城市可能还有
									this.reqdata.otherCity = true;
									this.reqdata.page = 1;
									this.loadmoreType = 'more';
									this.loadGoodsDatas();
									console.log("this.goodsDatas 2: ", this.goodsDatas);
								}
							}
							
							this.empty = this.goodsDatas.length === 0;
							if (typeof callback === 'function') {
								// 数据加载完成回调函数
								callback();
							}
						}
					})
			},
			totop(e) {
				this.top = e.scrollTop
				this.$nextTick(function() {
					this.top = 0
				});
			},
			// 一级分类
			fSelect(item) {
				this.cid = item.cid || item._id;
				console.log("this.cid: ", this.cid);
				// this.loadmoreType = 'more';
				// this.reqdata.page = 1;
				this.loadGoodsDatas('refresh');
			},
			// 切换模式 1分类模式 2商品模式
			changeMode() {
				// 注释模式代码
				// this.mode = this.mode == 1 ? 2 : 1;
				// uni.setStorage({
				// 	key: 'category.mode',
				// 	data: this.mode
				// })
				// 修改为更换 找学生 赵老师
				// this.findWho = this.findWho === 2 ? 1 : 2;
				this.findType = this.findType === 2 ? 1 : 2;

				this.loadGoodsDatas('refresh');
			},
			// 跳转商品详情
			togoods(item) {
				this.$api.togoods({
					id: item._id
				});
			},
			// 跳转商品列表
			togoodslist(item) {
				this.$api.togoodslist({
					cid: item._id
				});
			},
			onScroll() {
				// console.log("on scroll");
			},
		},
		mounted() {
			// #ifdef H5 || MP-360
			this.navHeight = 50;
			// #endif
		}
	};
</script>

<style lang="scss">
	page {
		height: 100%;
		background-color: $page-color-base;
	}
	
	.price_sm{font-size: 24rpx; color: #ff6a6c; line-height: 1; font-weight: 580;}
	.price_sm::before{ content: '￥'; font-size: 24rpx; }
	.price_sm::after{ content: attr(data-decimal); font-size: 24rpx; }

	.category {
		overflow: hidden;

		.left {
			width: 160rpx;
			background-color: $page-color-base;

			.item {
				height: 100rpx;
				color: $font-color-base;
				position: relative;

				&.active {
					color: $uni-color-primary;
					background: #fff;

					&:before {
						content: '';
						position: absolute;
						left: 0;
						top: 50%;
						transform: translateY(-50%);
						height: 36rpx;
						width: 8rpx;
						background-color: $uni-color-primary;
						opacity: 0.8;
					}
				}
			}
		}

		.right {
			flex: 1;
			overflow: hidden;
			display: block;

			.item {
				flex-shrink: 0;
				width: 33.33%;
				font-size: $font-sm + 2upx;
				color: #666;

				image {
					width: 130rpx;
					height: 130rpx;
				}
			}
		}
	}

	.goods {
		display: flex;
		align-items: center;

		.goods-left {
			image {
				width: 150rpx;
				height: 150rpx;
			}
		}

		.price-box {
			bottom: 0;
		}
	}
	
	.container {
		display: flex;
		  justify-content: center; /* 水平居中 */
		  align-items: center; /* 垂直居中 */
		  height: 100rpx; /* 容器高度 */
        // height: 100vh;
    }

    .scroll {
        background-color: #ffffff;
		height: 100rpx;
        border-bottom: 1upx solid #999999;
        white-space: nowrap;/*必须要有，规定段落中的文本不进行换行*/
    }

    .scroll-item {
        color: #333333;
        width: 50%;
        height: 100%;
        line-height: 60upx;
        display: inline-block;/*必须要有*/
    }

    .on {
        border-bottom: 1px solid orange;
        color: orange;
        // border-radius: 40upx;
        // font-size: 24px;
        font-weight: bolder;
    }
	
	.consignee {
		color: #878787;
		font-size: 28rpx;
	}
	
	.text_cs {
		color: #1f1f1f;
		font-size: 24rpx;
	}
</style>
