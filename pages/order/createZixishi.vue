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
			<text class="tit">自习室名称</text>
			<input class="input" type="text" v-model="goods.name" placeholder="请输入自习室名称" placeholder-class="placeholder" />
		</view>

		<view class="row dflex border-line padding-lr">
			<text class="tit">自习室介绍</text>
		</view>

		<br>

		<view class="uni-textarea dflex border-line padding-lr">
			<view>
				<textarea class="input" type="text" v-model="goods.description" placeholder="可简要介绍自习室的情况"
					placeholder-class="placeholder" auto-height maxlength="1000"/>
			</view>
		</view>

		<br>

		<view class="row dflex border-line padding-lr">
			<text class="tit">首页图片</text>
		</view>

		<view class="picker dflex border-line padding-lr">
			<view>
				<uni-file-picker v-model="headImageValue" id="head" file-mediatype="image" :limit="3"
					return-type="array" mode="grid" @success="successHeadPic" @delete="deleteHeadPic"></uni-file-picker>
			</view>
		</view>

		<view class="row dflex border-line padding-lr">
			<text class="tit">详情页图片</text>
		</view>

		<view class="picker dflex border-line padding-lr">
			<!-- <text class="tit">详情页图片</text> -->
			<view>
				<uni-file-picker v-model="detailImageValue" id="details" file-mediatype="image" :limit="3"
					return-type="array" mode="grid" @success="successDetailsPic"
					@delete="deleteDetailsPic"></uni-file-picker>
			</view>
		</view>
	

		<view class="row dflex border-line padding-left">
			<text class="tit">所在地区</text>
			<view class="dflex-b flex1">
				<view class="flex1 input_t" @click="openAddress">{{ addressName }}</view>
				<use-address ref="useAddress" @onConfirm="changeAddr" cancelColor="#bbb" themeColor="#FF6A6C">
				</use-address>
				<!-- <use-pickeraddr class="flex1" @change="changeAddr">
					<view class="input_t">{{ addressName }}</view>
				</use-pickeraddr> -->
				<!-- #ifdef MP-WEIXIN || MP-BAIDU -->
				<view class="iconfont icondizhi- input_t padding-lr-sm padding-tb-16" @click="choiceMapAddr"></view>
				<!-- #endif -->
				<!-- #ifdef MP-ALIPAY -->
				<view class="iconfont icondizhi- input_t padding-lr-sm padding-tb-16" @click="choiceAlipayMapAddr">
				</view>
				<!-- #endif -->
			</view>
			<view class="dflex dflex-wrap-w margin-right" @click="getLocation">
				<view class="iconfont icondizhi- fwb fs-xs ft-base" style="margin-right: 5rpx;"></view>
				<text class="fs-xxs cl3">获取定位</text>
			</view>
		</view>
		<view class="row dflex border-line padding-lr">
			<text class="tit">详细地址</text>
			<input class="input" type="text" v-model="addrData.addr_detail" placeholder="请输入详细地址"
				placeholder-class="placeholder" />
		</view>
		<!-- <view class="gap"></view>
		<view class="row dflex-b padding-lr">
			<text class="tit">设为默认</text>
			<switch :checked="addrDefault" color="#FF6A6C" @change="switchChange" />
		</view> -->

		<view class="padding w-full margin-top">
			<view class="dflex-b border-radius-big">
				<view class="tac padding-tb-sm flex1 bg-base" @click="submit">提交</view>
			</view>
		</view>

		<!-- 
		<view style="width: 400rpx; min-height: 300rpx;">
			<uni-file-picker file-mediatype="image" :limit="6" return-type="array" v-model="goods.detail_imgs" mode="grid"></uni-file-picker>
		</view> -->
	</view>
</template>

<script>
import { provide } from "vue";
import { rangeShoukeType, rangeKemu } from './order.js'
import {
		mapState
} from 'vuex';
	const __name = 'usemall-member-address';
	export default {
		computed: {
			...mapState(['islogin', 'user_role'])
		},
		components: {},
		data() {
			return {
				key: '0322dc54e25fb3c5945ca6efc7efe9f4',
				headImageValue: [],
				detailImageValue: [],
				value: [],
				rangeShoukeType: rangeShoukeType,
				rangeKemu: rangeKemu,
				selectKemu: [],
				selectShoukeType: [],
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
					price: '',
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
					requestType: 0,
					catetories: [],
					addressId: '',
					link: ''
				},
				goodsInfo: {},
				id: 0,
				type: 'add',
				detailsTxtTemplate: '<div style=\"max-width:90%; margin: 0 auto;\">${TEXT}</div><br>',
				detailsPicTemplate: '<img style=\"max-width:100%;display:block;\" src=\"${IMGURL}">',
			};
		},
		onLoad(options) {
			console.log('onLoad', options);
			debugger
			let title = '新增自习室';
			if (options.type === 'edit') {
				title = '编辑自习室';
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
					// console.log('gpp: ', this.goods.addressId);
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
			uni.setNavigationBarTitle({
				title
			});
		},
		methods: {
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
				// console.log('e:', this.value, this.selectKemu);
			},
			changeShoukeType(e) {
				this.selectShoukeType = e.detail.value;
				// console.log('e:', this.value, this.selectShoukeType);
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
				this.addrDefault = e.detail.value;
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

			//提交
			async submit() {
				if (this.addrDefault) {
					this.addrData.is_default = '是';
				} else {
					this.addrData.is_default = '否';
				}

				let addrData = this.addrData;
				if (!addrData.consignee) {
					this.$api.msg('请填写昵称');
					return;
				}
				if (!/(^1[3|4|5|7|8|9][0-9]{9}$)/.test(addrData.mobile)) {
					this.$api.msg('请输入正确的手机号码');
					return;
				}

				if (!addrData.address) {
					this.$api.msg('请选择地址');
					return;
				}
				if (this.type === 'add' || !addrData._id) {
					addrData._id = this.createId();
				}
				// if (!addrData.addr_detail) {
				// 	this.$api.msg('请填写详细地址');
				// 	return;
				// }
				// if (!addrData.addr_detail) {
				// 	this.$api.msg('请填写详细地址');
				// 	return;
				// }

				if (!this.goods.name) {
					this.$api.msg('请填写需求标题');
					return;
				}

				if (!this.goods.description) {
					this.$api.msg('请填写需求详情');
					return;
				}

				// if (this.selectKemu.length == 0) {
				// 	this.$api.msg('请选择教学科目');
				// 	return;
				// }

				// console.log('addrData', this.addrData);
				// console.log('goods', this.goods);
				// console.log('goodsInfo', this.goodsInfo);

				// console.log('goodsInfo', this.selectKemu);
				// goodsTags处理
				this.goods.tags = [];
				this.goods.tags.push(addrData.province_name + addrData.city_name + addrData.area_name + addrData.addr_detail);
				if (this.goods.school) {
					this.goods.tags.push(this.goods.school);
				}
				
				this.goods.cids = []
				this.goods.cids.push(10001);
				for (let id of this.selectKemu) {
					for (let item of this.rangeKemu) {
						if (id == item.value) {
							this.goods.tags.push(item.text);
							this.goods.cids.push(item.cid);
						}
					}
				}
				
				if (this.goods.cids.length > 0) {
					this.goods.cid = this.goods.cids[0];
				}
				
				// console.log("shouketype", this.selectShoukeType, this.goods.shoukeType)
				this.goods.shoukeType = [];
				for (let id of this.selectShoukeType) {
					for (let item of this.rangeShoukeType) {
						if (id == item.value) {
							this.goods.tags.push(item.text);
							this.goods.shoukeType.push(item.text);
						}
					}
				}
				
				if (this.addrData.city_name == '市辖区') {
					this.goods.city_name = this.addrData.province_name;
				} else {
					this.goods.city_name = this.addrData.city_name;
				}
				
				this.goods.area_name = this.addrData.area_name;

				// console.log('goods', this.headImageValue, this.detailImageValue, this.goods);
				let realImgs = [];
				if (this.headImageValue.length > 0) {
					for (let fp of this.headImageValue) {
						let imgNote = {
							url: fp.url
						};
						realImgs.push(imgNote);
					};
				}
				this.goods.imgs = realImgs;
				this.goods.img = realImgs.length > 0 ? realImgs[0].url : "";

				let realDetailImgs = [];
				for (let fp of this.detailImageValue) {
					let imgNote = {
						url: fp.url
					};
					realDetailImgs.push(imgNote);
				};
				this.goods.detail_imgs = realDetailImgs;

				// 创建详情
				let detailsTxtTmp = this.detailsTxtTemplate.replace("${TEXT}", this.goods.description.split("\n").join(
					"<br>"))
				let detailsPicTmp = '';
				if (this.goods.detail_imgs) {
					for (let di of this.goods.detail_imgs) {
						detailsPicTmp = detailsPicTmp + this.detailsPicTemplate.replace("${IMGURL}", di.url)
					}
					// console.log('goodsInfo 2', this.goods);
				}

				this.goods.desc_mobile = '<p>' + detailsTxtTmp + detailsPicTmp + '</p>'

				console.log("test test", this.addrData, this.goods);

				if (this.type === 'edit') {
					await this.$func.usemall
						.call('goods/updateNewGoods', {
							_id: this.goods._id,
							consignee: this.addrData.consignee,
							mobile: this.addrData.mobile,
							name: this.goods.name,
							cid: this.goods.cid,
							cids: this.goods.cids,
							price: this.goods.price,
							stock_num: this.goods.stock_num,
							sort: this.goods.sort,
							state: this.goods.state,
							version: this.goods.version,
							img: this.goods.img,
							imgs: this.goods.imgs,
							desc_mobile: this.goods.desc_mobile,
							tags: this.goods.tags,
							description: this.goods.description,
							detail_imgs: this.goods.detail_imgs,
							is_delete: 0,
							school: this.goods.school,
							shoukeType: this.goods.shoukeType,
							city_name: this.goods.city_name,
							area_name: this.goods.area_name,
							requestType: 0,
							// catetories: this.goods.catetories,
							addressId: this.addrData._id,
							link: this.goods.link,
						})
						.then(res => {
							console.log("update request finished");
						});
				} else {
					await this.$func.usemall
						.call('goods/createNewGoods', {
							consignee: this.addrData.consignee,
							mobile: this.addrData.mobile,
							name: this.goods.name,
							cid: this.goods.cid,
							cids: this.goods.cids,
							price: this.goods.price,
							stock_num: 999,
							sort: 1,
							state: "销售中",
							version: 1,
							is_delete: 0,
							img: this.goods.img,
							imgs: realImgs,
							desc_mobile: this.goods.desc_mobile,
							tags: this.goods.tags,
							description: this.goods.description,
							detail_imgs: this.goods.detail_imgs,
							school: this.goods.school,
							shoukeType: this.goods.shoukeType,
							city_name: this.goods.city_name,
							area_name: this.goods.area_name,
							requestType: 0,
							// catetories: this.goods.catetories,
							addressId: this.addrData._id,
							link: this.goods.link,
						})
						.then(res => {
							console.log("create request finished");
						});
				}

				if (this.addrDefault) {
					// 把默认为是的改成 否
					await this.$db[__name]
						.where('create_uid == $env.uid && is_default == "是"')
						.update({
							is_default: '否'
						});
				}

				// console.log('addrDataOpType', addrData);
				if (this.type == 'add') {
					this.$db[__name].add(addrData).then(res => {
						if (res.code === 200) {
							this.$api.msg('添加成功');
							this.$api.timerout(() => {
								uni.navigateBack();
							}, 100);
							
							// console.log('address', res);
							return;
						}

						this.$api.msg(res.msg);
					});
				} else {
					if (!this.addrDataId) {
						this.$api.msg('当前ID异常，编辑失败');
						return;
					}
					
					delete addrData._id;
					this.$db[__name].update(this.addrDataId, addrData).then(res => {
						if (res.code === 200) {
							this.$api.msg('编辑成功');
							this.$api.timerout(() => {
								uni.navigateBack();
							}, 100);
							// console.log('address', res);
							return;
						}

						this.$api.msg(res.msg);
					});
				}
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
</style>