<template>
	<view class="content bg-drak ft-main">
		<view class="gap"></view>
		<view class="row dflex border-line padding-lr">
			<text class="tit">昵称</text>
			<input class="input" type="text" v-model="addrData.consignee" placeholder="请输入您的昵称"
				placeholder-class="placeholder" />
		</view>
		<view class="row dflex border-line padding-lr">
			<text class="tit">手机号</text>
			<input class="input" type="number" v-model="addrData.mobile" placeholder="请输入手机号码"
				placeholder-class="placeholder" />
		</view>
		<view class="row dflex border-line padding-lr">
			<text class="tit">标题</text>
			<input class="input" type="text" v-model="goods.name" placeholder="请输入标题" placeholder-class="placeholder" />
		</view>

		<!-- <view class="row dflex border-line padding-lr">
			<text class="tit">教学科目</text>
		</view>
		<view class="row dflex border-line padding-lr">
			<view class="dflex-e flex1">
				<uni-data-checkbox :multiple="false" v-model="selectKemu" :localdata="rangeKemu"
					@change="changeKemu"></uni-data-checkbox>
			</view>
		</view> -->

		<view class="row dflex border-line padding-lr">
			<text class="tit">城市</text>
			<input class="input" type="text" v-model="goods.city_name" placeholder="请输入城市" placeholder-class="placeholder" />
		</view>

        <view class="row dflex border-line padding-lr">
			<text class="tit">大学</text>
			<input class="input" type="text" v-model="goods.school" placeholder="请输入大学" placeholder-class="placeholder" />
		</view>

        <view class="row dflex border-line padding-lr">
			<text class="tit">找老师/学生</text>
		</view>
        <view class="row dflex border-line padding-lr">
			<view class="dflex-a flex1">
				<uni-data-checkbox :multiple="false" v-model="selectRequestType" :localdata="rangeRequestType"
					@change="changeRequestType"></uni-data-checkbox>
			</view>
		</view>

		<view class="padding w-full margin-top">
			<view class="dflex-b border-radius-big">
				<view class="tac padding-tb-sm flex1 bg-base" @click="submit">查找</view>
			</view>
		</view>

		<view v-if="islogin" class="cart-list padding-sm">
		<view class="bg-main padding-top padding-lr border-radius margin-top-sm" v-for="(item, index) in goodsInfos"
			:key="index" @click="clickItem(item)">
			<view class="w-full flex-row-alicenter border-line">
				<view class="left">
					<image class="border-radius-xs wh-full" mode="aspectFill" :lazy-load="true" :src="item.img"></image>
				</view>
				<view class="margin-lr-sm">
				<view class="fwb margin-bottom-xs desc">
					<text>{{ item.name }} {{ item.mobile }}</text>
				</view>
                <view class="fwb margin-bottom-xs desc">
					<text>{{ formatTimestamp(item.last_modify_time) }}</text>
				</view>
				<view class="margin-bottom-sm">
					<text>{{ item.consignee }}</text>
					<text v-if="!(item.requestType === 0)" class="margin-left cl-money">{{ item.price/100 }}</text>
					<text class="margin-left">{{ item.tags.join() }}</text>
				</view>
				</view>
			</view>
			<view class="dflex-b">
<!-- 				<view v-if="item.is_default == '是'" class="dflex active">
					<text class="iconfont iconxuanzhongzhuangtai padding-tb-sm padding-right-sm"></text>
					<text> 默认地址</text>
				</view>
				<view v-else class="dflex ft-dark" @tap.stop="setDefault(item)">
					<text class="iconfont padding-tb-sm padding-right-sm"></text>
					<text> 设为默认</text>
				</view> -->
				<text class="clamp-2">{{ item.description }}</text>
				<view v-if="source == 0 || source == 1" class="dflex">
					<view class="padding-tb-sm padding-right-sm" @tap.stop="editRequest('edit', item)"><text
							class="iconfont iconbianji-01 ft-dark"></text></view>
					<view class="padding-tb-sm padding-left-sm" @tap.stop="showPopup(item)"><text
							class="iconfont iconlajitong-01 ft-dark"></text></view>
				</view>
			</view>
		</view>
        <!-- 上拉加载更多 -->
			<!-- <use-loadmore :type="loadmoreType"></use-loadmore> -->
		</view>
		
		<uni-popup ref="popup" type="bottom">
			<view class="padding-lr-sm padding-bottom-xl border-radius margin">
				<!-- <view class="popup-content"> -->
					<!-- <view class="popup-title">请选择</view> -->
					<radio-group @change="onRadioChange">
						<label class="radio-item dflex-b padding-lr-xl" v-for="(item, index) in options" :key="index">
							<text>{{ item.label }}</text>
							<radio :value="item.value" :checked="selectedValue === item.value" />
						</label>
					</radio-group>
		
					<view class="popup-buttons">
						<button class="border-radius-big" type="default" @click="closePopup">取消</button>
						<button class="border-radius-big" type="primary" @click="confirmSelection">确定</button>
					</view>
				<!-- </view> -->
			</view>
		</uni-popup>
		
	</view>
</template>

<script>
const db = uniCloud.database();
const _cart = 'usemall-goods-cart';
const __goods_info = 'usemall-goods';

import { provide } from "vue";
import {rangeKemu } from './order.js'
import {
		mapState, mapGetters
} from 'vuex';
	const __name = 'usemall-member-address';
	export default {
		computed: {
			...mapGetters(['islogin', 'user_role'])
		},
		components: {},
		data() {
			return {
                source: 0,
				key: '0322dc54e25fb3c5945ca6efc7efe9f4',
                headImageValue: [],
                detailImageValue: [],
                value: [],
                rangeRequestType: [
                    {
                        "value": 0,
                        "text": "自习室"
                    },
                    {
                        "value": 1,
                        "text": "找老师"
                    },
                    {
                        "value": 2,
                        "text": "找学生"
                    }
                ],
				rangeKemu: rangeKemu,
				selectKemu: '',
				selectRequestType: '',
				addrDefault: false,
				// addressName: '请选择地址 | 地图选择',
				addressName: '请选择地址',
				addrDataId: '',
				addrDataOpType: 'edit',
				addrData: {
					_id: '',
					consignee: '',
					mobile: '',
					address: '',
					province_name: '',
					city_name: '',
					area_name: '',
					addr_detail: '',
					is_default: 0,
					addr_source: '录入',
					remark: '家',
					longitude: '',
					latitude: ''
				},
				goods: {
					name: '',
					cid: '',
					cids: [],
					price: 10000,
					stock_num: '',
					sort: '',
					state: '',
					version: 1,
					is_delete: 0,
					img: '',
					imgs: [],
					tags: [],
					description: '',
					detail_imgs: [],
					desc_mobile: '',
					school: '',
					shoukeType: [],
					city_name: '',
					area_name: '',
					requestType: 2,
					catetories: [],
					addressId: '',
					link: '',
					canUsePhoneNo: true,
					longitude: '',
					latitude: '',
					geohash: ''
				},
				goodsInfos: [],
				id: 0,
				type: 'add',
				detailsTxtTemplate: '<div style=\"max-width:90%; margin: 0 auto;\">${TEXT}</div><br>',
				detailsPicTemplate: '<img style=\"max-width:100%;display:block;\" src=\"${IMGURL}">',
                reqdata: {
					page: 1,
					rows: 10,
					sidx: 'last_modify_time',
					sord: 'desc',
					currentCity: '',
					otherCity: false
				},
                loadmoreType: 'more',
				
				options: [
					{ value: 'option1', label: '成功匹配' },
					{ value: 'option2', label: '不需要了' }
				],
				selectedValue: 'option1',
				deleteItem: '',
			};
		},
		onLoad(options) {
			debugger
			// let title = '找老师';
			if (options.type === 'edit') {
				title = '编辑-找老师';
				this.$db['usemall-goods'].where({
					_id: options.id
				}).tolist().then(res => {
					if (res.code === 200) {
						console.log("load data", res, this.selectKemu, this.selectShoukeType);
						this.goods = res.datas[0];
						// 添加类目
						// let selectCate = [];
                        if (this.goods.cids) {
                            for (let cate of this.goods.cids) {
                                for (let item of this.rangeKemu) {
                                    if (cate === item.text || cate === item.cid) {
                                        // selectCate.push(item.value);
                                        this.selectKemu.push(item.value);
                                    }
                                }
                            }
                        }
						
						// console.log('selectKemu', this.selectKemu);
						
                        if (this.goods.shoukeType) {
                            for (let cate of this.goods.shoukeType) {
                                for (let item of this.rangeShoukeType) {
                                    if (cate == item.text) {
                                        // selectCate.push(item.value);
                                        this.selectShoukeType.push(item.value);
                                    }
                                }
                            }
                        }
						// this.value = selectCate;

						// 添加首页图片
						this.headImageValue = this.goods.imgs;
						this.detailImageValue = this.goods.detail_imgs;
					}
					
					// 获取地址信息
					let whereStr = 'create_uid == $cloudEnv_uid';
					if (this.goods.addressId) {
						whereStr = '_id == "' + this.goods.addressId + '"';
					}
					this.$db[__name].where(whereStr).tolist({
						orderby: 'is_default desc'
					}).then(res => {
						if (res.code === 200) {
							let data = res.datas[0]
							for (let key in this.addrData) {
								this.addrData[key] = data[key];
							}
							this.addrDefault = data.is_default == '是';
							this.addressName = data.province_name + '-' + data.city_name +
								'-' + data.area_name;
							this.addrDataId = data._id;
						}
					});

					this.$api.msg(res.msg);
				});
			}
			
			// } else {
			// 	// #ifdef H5 || MP-360 || MP-QQ || MP-TOUTIAO
			// 	this.addressName = "请选择地址";
			// 	// #endif
			// }

			this.type = options.type || 'add';
			// uni.setNavigationBarTitle({
			// 	title
			// });
		},
        //加载更多
		onReachBottom() {
            console.log('get the bottom')
			this.loadData();
		},
		methods: {
			showPopup(options) {
				this.deleteItem = options;
				console.log('aaaaaa test: ', this.deleteItem);
				this.$refs.popup.open();
			},
			closePopup() {
				this.$refs.popup.close();
			},
			onRadioChange(e) {
				this.selectedValue = e.detail.value;
			},
			confirmSelection() {
				if (!this.selectedValue) {
					uni.showToast({
						title: '请选择选项',
						icon: 'none'
					});
					return;
				}
				
				let type = 'finished'
				if (this.selectedValue =='option1') {
					type = 'finished'
				} else {
					type = 'noneed'
				}
				console.log('aaaaaaaaa type: ', type)
				this.$func.usemall
					.call('goods/updateNewGoodsDeleteType', {
						_id: this.deleteItem._id,
						deleteType: type
					})
					.then(res => {
						console.log("update request finished");
						this.loadData();
					});
					
				this.closePopup();
			},
            formatTimestamp(timestamp) {
                const date = new Date(timestamp);
                const year = date.getFullYear();
                // getMonth 返回 0 - 11，所以要加 1
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                const hours = String(date.getHours()).padStart(2, '0');
                const minutes = String(date.getMinutes()).padStart(2, '0');
                return `${year}-${month}-${day} ${hours}:${minutes}`;
            },
            // 跳转商品详情
            clickItem(item) {
				console.log('item', item)
				this.$api.togoods({
					id: item._id
				});
			},
			createId () {
				return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1) 
					+ (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
					+ (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1) 
					+ (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
					+ (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1) 
					+ (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
			},
			priceSliderChange(e) {
				this.goods.price = e.detail.value * 100;
				// console.log('value 发生变化：' + e.detail.value)
			},
			changeKemu(e) {
				this.selectKemu = e.detail.value;
				console.log('e:', this.value, this.selectKemu);
			},
			changeRequestType(e) {
				this.selectRequestType = e.detail.value;
				console.log('e:', this.value, this.selectRequestType);
			},
			successHeadPic(file) {
				// let headFilesPaths = file.tempFilePaths
				// for (let fp of headFilesPaths) {
				// 	this.goods.imgs.push(fp);
				// }
				// console.log('successHeadPic bf', this.headImageValue, this.goods);
				// // this.goods.img = this.goods.imgs[0].url;
				//    console.log('successHeadPic', this.headImageValue, this.goods);
			},
			deleteHeadPic(file) {
				// console.log('hhhhhhhhhhhhh')
				//    console.log('delete', file, this.goods);
				// let dlFilePath = file.tempFilePath;
				// let index = this.goods.imgs.indexOf(dlFilePath);
				// console.log('deleteHeadPic', index);
				// if (index != -1) {
				// 	this.goods.imgs.splice(index, 1);
				// 	// this.goods.img = this.goods.imgs[0];
				// }
				//    console.log('deleteHeadPic', this.headImageValue, this.goods);
			},
			successDetailsPic(file) {
				// let headFilesPaths = file.tempFilePaths
				// for (let fp of headFilesPaths) {
				// 	this.goods.detail_imgs.push(fp);
				// }
				//    console.log('successDetailsPic', this.detailImageValue, this.goods);
			},
			deleteDetailsPic(file) {
				// console.log('hhhhhhhhhhhhh')
				//    console.log('delete', file)
				// let dlFilePath = file.tempFilePath
				// let index = this.goods.detail_imgs.indexOf(dlFilePath)
				// console.log('deleteDetailsPic', index)
				// if (index != -1) {
				// 	this.goods.detail_imgs.splice(index, 1)
				// }
				//    console.log('deleteDetailaPic', this.detailImageValue,  this.goods)
			},
			// 获取上传状态
			select(e) {
				console.log('选择文件：', e)
			},
			// 获取上传进度
			progress(e) {
				console.log('上传进度：', e)
			},

			// 上传失败
			fail(e) {
				console.log('上传失败：', e)
			},
			switchChange(e) {
				this.goods.canUsePhoneNo = e.detail.value;
			},
			openAddress() {
				this.$refs.useAddress.open();
			},
			// 选择地址
			changeAddr(res) {
				let _this = this;

				_this.addrData.province_name = res.labelArr[0] || '';
				_this.addrData.city_name = res.labelArr[1] || '';
				_this.addrData.area_name = res.labelArr[2] || '';

				_this.addrData.address = res.label;
				_this.addressName = _this.addrData.address;
				_this.addrDataOpType = 'add';
			},
			// 选择地图地址
			choiceMapAddr(options) {
				let _this = this;

				uni.authorize({
					scope: 'scope.userLocation',
					success() {
						uni.chooseLocation({
							success: res => {
								console.log('位置', res);
								// console.log('位置名称：' + res.name);
								// console.log('详细地址：' + res.address);
								// console.log('纬度：' + res.latitude);
								// console.log('经度：' + res.longitude);

								if (res && res.name) {
									let __addr = _this.resolveAddr(res);
									_this.addrData.province_name = __addr.province || '';
									_this.addrData.city_name = __addr.city || '';
									_this.addrData.area_name = __addr.area || '';

									_this.addrData.address = __addr.addr;
									_this.addressName = _this.addrData.address;

									_this.addrData.longitude = res.longitude + '';
									_this.addrData.latitude = res.latitude + '';

									_this.addrData.addr_detail = res.name;
								}
							},
							fail(err) {
								console.log(err);
							}
						});
					},
					fail(err) {
						uni.showModal({
							title: '位置未授权，打开设置',
							success: function(res) {
								if (res.confirm) {
									uni.openSetting({});
								}
							}
						});
					}
				});
			},
			// #ifdef MP-ALIPAY
			// 选择地图地址
			choiceAlipayMapAddr(options) {
				console.log('open-location', options);
				let _this = this;

				uni.chooseLocation({
					success: res => {
						console.log('位置', res);
						if (res && res.address) {
							let __addr = _this.resolveAddr(res);
							_this.addrData.province_name = res.provinceName || '';
							_this.addrData.city_name = res.cityName || '';
							_this.addrData.area_name = res.adName || '';

							_this.addrData.address = [_this.addrData.province_name, _this.addrData.city_name,
									_this.addrData.area_name
								]
								.filter(x => x).join('-');
							_this.addressName = _this.addrData.address;

							_this.addrData.longitude = res.longitude;
							_this.addrData.latitude = res.latitude;

							_this.addrData.addr_detail = res.name || res.address;
						}
					},
					fail(err) {
						console.log(err);
					}
				});
			},
			// #endif
			// 解析地址
			resolveAddr(options) {
				let _this = this;
				let str = options.address;
				let __addr = {
					addr: ''
				};
				let __idx = 0;
				let __idx_pro = str.indexOf('省');

				if (__idx_pro == -1) {
					__idx = str.indexOf('自治区');
					if (__idx != -1) {
						__addr.province = str.substring(0, __idx + 3);
					} else {
						__addr.province = str.substring(0, 0);
						__idx = 0;
					}
				} else {
					__addr.province = str.substring(0, __idx_pro + 1);
				}

				if (__addr.province) __addr.addr += __addr.province + '-';

				let __idx_city = str.indexOf('市');
				if (__idx_city == -1) {
					__idx = str.indexOf('自治州');
					if (__idx != -1) {
						__addr.city = str.substring(__idx_pro + 1, __idx + 3);
					} else {
						__addr.city = str.substring(__idx + 1, __idx_city + 1);
					}
				} else {
					if (__idx == 0) {
						__addr.city = str.substring(__idx_pro + 1, __idx_city + 1);
					} else {
						__addr.city = str.substring(__idx + 3, __idx_city + 1);
					}
				}

				if (__addr.city) __addr.addr += __addr.city + '-';

				let __idx_area = str.lastIndexOf('区');
				if (__idx_area == -1) {
					__idx_area = str.indexOf('县');
					if (__idx == 0) {
						__addr.area = str.substring(__idx_city + 1, __idx_area + 1);
					} else {
						__addr.area = str.substring(__idx + 3, __idx_area + 1);
					}
				} else {
					if (__idx == 0) {
						__addr.area = str.substring(__idx_city + 1, __idx_area + 1);
					} else {
						__addr.area = str.substring(__idx + 3, __idx_area + 1);
					}
				}

				if (__addr.area) __addr.addr += __addr.area;

				return __addr;
			},

            // 加载数据
            async loadData(type = 'add', disableLoading, callback) {
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

                this.$func.usemall.call('goods/adminList', this.reqdata, disableLoading).then(res => {
						if (res.code === 200) {
							if (type == 'refresh') {
								this.goodsInfos = [];
							}
							
							let newData = res.datas.goods;
							this.goodsInfos = [...this.goodsInfos, ...newData];
							console.log("this.goodsInfos 1: ", this.goodsInfos);
							if (res.datas.goods.length >= this.reqdata.rows) {
								// if (this.reqdata.page == 1) this.hasmore = !0;
								this.reqdata.page++;
								this.loadmoreType = 'more'
							} else {
                                this.loadmoreType = 'nomore'
								// // otherCity == true, 说明已经查询过非当前城市数据
								// if (this.reqdata.otherCity) {
								// 	this.loadmoreType = 'nomore';
								// } else {
								// 	// otherCity == false, 说明当前城市没有数据，但其他城市可能还有
								// 	this.reqdata.otherCity = true;
								// 	this.reqdata.page = 1;
								// 	this.loadmoreType = 'more';
								// 	this.loadData('add', true);
								// 	console.log("this.goodsDatas 2: ", this.goodsInfos);
								// }
							}
							
							this.empty = this.goodsInfos.length === 0;
							if (typeof callback === 'function') {
								// 数据加载完成回调函数
								callback();
							}
						}
					})
            },

			//提交
			async submit() {
                let addrData = this.addrData;
                // let whereObj = {
                //     state: '销售中'
                // };

                if (addrData.consignee) {
                    this.reqdata.consignee = addrData.consignee;
                } else {
                    delete this.reqdata.consignee;
                }

				if (addrData.mobile) {
                    if (!/(^1[3|4|5|6|7|8|9][0-9]{9}$)/.test(addrData.mobile)) {
					    this.$api.msg('请输入正确的手机号码');
					    return;
                    } else {
                        this.reqdata.mobile = addrData.mobile;
                    }
				} else {
                    delete this.reqdata.mobile;
                }

                if (this.goods.name) {
                    this.reqdata.name = this.goods.name;
                } else {
                    delete this.reqdata.name;
                }

                if (this.goods.city_name) {
                    this.reqdata.currentCity = this.goods.city_name;
                } else {
                    delete this.reqdata.currentCity;
                }

                if (this.goods.school) {
                    this.reqdata.school = this.goods.school;
                } else {
                    delete this.reqdata.school;
                }

                console.log('this.selectRequestType: ', this.selectRequestType)

                if (this.selectRequestType !== '') {
                    this.reqdata.requestType = this.selectRequestType;
                } else {
                    delete this.reqdata.requestType;
                }

                console.log('this.reqdata is: ', this.reqdata)

                this.loadData('refresh');

                // this.$db[__goods_info].where(whereObj).tolist({
				// 	orderby: 'last_modify_time desc',
				// 	skip: 0,
			    //     limit: 10
				// }).then(res => {
				// 	if (res.code === 200) {
				// 		this.goodsInfos = res.datas;
				// 		console.log("this.goodsInfos", this.goodsInfos);
				// 		// return;
				// 	}
				// 	this.$api.msg(res.msg);
				// });

				return;
			},
			// 添加|编辑 收货人
			editRequest(type, options) {
				console.log('editRequest', options)
				options = options || {
					id: 0
				};
				
				if (options.requestType === 1) {
					let test = 10002;
					uni.navigateTo({
						url: `/pages_user/user/order/createFindStudent?type=${type}&id=${options._id}`
					});
				} else if (options.requestType === 2) {
					uni.navigateTo({
						url: `/pages_user/user/order/createFindTeacher?type=${type}&id=${options._id}`
					});
				} else if (options.requestType === 0) {
					// 暂不考虑自习室
					uni.navigateTo({
						url: `/pages_user/user/order/createZixishi?type=${type}&id=${options._id}`
					});
				}
			},
			removeRequest(options) {
				let _this = this;
				uni.showModal({
					title: '提示',
					content: '删除需求',
					success: async function(res) {
						if (res.confirm) {
							console.log('用户点击确定');
							await _this.$func.usemall
								.call('goods/deleteGoods', {
									_id: options._id,
								})
								.then(res => {
									console.log("update request finished");
									_this.loadData();
								});
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			},
			getLocation() {
				uni.getLocation({
					type: 'wgs84',
					// type: 'gcj02',
					success: (res) => {
						this.location = {
							...res
						};
						console.log('当前位置：' + JSON.stringify(this.location));
						const url =
							`https://api.tianditu.gov.cn/geocoder?postStr={"lon":${this.location.longitude},"lat":${this.location.latitude},"ver":1}&type=geocode&tk=${this.key}`;
						uni.request({
							url,
							method: 'GET',
							success: (res) => {
								console.log('当前地址：' + JSON.stringify(res.data));
								if (res.data.status == 0) {
									// 提取地址信息
									let addressComponent = res.data.result.addressComponent
									console.log('当前地址：' + JSON.stringify(res.data));
									let _this = this;

									_this.addrData.province_name = addressComponent.province || '';
									_this.addrData.city_name = addressComponent.city || '市辖区';
									_this.addrData.area_name = addressComponent.county || '';

									_this.addrData.address = _this.addrData.province_name + '-' + _this.addrData.city_name + '-' + _this.addrData.area_name;
									_this.addressName = _this.addrData.address;
									_this.addrData.addr_detail = addressComponent.address;
									_this.addrDataOpType = 'add';
								} else {
									console.error('逆地理编码失败:', res.data.msg);
								}
							},
							fail: (err) => {
								console.error('请求失败:', err);
							}
						});
					},
					fail: (err) => {
						console.error(err);
						// 这里可以处理权限被拒绝的情况
						if (err.errMsg === 'getLocation:fail auth deny') {
							// 引导用户打开权限设置
							uni.showModal({
								title: '提示',
								content: '需要获取您的位置信息，请到设置中打开相关权限',
								success: function(res) {
									if (res.confirm) {
										// 打开设置页面
										uni.openSetting({
											success: function(res) {
												console.log(res.authSetting);
												// res.authSetting = { "scope.userLocation": true } 表示已获得权限
											},
										});
									}
								},
							});
						}
					},
				});
			}
		}
	};
</script>

<style lang="scss">
	page {
		background: $page-color-base;
	}

	.row {
		background: #fff;
		position: relative;
		height: 110rpx;

		.tit {
			flex-shrink: 0;
			width: 150rpx;
		}

		.input {
			flex: 1;
			font-size: 30rpx;
			padding-left: 0;
		}

		.input_t {
			color: #333;
		}
	}

	.picker {
		background: #fff;
		position: relative;
		height: 200rpx;

		.uni-file-picker {
			flex-shrink: 1;
			width: 450rpx;
			// height: 250rpx;
		}
	}

    	
	.image-container {
	  /* 容器样式，可以根据需要调整 */
	  width: 100%;
	  max-width: 600px; /* 设置图片容器的最大宽度 */
	  margin: 0 auto; /* 使容器居中 */
	}
	
	.responsive-image {
	  width: 100%; /* 图片宽度设置为容器的100% */
	  height: auto; /* 高度自动调整以保持图片的宽高比 */
	  display: block; /* 移除图片底部的空白间隙 */
	}
	
	/* 需求列表 */
	.left {
		image {
			width: 120rpx;
			height: 120rpx;
			flex-shrink: 0;
		}
	}

	/* #ifdef H5 || MP-360 */
	.action-section {
		margin-bottom: 50px;
	}

	/* #endif */
	
	.popup-title {
	  font-size: 32rpx;
	  font-weight: bold;
	  padding: 20rpx 0;
	  text-align: center;
	}
	.radio-item {
	  display: flex;
	  align-items: center;
	  padding: 20rpx 0;
	  border-bottom: 1rpx solid #eee;
	  background-color: #f5f5f5; /* 浅色背景 */
	  border-radius: 12rpx;
	  justify-content: space-between;
	  transition: all 0.2s;
	}
	.radio-item text {
	  margin-left: 20rpx;
	  font-size: 28rpx;
	}
	.popup-buttons {
	  display: flex;
	  justify-content: space-around;
	  margin-top: 40rpx;
	}
	.popup-buttons button {
	  width: 40%;
	}
</style>