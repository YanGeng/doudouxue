<template>
	<view class="content bg-drak ft-main">
		<view class="gap"></view>
		<view class="row dflex border-line padding-lr">
			<text class="tit">收货人</text>
			<input class="input" type="text" v-model="addrData.consignee" placeholder="请输入收货人姓名"
				placeholder-class="placeholder" />
		</view>
		<view class="row dflex border-line padding-lr">
			<text class="tit">手机号</text>
			<input class="input" type="number" v-model="addrData.mobile" placeholder="请输入手机号码"
				placeholder-class="placeholder" />
		</view>
		<view class="row dflex border-line padding-lr">
			<text class="tit">标题</text>
			<input class="input" type="text" v-model="goods.name" placeholder="请输入标题"
				placeholder-class="placeholder" />
		</view>
		<view class="row dflex border-line padding-lr">
			<text class="tit">详情</text>
		</view>
		
		<br>
		
		<view class="uni-textarea dflex border-line padding-lr">
			<view>
				<textarea class="input" type="text" v-model="goodsInfo.description" placeholder="请输入详情介绍"
					placeholder-class="placeholder" auto-height />
			</view>
		</view>
		
		<br>
		
		<view class="row dflex border-line padding-lr">
			<text class="tit">首页图片</text>
		</view>
		
		<view class="picker dflex border-line padding-lr">
			<view>
				<uni-file-picker id="head" file-mediatype="image" :limit="3" return-type="array"
					mode="grid" @success="successHeadPic" @delete="deleteHeadPic"></uni-file-picker>
			</view>
		</view>
		
		<!-- <uni-forms-item name="imgs" label="图片列表"> -->
		<view class="row dflex border-line padding-lr">
			<text class="tit">详情页图片</text>
		    <!-- <uni-file-picker file-mediatype="image" :limit="6" return-type="array" v-model="goodsInfo.detail_imgs"></uni-file-picker> -->
		<!-- </uni-forms-item> -->
		</view>
		
		<view class="picker dflex border-line padding-lr">
			<!-- <text class="tit">详情页图片</text> -->
			<view>
				<uni-file-picker id="details" file-mediatype="image" :limit="3" return-type="array"
					mode="grid" @success="successDetailsPic" @delete="deleteDetailsPic"></uni-file-picker>
		<!-- </uni-forms-item> -->
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
		</view>
		<view class="row dflex border-line padding-lr">
			<text class="tit">详细地址</text>
			<input class="input" type="text" v-model="addrData.addr_detail" placeholder="请输入详细地址"
				placeholder-class="placeholder" />
		</view>
		<view class="gap"></view>
		<view class="row dflex-b padding-lr">
			<text class="tit">设为默认</text>
			<switch :checked="addrDefault" color="#FF6A6C" @change="switchChange" />
		</view>

		<view class="padding w-full margin-top">
			<view class="dflex-b border-radius-big">
				<view class="tac padding-tb-sm flex1 bg-base" @click="submit">提交</view>
			</view>
		</view>
		
		<!-- 
		<view style="width: 400rpx; min-height: 300rpx;">
			<uni-file-picker file-mediatype="image" :limit="6" return-type="array" v-model="goodsInfo.detail_imgs" mode="grid"></uni-file-picker>
		</view> -->
	</view>
</template>

<script>
	const __name = 'usemall-member-address';
	export default {
		components: {},
		data() {
			return {
				addrDefault: false,
				// addressName: '请选择地址 | 地图选择',
				addressName: '请选择地址',
				addrDataId: '',
				addrDataOpType: 'edit',
				addrData: {
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
					latitude: '',
				},
				goods: {
				    name: '',
				    cid: '',
				    price: '',
				    stock_num: '',
				    sort: '',
				    state: '',
				    version: 1,
				    is_delete: 0,
				    img: '',
				    imgs: [],
				},
				goodsInfo: {
				    detail_imgs: [],
				    description: '',
					desc_mobile: '',
				},
				id: 0,
				type: 'add',
				detailsTxtTemplate: '<div style=\"max-width:90%; margin: 0 auto;\">${TEXT}</div><br>',
				detailsPicTemplate: '<img style=\"max-width:100%;display:block;\" src=\"${IMGURL}">',
			};
		},
		onLoad(options) {
			debugger
			let title = '新增收货人';
			if (options.type === 'edit') {
				title = '编辑收货人';

				this.$db[__name].where('create_uid == $cloudEnv_uid').tolist({
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
					
					this.$api.msg(res.msg);
				});
			} else {
				// #ifdef H5 || MP-360 || MP-QQ || MP-TOUTIAO
				this.addressName = "请选择地址";
				// #endif
			}

			this.type = options.type || 'add';
			uni.setNavigationBarTitle({
				title
			});
		},
		methods: {
			successHeadPic(file) {
				let headFilesPaths = file.tempFilePaths
				for (let fp of headFilesPaths) {
					this.goods.imgs.push(fp);
				}
				this.goods.img = this.goods.imgs[0];
			    console.log('successHeadPic', this.goods);
			},
			deleteHeadPic(file) {
				console.log('hhhhhhhhhhhhh')
			    console.log('delete', file)
				let dlFilePath = file.tempFilePath;
				let index = this.goods.imgs.indexOf(dlFilePath);
				console.log('deleteHeadPic', index);
				if (index != -1) {
					this.goods.imgs.splice(index, 1);
					this.goods.img = this.goods.imgs[0];
				}
			    console.log('deleteHeadPic', this.goods);
			},
			successDetailsPic(file) {
				let headFilesPaths = file.tempFilePaths
				for (let fp of headFilesPaths) {
					this.goodsInfo.detail_imgs.push(fp);
				}
			    console.log('successDetailsPic', this.goodsInfo);
			},
			deleteDetailsPic(file) {
				console.log('hhhhhhhhhhhhh')
			    console.log('delete', file)
				let dlFilePath = file.tempFilePath
				let index = this.goodsInfo.detail_imgs.indexOf(dlFilePath)
				console.log('deleteDetailsPic', index)
				if (index != -1) {
					this.goodsInfo.detail_imgs.splice(index, 1)
				}
			    console.log('deleteDetailaPic', this.goodsInfo)
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
							
							_this.addrData.address = [_this.addrData.province_name, _this.addrData.city_name, _this.addrData.area_name]
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
					this.$api.msg('请填写收货人');
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
				if (!addrData.addr_detail) {
					this.$api.msg('请填写详细地址');
					return;
				}
				if (!addrData.addr_detail) {
					this.$api.msg('请填写详细地址');
					return;
				}
				
				if (!this.goods.name) {
					this.$api.msg('请填写需求标题');
					return;
				}
				
				if (!this.goodsInfo.description) {
					this.$api.msg('请填写需求详情');
					return;
				}
				
				// 创建详情
				let detailsTxtTmp = this.detailsTxtTemplate.replace("${TEXT}", this.goodsInfo.description)
				let detailsPicTmp = '';
				for (let di of this.goodsInfo.detail_imgs) {
					detailsPicTmp = detailsPicTmp + this.detailsPicTemplate.replace("${IMGURL}", di)
				}
				this.goodsInfo.desc_mobile = '<p>' + detailsTxtTmp + detailsPicTmp + '</p>'
				
				console.log('addrData', this.addrData);
				console.log('goods', this.goods);
				console.log('goodsInfo', this.goodsInfo);
				let realImgs = [];
				for (let fp of this.goods.imgs) {
					let imgNote = {
						url: fp
					};
					realImgs.push(imgNote);
				};
				
				await this.$func.usemall
					.call('goods/createNewGoods', {
						name: this.goods.name,
						cid: 1,
						price: 200,
						stock_num: 99,
						sort: 1,
						state: "销售中",
						version: 1,
						is_delete: 0,
						img: this.goods.img,
						imgs: realImgs,
						desc_mobile: this.goodsInfo.desc_mobile
					})
					.then(res => {
				});
				
				if (this.addrDefault) {
					// 把默认为是的改成 否
					await this.$db[__name]
						.where('create_uid == $env.uid && is_default == "是"')
						.update({
							is_default: '否'
						});
				}
				
				if (this.addrDataOpType == 'add') {

					this.$db[__name].add(addrData).then(res => {
						if (res.code === 200) {
							this.$api.msg('添加成功');
							this.$api.timerout(() => {
								uni.navigateBack();
							}, 100);
							return;
						} 
						
						this.$api.msg(res.msg);
					});
				} else {
					if (!this.addrDataId) {
						this.$api.msg('当前ID异常，编辑失败');
						return;
					}
					
					this.$db[__name].update(this.addrDataId, addrData).then(res => {
						if (res.code === 200) {
							this.$api.msg('编辑成功');
							this.$api.timerout(() => {
								uni.navigateBack();
							}, 100);
							return;
						}
						 
						this.$api.msg(res.msg);
					});
				}
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
