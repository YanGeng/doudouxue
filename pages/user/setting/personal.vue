<template>
	<view class="container">
		<view class="dflex-c pos-r margin-bottom margin-top">
			<view class="portrait-box" @click="changeHeadPic">
				<image class="border-radius-c" :src="headImageLocalPath || (userData && userData.member_headimg)  || '/static/images/user/default4.webp'">
				</image>
			</view>
			<!-- <view class="margin-left-sm">
				<view>
					<text class="username">{{ member.member_name || '严选' }}</text>
				</view>
				<view v-if="member.member_city"><text>{{ member.member_city }}</text></view>
			</view> -->
		</view>
		
		<!-- <use-list-title title="昵称" iconfont="" :tip="member.member_name || member.member_nickname" @goto=""></use-list-title> -->
		<view class="use-item padding-lr-xl dflex-b">
			<text class="tac">昵称</text>
			<input type="text" v-model="userData.member_nickname" placeholder="你的昵称"/>
			<!-- <input>{{ member.member_name || member.member_nickname }}</input> -->
		</view>
		<view class="use-item padding-lr-xl dflex-b">
			<text class="tac">性别</text>
			<view style="width: 50%;">
				<uni-data-checkbox :multiple="false" v-model="selectGender" :localdata="rangeGender"
					@change="changeGender"></uni-data-checkbox>
			</view>
			<!-- <text>{{ (member.member_gender == 0 ? '未知' : member.member_gender == 1 ? '男' : '女') || '未知' }}</text> -->
		</view>
		<view class="use-item padding-lr-xl dflex-b">
			<text class="tac">身份</text>
			<view style="width: 50%;">
				<uni-data-select v-model="selectRole" :localdata="rangeRole"
					@change="changeRole" :clear="false"></uni-data-select>
				<!-- <uni-data-checkbox v-model="selectRole" :localdata="rangeRole"
					@change="changeRole"></uni-data-checkbox> -->
			</view>
			<!-- <text>{{ member.member_name || member.member_nickname }}</text> -->
		</view>
		<view class="gap"></view>
		<view class="use-item padding-lr-xl dflex-b">
			<text class="tac">个性化推荐</text>
			<switch :checked="userData.perRecommend" color="#FF6A6C" @change="switchChange" />
			<!-- <text>{{ (member.member_gender == 0 ? '未知' : member.member_gender == 1 ? '男' : '女') || '未知' }}</text> -->
		</view>
		<view class="padding w-full margin-top">
			<view class="dflex-b border-radius-big">
				<view class="tac padding-tb-sm flex1 bg-base" @click="submit">提交更新</view>
			</view>
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
				userData: {
					_id: '',
					perRecommend: true,
					member_nickname: '',
					member_gender: 0,
					member_headimg: '',
					member_weixin_headimg: '',
					member_role: '',
				},
				headImageLocalPath: '',
				headImageUrl: '',
				selectRole: '',
				rangeRole: [
					{
						"value": 0,
						"text": "学生"
					},
					{
						"value": 1,
						"text": "老师"
					}
				],
				selectGender: 0,
				rangeGender: [{
						"value": 0,
						"text": "女"
					},
					{
						"value": 1,
						"text": "男"
					},
				],
				isSubmitting: false
			};
		},
		onShow() {
			if (!this.islogin) {
				this.$api.msg('账号未登录');
				return;
			}
		},
		onLoad() {
			this.loadData();
		},
		watch: {
			// 显示空白页
			selectRole(e) {
				console.log('selectRole: ', e);
				if (e == 0) {
					this.userData.member_role = 'student';
				} else if (e == 1) {
					this.userData.member_role = 'teacher';
				} else {
					this.userData.member_role = 'unknown';
				}
				console.log('selectRole userData: ', this.userData);
			},
			selectGender(e) {
				console.log('selectGender: ', e);
				this.userData.member_gender = e

				console.log('selectGender userData: ', this.userData);
			}
		},
		methods:{
			switchChange(e) {
				this.userData.perRecommend = e.detail.value;
				console.log('switchChange:', e, this.userData);
			},
			open() {
				// 通过组件定义的ref调用uni-popup方法 ,如果传入参数 ，type 属性将失效 ，仅支持 ['top','left','bottom','right','center']
				this.$refs.popup.open('top')
			},
			changeRole(e) {
				this.selectRole = e;
				console.log('e:', e, this.selectRole);
			},
			changeGender(e) {
				this.selectGender = e.detail.value;
				console.log('e:', e, this.selectGender);
			},
			changeHeadPic() {
				// 调用uni-app提供的选择图片API
				uni.chooseImage({
        			count: 1, // 只允许选择一张图片
        			success: (res) => {
          			// 选择成功后的回调
          				this.headImageLocalPath = res.tempFilePaths[0]; // 获取选中的图片路径
						// this.uploadImage(filePath); // 调用上传图片的方法
						console.log('this.headImageLocalPath', res);
        			},
        			fail: (err) => {
          				// 选择失败的回调
          				console.error('选择图片失败:', err);
        			}
      			})
			},
			loadData() {
				this.$func.usemall.call('member/getMemberInfo', '', true).then(res => {
					if (res.code == 200) {
						// this.putMember(res.datas.member);
						
						this.userData = res.datas.member;
						console.log('member/getMemberInfo', res, this.userData);

						this.selectGender = this.userData.member_gender;
						if (this.userData.member_role) {
							if (this.userData.member_role == 'student') {
								this.selectRole = 0;
							} else if (this.userData.member_role == 'teacher') {
								this.selectRole = 1;
							}
						}
					}
				});
			},
			async uploadImage(filePath) {
				let fileName = ''
				let lastSeparatorIndex = filePath.lastIndexOf("/");
				if (lastSeparatorIndex !== -1) {
    				fileName = filePath.substring(lastSeparatorIndex + 1);
    				console.log("File Name xxx:", fileName);
					// let lastIndex = fileName.lastIndexOf(".");
					// fileName = fileName.substring(0, lastIndex);
    				// console.log("File Name:", fileName, lastIndex);
				} else {
    				console.error("Invalid file path");
				}

				if (fileName) {
					fileName = '/user_head_pic/' + Date.now() + '_' + fileName; // + '.webp';
				}

				console.log("uploadImage xxxx:", fileName, filePath);
      			let {
              		fileID
            	} = await uniCloud.uploadFile({
        			// url: this.uploadUrl, // 你的服务器上传接口地址
        			filePath: filePath,
        			cloudPath: fileName, // 文件对应的key，后端可能需要根据这个key来接收文件
					cloudPathAsRealPath: true,
					fileType: 'image'
      			});

				console.log('fileID', fileID);

				if (fileID) {
					this.headImageUrl = fileID;
				}
    		},
			async submit() {
				let _this = this;
				if (_this.isSubmitting) {
					return
				}

				_this.isSubmitting = true;
				console.log('submit userData: ', _this.userData)
				if (_this.headImageLocalPath) {
					await _this.uploadImage(_this.headImageLocalPath);
					_this.userData.member_headimg = _this.headImageUrl;
					_this.userData.member_weixin_headimg = _this.headImageUrl;
				}
				console.log("finish upload file: ", _this.headImageUrl, _this.headImageLocalPath);

				await this.$func.usemall
					.call('member/update', _this.userData)	
					.then(res => {
						console.log("update member info finished");
					});

				_this.isSubmitting = false;
				// #ifndef H5
				if (_this.$api.pages().length > 1) {
					// 返回上一页	
					_this.$api.timerout(() => {
						uni.navigateBack({});
					}, 200);

					return;
				}
				// #endif
			},
		}
	}
</script>

<style lang='scss'>
	page {
		background: $page-color-base;
	}

	input {
        font-size: 14px;
		//text-align: right;
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
