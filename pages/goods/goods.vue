<template>
	<view>
		<!-- 01. 轮播区 -->
		<view class="swiper-area w-full pos-f">
			<swiper class="h-full pos-r" autoplay indicator-dots circular="true" duration="400">
				<swiper-item v-for="(item, index) in swiperDatas" :key="index">
					<view class="wh-full">
						<image :src="item.url" class="wh-full loaded" lazy-load="true" mode="aspectFit"></image>
					</view>
				</swiper-item>
			</swiper>
		</view>

		<!-- 02. 商品数据区 -->
		<view class="goods-area bg-main padding">
			<view v-if="!isZixishi" class="price-box dflex-b">
				<view>
					<text class="price fwb fs-big">{{ goods.price / 100 || '' }}</text>
					<text class="m-price" v-if="goods.market_price > 0">{{ goods.market_price / 100 || '' }}</text>
				</view>
				<view class="dflex fs-sm">
					<!-- #ifdef MP-WEIXIN || H5 -->
					<view class="margin-right-sm dflex ft-dark" @click="shareOpen">
						<view class="iconfont iconfenxiang padding-right-xs"></view>
						<text>分享</text>
					</view>
					<!-- #endif -->
					<!-- #ifdef MP-ALIPAY || MP-BAIDU || MP-QQ || MP-TOUTIAO -->
					<button class="btn no-border padding-0 fs-sm ft-dark" open-type="share">
						<view class="margin-right-sm dflex">
							<view class="iconfont iconfenxiang padding-right-xs"></view>
							<text>分享</text>
						</view>
					</button>
					<!-- #endif -->
					<view class="margin-right-sm dflex">
						<view v-if="goods.deleteType == 'noneed' || goods.deleteType == 'finished'"
							class="padding-right-xs ft-dark">已结单</view>
						<view v-else class="padding-right-xs ft-base">接单中</view>
						<!-- <text>{{ goods.sale_cnt || '0' }}</text> -->
					</view>
					<!-- <view class="dflex">
						<view class="padding-right-xs padding-right-xs">库存</view>
						<text>{{ goods.stock_num || '0' }}</text>
					</view> -->
				</view>
			</view>
			<text class="title fs">{{ goods.name || '' }} {{ goods.name_pw || '' }}</text>
		</view>
		<view class="gap"></view>
		<!-- 分享 -->
		<!-- <uni-popup ref="popup" :mask-click="true">
			<text>Popup</text>
			<button @click="close">关闭</button>
		</uni-popup> -->
		<use-popup mode="bottom" bgclass=" " v-model="shareShow">
			<view class="share-area margin border-radius bg-main">
				<view class="tac w-full padding-sm">分享</view>
				<view class="padding-lr margin-bottom-xl dflex-b pos-r">
					<!-- #ifdef MP-WEIXIN -->
					<button class="dflex-c dflex-flow-c no-border btn" style="color: #07c160" open-type="share">
						<view class="iconfont iconweixin padding-lr-sm border-radius-c fs-xxxl"></view>
						<view class="dflex-c fs-sm ft-dark">微信好友</view>
					</button>
					<view class="vertical-line"></view>
					<!-- #endif -->
					<button class="dflex-c dflex-flow-c no-border btn ft-base" @click="createPoster">
						<view class="iconfont iconhaibao1 padding-lr-sm border-radius-c fs-xxxl"></view>
						<view class="dflex-c fs-sm ft-dark">生成海报</view>
					</button>
				</view>
			</view>
		</use-popup>

		<!-- 海报二维码 -->
		<!-- <view class="qrcode tac padding-tb pos-f pos-tl-c">
			<use-qrcode :onval="true" :val="posterQRcode" :show="false" loading-text="生成海报中" qrsize="200" @result="posterQRcodeResult"></use-qrcode>
		</view> -->

		<!-- 海报 -->
		<view class="poster pos-f pos-tl-c padding">
			<!-- <poster ref="poster" :list="list" background-color="#FFF" :width="750" :height="1334"
			            @on-success="posterSuccess" @on-error="posterError"></poster> -->
			<l-painter isCanvasToTempFilePath pathType="url" @success="posterSuccess" hidden :board="list" />
			<!-- <l-painter custom-style="position: fixed;z-index: -1;top: -200vh;left: -100vw;" :board="list" isRenderImage @success="posterSuccess" /> -->
		</view>
		<uni-popup ref="popuphaibao" :mask-click="true">
			<!-- <use-popup mode="bottom" bgclass=" " v-model="posterShow" @close=""> -->
			<view class="padding border-radius margin">
				<view v-if="!posterUrl" class="tac bg-main padding border-radius pos-a pos-l-c" style="bottom: 45vh">
					海报生成中，请稍等</view>
				<view class="w-full" style="height: 70vh">
					<image :src="posterUrl" class="wh-full" mode="aspectFit"></image>
				</view>

				<view class="padding w-full margin-top">
					<view class="dflex-b border-radius-big">
						<!-- #ifdef MP -->
						<view class="tac padding-tb-sm flex1 bg-base" @click="posterSave">保存到相册</view>
						<!-- #endif -->
						<!-- #ifdef H5 || MP-360 -->
						<view class="tac padding-tb-sm flex1 bg-base">长按图片保存到相册</view>
						<!-- #endif -->
					</view>
				</view>
			</view>
			<!-- </use-popup> -->
		</uni-popup>

		<!-- 03. 规格区 -->
		<view v-if="skuDatas.length > 0" class="sku-area bg-main padding-lr padding-top padding-bottom-xs pos-r">
			<view class="con dflex dflex-wrap-w">
				<view class="margin-right-sm margin-bottom-sm dflex bg-drak border-radius-lg padding-tb-16 padding-lr"
					:class="{ active: item.selected }" v-for="(item, index) in skuDatas" :key="index"
					@click="selectSKU(item)">
					<text class="fs-xs">{{ item.name }}</text>
				</view>
			</view>
		</view>
		<view v-if="skuDatas.length > 0" class="gap"></view>

		<!-- 04.01 优惠券 -->
		<!-- <use-list-title title="优惠" tip="领取优惠券" color="#ff6a6c" iconfont="iconyouhui" @goto="couponShow = true"></use-list-title> -->
		<!-- 04.01 优惠券弹出层 -->
		<!-- <use-popup mode="bottom" v-model="couponShow" @open="couponOpen"> -->
		<!-- 优惠券区 -->
		<!-- <scroll-view v-if="couponDatas && couponDatas.length">
				<view class="coupon-area padding bg-drak">
					<view class="coupon-item bg-main pos-r fs-xs" v-for="(item, index) in couponDatas" :key="index">
						<view class="content pos-r padding dflex-b">
							<view class="">
								<view class="margin-bottom-xs fs">{{ item.name }}</view>
								<view class="ft-dark">有效期至 {{ item.end_time.split(' ')[0] }}</view>
							</view>
							<view class="tar">
								<view class="margin-bottom-xs price">{{ item.price }}</view>
								<view v-if="item.order_amount > 0" class="ft-dark">满{{ item.order_amount }}可用</view>
								<view v-else class="ft-dark">不限</view>
							</view>
			
							<view class="circle l"></view>
							<view class="circle r"></view>
						</view>
						<view class="dflex-b">
							<text class="ft-dark padding-lr">{{ item.type }}</text>
							<text class="ft-base padding-tb-sm padding-lr" @click="couponReceive(item.id)">立即领取</text>
						</view>
					</view>
				</view>
			</scroll-view>
			
			<view class="coupon-area dflex-c">此功能未实现</view>
		</use-popup> -->

		<!-- 04.02 服务标签 -->
		<view class="bg-main padding-lr padding-top padding-bottom-xs pos-r" @click="tagShow = true">
			<view class="dflex dflex-wrap-w">
				<view v-for="(item, index) in tagDatas" :key="index" class="margin-right-sm margin-bottom-sm dflex">
					<view class="iconfont iconyiwancheng- fwb fs-xs ft-base margin-right-xs"></view>
					<text class="fs-xs">{{ item.name }}</text>
				</view>
			</view>
			<!-- <view class="icon-detail pos-a"><view class="iconfont iconxiangqing ft-dark fs-sm"></view></view> -->
		</view>
		<view class="gap"></view>
		<!-- 04.02 服务标签弹出层 -->
		<uni-popup ref="popupganxiefei" mode="bottom" v-model="tagShow">
			<view class="popup-content margin">
				<view class="tac w-full padding-sm">老师分享单</view>
				<view class="padding-lr padding-bottom-sm">
					<view class="fs-xs">平台老师分享出来的订单，老师可能会向您收取合理的感谢费，若存在不合理费用，可联系平台管理员！</view>
					<!-- <view v-for="(item, index) in tagDatas" :key="index"
						class="margin-right-sm margin-bottom-sm dflex dflex-s">
						<view class="iconfont iconyiwancheng- fwb fs ft-base margin-right-xs"></view>
						<view>
							<view class="fs-sm">{{ item.name }}</view>
							<view class="fs-xs">服务标签对应的描述</view>
						</view>
					</view> -->
				</view>
			</view>
		</uni-popup>

		<view v-if="goods.thanksMoney > 0">
		<view class="bg-main padding-lr padding-top padding-bottom-xs pos-r" @click="opene1">
			<!-- <view class="dflex dflex-wrap-w"> -->
				<view class="margin-right-xl margin-bottom-sm flex-col">
					<!-- <uni-icons type="star"></uni-icons> -->
					<view class="dflex-b">
						<view class="dflex">
							<view class="iconfont iconaixin-01 fwb fs-xs ft-base margin-right-xs"></view>
							<text class="fs-xs">老师分享单</text>
						</view>
						<view>
							<text class="fs-xs">感谢费 </text>
							<text class="price fwb fs-sm">{{ goods.thanksMoney || '' }}</text>
						</view>
					</view>
					<text class="gray-char padding-lr">{{ goods.thanksDetails }}</text>
				</view>
			<!-- </view> -->
			<view class="icon-detail pos-a">
				<view class="iconfont iconxiangqing ft-dark fs-sm"></view>
			</view>
		</view>
		<view class="gap"></view>
		</view>

		<view class="bg-main padding-lr padding-top padding-bottom-xs pos-r" @click="tagShow = true">
			<view class="dflex dflex-wrap-w">
				<view class="iconfont icondizhi- fwb fs-xs ft-base margin-right-xs"></view>
				<text class="fs-xs">{{ goods.city_name }}-{{ goods.area_name }}</text>
			</view>
			<!-- <view class="icon-detail pos-a"><view class="iconfont iconxiangqing ft-dark fs-sm"></view></view> -->
		</view>

		<!-- 05. 评价区 -->
		<view class="evaluate-area" v-if="evaluateDatas.length > 0">
			<use-list-title :title="evaluateTitle" tip="好评率 100%" color="#ff6a6c" iconfont=" "
				@goto="toevaluate"></use-list-title>
			<view class="padding-lr bg-main">
				<view class="eva-box dflex-s padding-bottom-lg" v-for="(item, index) in evaluateDatas" :key="index">
					<image class="portrait border-radius-c" :src="item.member_headimg"></image>
					<view class="right-area flex1 padding-left-sm">
						<view class="dflex-b ft-dark">
							<view class="dflex">
								<text class="name margin-right">{{ item.member_name }}</text>
								<use-rate :value="item.review_cnt" disabled></use-rate>
							</view>
							<text class="time fs-xs">{{ $api.format(item.create_time, 'yyyy-MM-dd') }}</text>
						</view>
						<view class="fs-sm ft-main padding-top-xs padding-bottom-sm">{{ item.review_content }}</view>
						<view class="dflex dflex-wrap-w">
							<image class="" mode="widthFix" v-for="(img, i) in item.review_imgs" :lazy-load="true"
								:key="i" :src="img" @click="preview(item.review_imgs, img)"></image>
						</view>
						<view class="">
							<text class="fs-xs ft-dark">{{ item.goods_type || '套餐1' }}</text>
						</view>
					</view>
				</view>
			</view>

			<view class="gap"></view>
		</view>

		<!-- 06. 详情区 -->
		<view class="detail-area bg-main">
			<view class="d-header padding dflex-c"><text>图文详情</text></view>
			<rich-text class="pro-detail" :nodes="html_nodes"></rich-text>
			<view class="gap-xxl"></view>
		</view>

		<!-- 07. 操作区 -->
		<view class="oper-area pos-f dflex-b w-full padding-lr-sm">
			<view class="btn-area dflex dflex-flow-c" @click="tohome">
				<text class="iconfont iconshouye-1"></text>
				<text>首页</text>
			</view>


			<!-- <button class="btn no-border dflex" open-type="contact"> -->
			<view class="btn-area dflex-c dflex-flow-c" @click="sendIm">
				<text class="iconfont iconkefu-01"></text>
				<text>消息</text>
			</view>
			<!-- </button> -->


			<view class="btn-area dflex dflex-flow-c" :class="{ active: favorite }" @click="tofavorite">
				<text class="iconfont" :class="favorite ? 'iconshoucang-' : 'iconshoucang-01'"></text>
				<text>收藏</text>
			</view>
			<view class="flex1 btn-container-2 dflex-b border-radius-big">
				<view class="tac padding-tb-sm flex1 bg-warn font-size btn-container-2" v-if="goods.stock_num > 0"
					@click="tocart(goods)">加入关注栏</view>
				<!-- <view class="tac padding-tb-sm flex1 bg-base" v-if="goods.stock_num > 0" @click="tobuy(goods)">立即购买</view> -->
				<!-- #ifdef APP-PLUS -->
				<view class="tac padding-tb-sm flex1 bg-base"
					v-if="goods.stock_num > 0 && (goods.canUsePhoneNo == undefined || goods.canUsePhoneNo)"
					@click="sendMsg(goods)">发送短信</view>
				<!-- #endif -->
				<!-- #ifdef MP -->
				<view class="tac padding-tb-sm flex1 bg-base">
					<button class="bg-base full-height-btn" open-type="contact">
						快速联系匹配
					</button>
				</view>
				<!-- #endif -->
				<!-- <view class="tac padding-tb-sm flex1 bg-disabled" v-else>已售磐</view> -->
			</view>
		</view>

		<!-- #ifdef MP-ALIPAY -->
		<view class="fixed-top dflex-c dflex-flow-c"><contact-button tnt-inst-id="0Xu_1aaW" scene="SCE00225456"
				size="50" color="#bbb" /></view>
		<!-- #endif -->

		<!-- <lime-painter /> -->

		<!-- 置顶 -->
		<use-totop ref="usetop" bottom="120"></use-totop>

		<!-- <view>
		        <mu-canvas ref="share" width="650" unit="rpx" height="1160" styles="margin-left: 50rpx;margin-top: 36rpx;" backgroundColor="#FFFFFF" :elementList="elementList" :auto="true"></mu-canvas>
		    </view> -->
	</view>
</template>

<script>
// #ifdef MP-ALIPAY
import aliParse from 'mini-html-parser2';
// #endif

// import lPainter from '@/uni_modules/lime-painter/components/lime-painter/';
import Poster from '@/components/zhangyuhao-poster/Poster.vue'
import uposter from '@/common/poster.js';
import QRCode from 'qrcode';

import { mapState, mapGetters } from 'vuex';

const uniImCo = uniCloud.importObject('uni-im-co', {
  customUI: true
});

export default {
	components: { Poster },
	computed: {
		...mapGetters(['islogin', 'member'])
	},
	data() {
		return {
			// 商品ID
			id: 0,
			// 分享ID
			mid: 0,
			// 商品数据
			goods: {},
			// 轮播图
			swiperDatas: [],
			// SKU
			sku: {},
			skuDatas: [],
			// 分享
			shareShow: false,
			// 海报
			posterQRcode: '',
			posterUrl: '',
			posterShow: false,
			//优惠券
			couponShow: false,
			couponDatas: [],
			// 服务标签
			tagShow: false,
			tagDatas: [],
			// 商品评价
			evaluateDatas: [],
			evaluateTitle: '评价',
			// 商品详情
			html_nodes: '',
			// 收藏
			favorite: false,

			scrollTop: 0,
			isZixishi: false,
		};
	},
	watch: {
		sku(e) {
			this.goods.price = e.price;
			this.goods.market_price = e.market_price;
			this.goods.stock_num = e.num;
		}
	},
	onShareAppMessage: function(ops) {
		let _this = this;
		let mid = 0;
		if (_this.member && _this.member._id) {
			mid = _this.member._id;
		}

		return {
			title: _this.goods.share_title,
			path: `/pages/goods/goods?id=${this.id}&mid=${mid}`, //这里设定都是以"/page"开头,并拼接好传递的参数
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
	onPageScroll(e) {
		//this.scrollTop = e.scrollTop;
		this.$refs.usetop.change(e.scrollTop);
	},
	onLoad(options) {
		console.log('onload opts', options);
		let title = '豆豆学';
		uni.setNavigationBarTitle({
			title
		});

		if (options) {
			this.mid = options.mid || '';
			if (options.id) {
				this.id = options.id;
			} else if (options.q) {
				let query = decodeURIComponent(options.q) || decodeURIComponent(uni.getStorageInfoSync('__scene_query_q'));
				this.resolveQueryq(query);
			}
		}

		if (!this.id) {
			this.$api.msg('商品ID无效');
			return;
		}
	},
	onShow(options) {
		if (!this.id) {
			const query = decodeURIComponent(uni.getStorageInfoSync('__scene_query_q'));
			this.resolveQueryq(query);
		}
		
		this.loadData();
		
	// 	uni.showLoading({
	// 	          title: '生成中...'
	// 	        });
		        
	// 	        // 1. 使用 qrcode 库生成 base64 格式的二维码图片
	// 	        const base64Image = this.createQRCodeAsBase64('大家号');
		        
	// 	        // 2. 将 base64 转换为临时文件路径
	// 	        const tempFilePath = this.saveBase64ToTempFile(base64Image);
		        
	// 	        // 3. 更新界面显示
	// 	        this.qrCodePath = tempFilePath;
		        
	// 	        uni.hideLoading();
	// 	        uni.showToast({
	// 	          title: '二维码生成成功',
	// 	          icon: 'success'
	// 	        });
				
	// 			console.log(this.qrCodePath)
	},

	methods: {
		// redraw(){
		//             this.$refs.share.redraw();
		//         },
		//         getImgSrc(){
		//             this.$refs.share.getImgSrc();
		//         },
		//         save(){
		//             this.$refs.share.saveImg();
		//         },
		// // 使用 qrcode 库生成 base64 格式的二维码
		//     async createQRCodeAsBase64(text) {
		//       return new Promise((resolve, reject) => {
		//         QRCode.toDataURL(text, {
		//           width: 200,
		//           margin: 1,
		//           errorCorrectionLevel: 'H'
		//         }, (err, url) => {
		//           if (err) {
		//             reject(err);
		//             return;
		//           }
		//           // 提取 base64 数据部分 (去掉 data:image/png;base64,)
		//           const base64Data = url.split(',')[1];
		//           resolve(base64Data);
		//         });
		//       });
		//     },
		    
		//     // 将 base64 数据保存为临时文件
		//     saveBase64ToTempFile(base64Data) {
		//       return new Promise((resolve, reject) => {
		//         // 将 base64 转换为 ArrayBuffer
		//         const buffer = this.base64ToArrayBuffer(base64Data);
		        
		//         // 生成临时文件名
		//         const tempFileName = `qrcode_${Date.now()}.png`;
		        
		//         // 使用 uni.getFileSystemManager() 保存文件
		//         uni.getFileSystemManager().writeFile({
		//           filePath: `${uni.env.USER_DATA_PATH}/${tempFileName}`,
		//           data: buffer,
		//           encoding: 'binary',
		//           success: (res) => {
		//             resolve(`${uni.env.USER_DATA_PATH}/${tempFileName}`);
		//           },
		//           fail: (err) => {
		//             reject(new Error(`保存文件失败: ${err.errMsg}`));
		//           }
		//         });
		//       });
		//     },
		    
		//     // 将 base64 转换为 ArrayBuffer
		//     base64ToArrayBuffer(base64) {
		//       const binaryString = atob(base64);
		//       const len = binaryString.length;
		//       const bytes = new Uint8Array(len);
		//       for (let i = 0; i < len; i++) {
		//         bytes[i] = binaryString.charCodeAt(i);
		//       }
		//       return bytes.buffer;
		//     },
		async loadData() {
			
			await this.$func.usemall
				.call('goods/detail', {
					goods_id: this.id,
					share_mid: this.mid
				})
				.then(res => {
					if (res.code === 200) {
						// 商品评价
						this.evaluateDatas = res.datas.evaluate;
						if (res.datas.evaluate_cnt) this.evaluateTitle = `评价(${res.datas.evaluate_cnt})`;

						if (typeof res.datas.goods.imgs === 'string') {
							this.swiperDatas = res.datas.goods.imgs.split(',').filter(x => x);
						} else {
							this.swiperDatas = res.datas.goods.imgs;
						}
						console.log("this.swiperDatas", this.swiperDatas);
						this.goods = res.datas.goods;
						// 商品详情
						let __goods_detail = res.datas.goods_detail;
						// #ifndef MP-ALIPAY
						this.html_nodes = __goods_detail.desc_mobile;
						// #endif

						// #ifdef MP-ALIPAY
						this.html_nodes = [];
						aliParse(__goods_detail.desc_mobile.replace(/"><*/gi, '"/><'), (err, nodes) => {
							if (!err) {
								this.html_nodes = nodes;
							}
						});
						// #endif

						// 商品SKU
						let __goods_skus = res.datas.goods_skus;
						if (__goods_skus.length > 0) {
							let __skuDatas = [];
							__goods_skus.forEach((sku, index) => {
								// 	{ id: 1, name: '45寸（大规格）', price: 788, market_price: 999, num: 0, selected: !0 },
								__skuDatas.push({
									id: sku._id,
									sku: sku.goods_sku,
									name: sku.spec,
									price: sku.price,
									market_price: sku.market_price || this.goods.market_price,
									num: sku.stock_num,
									selected: index == 0
								});
							});
							this.skuDatas = __skuDatas;
						}

						// SKU
						if (this.skuDatas.length > 0) {
							this.sku = this.skuDatas[0];
						}

						// 服务标签
						if (typeof this.goods.tags === 'string') {
							this.goods.tags = this.goods.tags.split(',').filter(x => x);
						}

						let __tagDatas = [];

						this.goods.tags.forEach((data, index) => {
							__tagDatas.push({
								name: data,
								selected: index == 0
							});
						});

						this.tagDatas = __tagDatas;

						// 收藏状态
						this.favorite = this.goods.collected === 1;
						this.isZixishi = this.goods.cid === 10001;
						return;
					}
					this.$api.msg(res.msg);
				});
		},
		// 处理 query q 数据
		resolveQueryq(query) {
			const arr = query
				.split('/')
				.slice(-1)[0]
				.split('_');
			if (arr.length == 2) this.mid = arr[1];
			this.id = arr[0];
		},
		// 图片预览
		preview(imgs, cur) {
			if (!imgs) return;

			uni.previewImage({
				urls: imgs,
				current: cur,
				longPressActions: {
					itemList: ['发送给朋友', '保存图片', '收藏'],
					success: function(data) {
						console.log(res);
					},
					fail: function(err) {
						console.log(err);
					}
				}
			});
		},
		
		// 打开分享
		opene1() {
			// this.$refs.popup.open('bottom')
			if (!this.loginCheck()) return;
			this.$refs.popupganxiefei.open('bottom')
		},

		// 打开分享
		shareOpen() {
			// this.$refs.popup.open('bottom')
			if (!this.loginCheck()) return;
			console.log('shareOpen 1111: ', this.shareShow)
			this.shareShow = true;
			console.log('shareOpen 2222: ', this.shareShow)
			
			// // #ifdef MP
			// // 此处的二维码内容，需自己在小程序端配置普通二维码规则
			// this.posterQRcode = `https://usemall.use-cloud.com/wxmp-product/${this.goods._id}_${this.member._id}`;
			// // #endif
			
			// // #ifdef H5
			// // 如果为 h5，二维码内容需配置为线上版本产品详情路径
			// this.posterQRcode = `https://usemall-h5.use-cloud.com/#/pages/goods/goods?id=${this.goods._id}&mid=${this.member._id}`;
			// // #endif
			this.createPoster()
		},
		// 创建海报
		createPoster() {
			console.log('createPoster 1111: ', this.posterUrl, this.posterQRcode)
			if (this.posterUrl) {
				this.posterShow = true;
				this.$refs.popuphaibao.open('bottom')
			} else {
			console.log('createPoster 2222: ', this.member, this.goods)
			
			this.posterQRcode = `https://static-mp-0fe42d5b-82e4-482d-8ad1-81bb97905319.next.bspapp.com/${this.goods._id}_${this.member._id}`;
			
			this.list = uposter.getGoodsData2(this.member, this.goods, this.posterQRcode);
			this.$refs.popuphaibao.open('bottom')
			}
			
			// this.$nextTick(() => {
			//     // 要放在$nextTick()里，不然会空白
			//     // this.$refs.poster.create();
			// })
		},
		// 海报二维码生成成功
		posterQRcodeResult(res) {
			console.log('posterQRcodeResult 1111: ', this.posterData, this.posterQRcode, res)
			// 获取产品海报数据
			// this.list = uposter.getGoodsData2(this.member, this.goods, res);
			console.log('this.posterData', this.list);
			// 生成图片
			// this.$nextTick(() => {
			//     // 要放在$nextTick()里，不然会空白
			//     this.$refs.poster.create();
			// })

			this.posterShow = true;
			
			console.log('posterQRcodeResult 2222: ', this.posterData, this.posterQRcode)
			
			this.$refs.popuphaibao.open('bottom')
			
		},
		// 海报生成完成
		posterSuccess(res) {
			this.posterUrl = res;
			
			console.log('posterSuccess: ', this.posterUrl)

			uni.hideLoading();
		},
		// 保存海报
		posterSave() {
			let _this = this
			if (this.posterUrl) {
				uni.showLoading({
					title: '保存中'
				})
				
				uni.saveImageToPhotosAlbum({
					filePath: this.posterUrl,
					success: function() {
						uni.hideLoading();
						
						uni.showToast({
							title: '海报保存成功',
							icon: 'success',
							duration: 2000
						});
						
						_this.$refs.popuphaibao.close()
					}
				});
			}
		},

		// 商品SKU
		selectSKU(res) {
			this.skuDatas.forEach(item => {
				if (res.sku == item.sku) {
					this.$set(item, 'selected', true);
				} else {
					this.$set(item, 'selected', false);
				}
			});

			this.sku = res;
		},

		// 评论
		toevaluate() {
			uni.navigateTo({
				url: `/pages/goods/goods-evaluate?id=${this.id}`
			});
		},
		// 首页
		tohome() {
			this.$api.tohome();
		},
		async sendIm() {
			if (!this.loginCheck()) return;

			uni.$emit('refreshIm', true);

			console.log('sendIm', this.goods);
			if (this.goods.create_uid == '6686df138a5c7863b1fb1c3d') {
				uni.showToast({
					title: '对方未公开联系方式，平台客服将为您服务！',
					icon: 'none',      // 不使用图标，只显示文字
					duration: 2000,    // 1秒后自动关闭
					mask: true         // 显示遮罩层，防止点击穿透
				});

				setTimeout(() => {
					uni.navigateTo({
						url:  `/uni_modules/uni-im/pages/chat/chat?user_id=${this.goods.create_uid}` // 替换为目标页面路径
					});
				}, 2200); // 等待1秒后跳转
			} else {
				uni.navigateTo({
					// url: `/pages/chat/contactList?touid=${this.goods.create_uid}`
					url: `/uni_modules/uni-im/pages/chat/chat?user_id=${this.goods.create_uid}`
				});
			}
			// uni.switchTab({
			// 	url: '/pages/tabbar/message'
			// });

			// const {
			// 	appId: appid
			// } = uni.getAppBaseInfo()
			
			// await uniImCo.sendMsg({
			// 	appId: appid,
  			// 	to_uid: this.goods.create_uid,
  			// 	type:"text",
  			// 	body:"您好！"
			// });
		},
		// 收藏
		tofavorite() {
			if (!this.loginCheck()) return;
			
			this.favorite = !this.favorite;
			let _data = {
				goods_id: this.id,
				state: !this.favorite ? '已取消' : '已收藏'
			};
			this.$func.usemall.call('member/collect', _data).then(res => {
				if (res.datas) {
					!this.favorite ? this.$api.msg('取消成功') : this.$api.msg('收藏成功');
					return;
				}

				this.$api.msg(res.msg);
			});
		},
		couponOpen() {
			// this.$api.msg('此功能未实现');
		},
		// 加入购物车
		tocart(params) {
			if (!this.loginCheck()) return;

			uni.$emit('addCart', true);
			
			this.$func.usemall
				.call('goods/addcart', {
					goods_id: params._id,
					goods_num: 1,
					goods_sku: this.sku.id
				})
				.then(res => {
					if (res.code === 200) {
						this.$api.msg(res.datas.msg);
						return;
					}

					this.$api.msg(res.msg);
				});
		},
		// 发短信
		sendMsg(item) {
			if (!this.loginCheck()) return;

			console.log("sendMsg", item)
		    //#ifdef APP-PLUS
		    plus.messaging.TYPE_SMS;
		    var msg = plus.messaging.createMessage(plus.messaging.TYPE_SMS);
		    msg.to = [item.mobile];
		    msg.body = item.consignee + "，你好！我在“豆豆学”，看到你的家教信息：“" + item.name + "”。想进一步跟你交流一下，看到请回复，感谢！（找家教，微信搜索“豆豆学Pro”小程序）";
		    plus.messaging.sendMessage(msg);
		    // #endif
		    //#ifdef H5
		    window.location.href = `sms:${phoneNumber}`
		    // #endif
		},
		// 立即购买
		tobuy(item) {
			let _this = this;
			if (!this.loginCheck()) return;
			
			uni.navigateTo({
				url: `/pages/order/create?goods_id=${this.id}&sku_id=${this.sku.id || ''}`
			});
		},
		// 检测是否已登录
		loginCheck() {
			if (!this.islogin) {
				let _this = this;
				uni.showModal({
					title: '授权登录',
					success: function(res) {
						if (res.confirm) {
							_this.$api.tologin();
						}
					}
				});
				return false;
			}
			
			return true;
		}
	}
};
</script>

<style lang="scss">
page {
	background: $page-color-base;
	padding-bottom: 120rpx;
}

.popup-content {
  padding: 20rpx;
  background-color: #f5f5f5; /* 浅色背景 */
  border-radius: 10rpx;
}

contact-button {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 50px;
	height: 50px;
}

.fixed-top {
	bottom: 230rpx;
}

/* 01. 轮播区 */
.swiper-area {
	height: 720rpx;
	top: 0;
	z-index: -1;
}

/* #ifndef MP */
.swiper-area {
	margin-top: calc(44px + env(safe-area-inset-top));
	margin-top: 44px;
}
/* #endif */

/* #ifdef APP-PLUS */
.swiper-area {
	margin-top: 0;
}
/* #endif */

/* 02. 商品数据区 */
.goods-area {
	margin-top: 720rpx;

	.price-box {
		display: flex;
		align-items: baseline;
	}

	.title {
		color: $font-color-dark;
		height: 46rpx;
		line-height: 46rpx;
	}
}

.share-area {
	.vertical-line {
		right: 50%;
		height: 40%;
	}
}

/* 03. 规格区 */
.sku-area .active {
	background: $base-color;
	color: #fff !important;
}

/* 04. 服务区 */
.icon-detail {
	right: 30rpx;
	top: 24rpx;
}

/* 05. 评价 */
.evaluate-area {
	.portrait {
		flex-shrink: 0;
		width: 80rpx;
		height: 80rpx;
	}

	.right-area {
		image {
			margin-right: 10rpx;
			margin-bottom: 10rpx;
			height: 200rpx;
			width: 30%;
		}
	}
}

/* 06. 详情区 */
.detail-area {
	.d-header {
		font-size: $font-base + 2upx;
		color: $font-color-dark;
		position: relative;

		text {
			padding: 0 20rpx;
			background: #fff;
			position: relative;
			z-index: 1;
		}

		&:after {
			position: absolute;
			left: 50%;
			top: 50%;
			transform: translateX(-50%);
			width: 300rpx;
			height: 0;
			content: '';
			border-bottom: 1px solid #ccc;
		}
	}

	/* 产品详情 */
	.pro-detail {
		width: 100%;
		overflow: hidden;
		-webkit-touch-callout: none;

		img {
			width: 100%;
			max-width: 100%;
			overflow: hidden;
		}
	}
}

/* 07. 操作区 */
.oper-area {
	left: 0;
	bottom: 0;
	background: rgba(255, 255, 255, 0.95);
	box-shadow: 0 0 20rpx 0 #f0f0f0;
	height: 100rpx;
	z-index: 95;

	.btn-area {
		font-size: $font-sm;
		color: $font-color-base;
		width: 96rpx;

		.iconfont {
			font-size: 40rpx;
			line-height: 48rpx;
		}
	}
}

/* 优惠券区 */
.coupon-area {
	max-height: 60vh;
	min-height: 30vh;

	.coupon-item {
		margin-bottom: 20rpx;

		&:last-child {
			margin-bottom: 0;
		}

		.content {
			&:after {
				position: absolute;
				left: 0;
				bottom: 0;
				content: '';
				width: 100%;
				height: 0;
				border-bottom: 1px dashed #f3f3f3;
				transform: scaleY(50%);
			}
		}

		.circle {
			position: absolute;
			bottom: -10rpx;
			z-index: 10;
			width: 20rpx;
			height: 20rpx;
			background: #f5f5f5;
			border-radius: 50%;

			&.r {
				right: -6rpx;
			}

			&.l {
				left: -6rpx;
			}
		}
	}
}

.font-size {
  font-size: 24upx; /* 继承文字大小 */
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
}

.full-height-btn {
  width: 100%;
  height: 100%; /* 继承父容器高度 */
  padding: 0; /* 移除默认内边距 */
  margin: 0; /* 移除默认外边距 */
  border: none; /* 移除默认边框 */
  // background-color: transparent; /* 移除默认背景 */
  // color: inherit; /* 继承文字颜色 */
  // font-size: inherit; /* 继承文字大小 */
  font-size: 24upx; /* 继承文字大小 */
}

.btn-container-2 {
  // display: flex;
  height: 80rpx; /* 设置容器高度 */
  // border-radius: 12rpx;
  // overflow: hidden; /* 确保圆角生效 */
 //  .button {
	// font-size: 14upx;
 //  }
}
</style>
