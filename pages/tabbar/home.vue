<template>
	<view class="box-sizing-b w-full">
		<!-- 01. 头部组件 -->
		<use-header :search-tip="searchTip" :search-auto="searchAuto" :current-city="current_city" @search="search"></use-header>

		<!-- 02. 轮播区 -->
		<view class="swiper-area pos-r" v-if="swiperDatas && swiperDatas.length > 0">
			<!-- 轮播组件 -->
			<swiper class="swiper w-full" autoplay indicator-dots indicator-color="#f7f7f7" indicator-active-color="#ff6a6c">
				<swiper-item class="swiper-item padding-lr wh-full box-sizing-b" v-for="(item, index) in swiperDatas" :key="index">
					<view class="wh-full" @click.stop="topage(item)">
						<image class="border-radius wh-full" mode="aspectFill" :lazy-load="true" :src="item.img" />
					</view>
				</swiper-item>
			</swiper>
		</view>

		<!-- 03. 分类区 -->
		<view class="category-area dflex dflex-wrap-w" v-if="categoryDatas && categoryDatas.length > 0">
			<view class="category-item dflex dflex-flow-c margin-bottom-sm" v-for="(item, index) in categoryDatas"
				:key="index" @click="topage(item)">
				<image class="margin-bottom-xs" lazy-load :src="item.img"></image>
				<text class="tac clamp">{{ item.name }}</text>
			</view>
		</view>
		<view class="gap"></view>
		
		<!-- <uni-section title="文字滚动" subTitle="使用 scrollable 属性使通告滚动,此时 single 属性将失效,始终单行显示" type="line"> -->
			<!-- <uni-notice-bar scrollable showIcon
				:text="currentNotice" /> -->
		<!-- </uni-section> -->
		<view class="dflex margin-lr">
			<uni-icons class="notice_left" type="sound" size="22" />
			<xzw-notice :list="currentNotice" direction="row" speed="slow" :showIcon="false" @goMore="goMore"></xzw-notice>
			<!-- <xzw-notice :list="currentNotice" :showIcon="true" direction="row" speed="slow" theme="defult" @goMore="goMore"/> -->
		</view>
		<view class="gap"></view>

		<!-- 04. 限时精选 -->
		<use-list-title title="精选自习室" size="32" fwt="600" color="#333" iconfont="icondaishouhuo-" @goto="limit">
		</use-list-title>
		<view class="limit-area">
			<scroll-view class="padding-lr" scroll-x>
				<view class="dflex padding-bottom">
					<view class="item margin-right-sm" v-for="(item, index) in goodsLimitDatas" :key="index"
						@click="togoods(item)">
						<image class="border-radius" mode="aspectFill" :lazy-load="true" :src="item.img"></image>
						<text class="title clamp padding-bottom-xs">{{ item.name }}</text>
						<!-- <text class="price">{{ item.price / 100 }}</text><text class="m-price">{{ item.market_price / 100 }}</text> -->
					</view>
				</view>
			</scroll-view>
		</view>
		<view class="gap"></view>

		<!-- 05. 热门推荐 -->
		<use-hot-goods :datas="goodsHotDatas" autoload="none" title="为您推荐"></use-hot-goods>
		<!-- 上拉加载更多 -->
		<use-loadmore :type="loadmoreType"></use-loadmore>

		<!-- 置顶 -->
		<use-totop ref="usetop" :style="{ marginBottom: navHeight + 'px' }"></use-totop>

		<!-- #ifdef MP-WEIXIN -->
		<official-account @bindload="wxOAccountLoad" @binderror="wxOAccountErr"></official-account>
		<!-- #endif -->
		
		<!-- <tabBar selectedIndex = 0></tabBar> -->
	</view>
</template>

<script>
	import { mapState } from 'vuex';

	export default {
		computed: {
			...mapState(['islogin', 'member', 'user_role', 'current_city', 'token']),
			currentNotice() {
				let noticeTmp = [];
				this.latestItems.forEach((row) => {
					if(row.consignee != ''){
						let newRow = {
							title: '恭喜“' + row.consignee + '”成功发布需求！'
						}
						noticeTmp.push(newRow);
					}
				});
				console.log('notice is xxxx: ', noticeTmp);
			    return noticeTmp;
			}
		},
		data() {
			return {
				empty: false,
				// 头部参数
				searchAuto: !0,
				searchTip: '请输入搜索关键字',

				// 轮播区
				swiperDatas: [],
				// 金刚区分类
				categoryDatas: [],
				// 限时精选
				goodsLimitDatas: [],
				// 热门推荐
				goodsHotDatas: [],

				scrollTop: 0,
				navHeight: 0,
				// 加载更多状态
				loadmoreType: 'more',
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
				latestItems: [{ id: 1, title: '公告1' }, { id: 2, title: '公告2' }],
			};
		},
		// beforeCreate() {
		//     console.log('组件初始化,未完全创建阶段 this:', this);
		//   },
		//   created() {
		//     console.log('组件创建后，但还未挂载');
		//     // this.init();
		//   },
		//   beforeMount() {
		//     console.log('渲染后待挂载');
		//     // this.init();
		//   },
		//   mounted: function () {
		//     console.log('组件挂载到页面OK,可用 vm.$el 访问');
		//     // this.init();
		//   },
		//   updated() {
		//     console.log('再次渲染后');
		//   },
		//   activated() {
		//     console.log('当前组件被激活：显示');
		//   },
		//   deactivated() {
		//     console.log('当前组件隐藏');
		//   },
		//   beforeDestroy() {
		//     console.log('销毁前');
		//   },
		//   destroy() {
		//     console.log('销毁后');
		//   },
		//   attached() {
		//     console.log('attached');
		//   },
		watch: {
			user_role(e) {
				if (e === 'teacher') {
					this.reqdata.requestType = 2;
				} else {
					this.reqdata.requestType = 1;
				}
			},
			current_city(e) {
				this.reqdata.currentCity = e;
				console.log('current_city', this.reqdata)
				this.loadData("refresh");
			},
			token(newVal, oldVal) {
				this.loadData("refresh");
			}
		},
		// 监听页面加载
		onLoad() {
			console.log("is login: " + this.islogin)
			console.log("user_role: " + this.user_role)
			console.log("current_city: " + this.current_city)
			if (this.user_role === 'teacher') {
				this.reqdata.requestType = 2;
			} else {
				this.reqdata.requestType = 1;
			}
			
			this.getLastedItems();
			this.loadData("refresh");
			this.getLastedItems();
			// 设置不同登录状态，不同tabbar的方法
			// if (this.islogin) {
			// 	uni.setTabBarItem({
			// 		index: 2,
			// 		"pagePath": "/pages/tabbar/cart",
			// 		"iconPath": "/static/images/tabbar/cart.png",
			// 		"selectedIconPath": "/static/images/tabbar/cart-active.png",
			// 		"text": "购物车"
			// 	})
			// } else {
			// 	uni.setTabBarItem({
			// 		index: 2,
			// 		"pagePath": "/pages/tabbar/shopping",
			// 		"iconPath": "/static/images/tabbar/shopping.png",
			// 		"selectedIconPath": "/static/images/tabbar/shopping-active.png",
			// 		"text": "购物圈"
			// 	})
			// }
		},
		onPageScroll(e) {
			// this.scrollTop = e.scrollTop
			this.$refs.usetop.change(e.scrollTop);
		},
		// 监听页面显示。页面每次出现在屏幕上都触发，包括从下级页面点返回露出当前页面
		onShow() {
			console.log("is login: ", this.reqdata)
			console.log("is login: ", this.user_role)
			// show时不刷新信息
			// this.getLastedItems();
		},
		//加载更多
		onReachBottom() {
			console.log("onReachBottom");
			this.loadMoreData();
		},
		// 监听用户下拉刷新
		onPullDownRefresh() {
			this.loadData("refresh", () => {
				uni.stopPullDownRefresh();
			});
		},
		// 用户点击右上角分享
		// https://uniapp.dcloud.io/api/plugins/share?id=showsharemenu
		onShareAppMessage: function(ops) {
			let _this = this,
				mid = 0;

			if (_this.member && _this.member._id) {
				mid = _this.member._id;
			}

			return {
				title: '豆豆学',
				path: `/pages/tabbar/home?mid=${mid}`,
				// imageUrl: 'https://mall-os-api.use-cloud.com/files/upload/image/20200408/200408115587860242.jpg',
				success: function(res) {
					// 转发成功
					console.log('转发成功', res);
				},
				fail: function(res) {
					// 转发失败
					console.log('转发失败', res);
				}
			};
		},


		methods: {
			// 获取最新常见需求的人
			async getLastedItems() {
				let redata = {
					sidx: 'last_modify_time',
					sord: 'desc',
					page: 1,
					rows: 100,
				};
				this.$func.usemall.call('goods/list', redata).then(res => {
					if (res.code === 200) {
						if (res.datas && res.datas.goods.length > 0) {
							this.latestItems = res.datas.goods;
						}
					}
				});
			},
			goMore() {
				if (!this.islogin) {
					this.$api.tologin()
					return;
				}
				
				if (this.user_role == 'member' || this.user_role == '学生' || this.user_role == 'student') {
					uni.navigateTo({
						url: `/pages/order/createFindTeacher?type=add`,
						success(res) {
							console.log(res);
						},
						fail(err) {
							console.log(err);
						}
					})
				} else if (this.user_role == 'teacher') {
					uni.navigateTo({
						url: `/pages/order/createFindStudent?type=add`,
						success(res) {
							console.log(res);
						},
						fail(err) {
							console.log(err);
						}
					})
				} else {
					uni.navigateTo({
						url: `/pages/order/createFindStudent?type=add`,
						success(res) {
							console.log(res);
						},
						fail(err) {
							console.log(err);
						}
					})
				}
			},
			// 增量调用加载商品
			async loadMoreData(type = 'add') {
				if (this.loadmoreType === 'loading') {
					// 防止重复加载
					return;
				}
				
				if (type == 'refresh') {
					// 从首页开始加载
					this.reqdata.page = 1;
					this.reqdata.otherCity = false;
				}
				
				// 没有更多直接返回 
				if (type === 'add') {
					if (this.loadmoreType === 'nomore') {
						return;
					}
					// 加载中
					this.loadmoreType = 'loading';
				} else {
					// 更多
					this.loadmoreType = 'more'
				}
				console.log("goodsHotDatas 3333", this.reqdata);
				
				this.$func.usemall.call('goods/list', this.reqdata).then(res => {
					if (res.code === 200) {
						if (res.datas && res.datas.goods.length > 0) {
							if (type == 'refresh') {
								this.goodsHotDatas = [];
							}
							let _datas = [];
							res.datas.goods.forEach((row) => {
								if(row.state === '销售中'){
									_datas.push(row);
								}
							});
							// res.datas.goods.forEach((row) => {
							// 	if(res.res.datas.goods.state === '销售中')
							// });
							this.goodsHotDatas = [...this.goodsHotDatas, ..._datas];
				
							if (res.datas.goods.length >= this.reqdata.rows) {
								this.reqdata.page++;
								this.loadmoreType = 'more';
							} else {
								// otherCity == true, 说明已经查询过非当前城市数据
								if (this.reqdata.otherCity) {
									this.loadmoreType = 'nomore';
								} else {
									// otherCity == false, 说明当前城市没有数据，但其他城市可能还有
									this.reqdata.otherCity = true;
									this.reqdata.page = 1;
									this.loadmoreType = 'more';
								}
							}
						} else {
							// otherCity == true, 说明已经查询过非当前城市数据
							if (this.reqdata.otherCity) {
								this.loadmoreType = 'nomore';
							} else {
								// otherCity == false, 说明当前城市没有数据，但其他城市可能还有
								this.reqdata.otherCity = true;
								this.reqdata.page = 1;
								this.loadmoreType = 'more';
							}
						}
					}
				
					if (this.goodsHotDatas.length === 0) {
						this.empty = true;
					}
				
					if (type == 'refresh') {
						uni.stopPullDownRefresh();
					}
				})
			},
			// 加载数据
			async loadData(type = 'add', callback) {
				if (this.loadmoreType === 'loading') {
					if (typeof callback === 'function') {
						// 数据加载完成回调函数
						callback();
					}
					// 防止重复加载
					return;
				}
								
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
				
				this.reqdata.currentCity = this.current_city;
				console.log("goodsHotDatas 0000", this.reqdata);

				await this.$func.usemall.call('app/mp/home', this.reqdata).then(res => {
					if (res.code === 200) {
						// 轮播图
						this.swiperDatas = res.datas.carousel || [];
						// 分类导航
						this.categoryDatas = res.datas.category || [];
						console.log('this.categoryDatas length is: ');
						console.log(this.categoryDatas.length);
						// 限时精选
						this.goodsLimitDatas = res.datas.limited || [];
						// 热门推荐
						this.goodsHotDatas = res.datas.hot || [];
						console.log("goodsHotDatas", res.datas);
						if (this.goodsHotDatas.length >= this.reqdata.rows) {
							this.reqdata.page++;
							this.loadmoreType = 'more';
							console.log("goodsHotDatas 1111", this.reqdata);
						} else {
							// this.loadmoreType = 'nomore';
							this.reqdata.otherCity = true;
							this.reqdata.page = 1
							console.log("goodsHotDatas 2222", this.reqdata);
							this.loadMoreData("add");
						}
					}
				});
				
				if (typeof callback === 'function') {
					// 数据加载完成回调函数
					callback();
				}
			},
			// 搜索回调函数
			search() {
				console.log('home search');
			},
			// 跳转页面
			topage(item) {
				console.log('分类点击', item);
				if (item && item.type == '网页') {
					uni.navigateTo({
						url: `/pages/content/web?url=${item.url}`
					});
				} else if (item && item.type == '页面') {
					uni.navigateTo({
						url: `${item.url}`
					});
				} else {
					if (item.id) this.$api.togoods({
						id: item._id
					});
				}
			},
			// 限时精选 -> 商品详情
			togoods(item) {
				// 跳转商品详情
				this.$api.togoods({
					id: item._id
				});
			},
			// 限时精选
			limit() {
				// 跳转商品列表 - 限时精选类目
				this.$api.togoodslist({
					requestType: 0
					// limited: 1
				});
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

	/* 轮播图区 */
	.swiper-area {
		.swiper {
			height: 240rpx;
		}
	}

	/* 分类区 */
	.category-area {
		padding: 60rpx 0 30rpx 0;

		.category-item {
			font-size: $font-sm + 2upx;
			color: $font-color-dark;
			width: 25%;
		}

		image {
			width: 96rpx;
			height: 96rpx;
		}
	}

	/* 限时精选区 */
	.limit-area {
		min-height: 240rpx;

		.item {
			width: 240rpx;

			image {
				width: 240rpx;
				height: 240rpx;
			}
		}
	}

</style>
