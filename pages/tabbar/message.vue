<template>
	<view class="page">
		<!-- 00. 未授权登录 -->
		<use-empty v-if="!islogin" e-style="round" e-type="unauthorized" tip="当前未授权" btn-tip="去登录" height="28vh"
			:auto="false" @goto="tologin"></use-empty>
			
		<view v-else-if="showWebview">
			<chat-webview :token="token" :touid="toUid"></chat-webview>
		</view>
		
		<!-- 严选版权 -->
		<use-copyright></use-copyright>
	</view>
</template>
<script>
    var wv;
    import {
		mapState
	} from 'vuex';
	export default {
        computed: {
			...mapState(['islogin', 'user_role', 'token'])
		},
		watch: {
            backButtonPress(newVal, oldVal) {
                console.log('backButtonPress change:', newVal, oldVal);
            },
			token(newVal, oldVal) {
				console.log('uni_id_token change ssssssssss:', newVal, oldVal);
				if (newVal != oldVal) {
					// this.param.uni_id_token = newVal;
					// this.url = `${this.imWebUrl + this.path}?login=${encodeURIComponent(JSON.stringify(this.param))}`;
                    // this.addWvEventListener();
                    setTimeout(() => {
                        this.addWvEventListener();
                        wv.reload();
                    }, 150);
				}
				
				console.log('current url:', this.url);
			}
		},
        onReady() {
            this.addWvEventListener();
        },
        // 设备上点击返回按钮时的处理
        onBackPress(e) {
            console.log('dasdfasdffa');
            if (wv && this.canBack) {
                this.backButtonPress = 0;
                wv.back();
            } else {
                // 没有可返回的页面了, 可以做些其他的处理, 比如回首页等等
                this.backButtonPress++;
                if (this.backButtonPress > 1) {
                    plus.runtime.quit();
                } else {
                    plus.nativeUI.toast('再按一次退出应用');
                }
                setTimeout(() => {
                    this.backButtonPress = 0;
                }, 1000);
            }
            return true;
        },
        onNavigationBarButtonTap(e) {
            // 返回
            if (e.index === 0) {
                // #ifdef H5
                uni.navigateBack();
                // #endif
 
                // #ifdef APP-PLUS
                if (this.canBack) {
			        wv.back();
		        } else {
		    	    // 没有可返回的页面了, 可以做些其他的处理, 比如回首页等等
		        }
                // #endif
            }
            // 首页
            if (e.index === 1) {
                // 显示tabbar
                //uni.showTabBar({
                //  animation: false
                //});
                uni.switchTab({
                    url: '/pages/index/index'
                });
            }
        },
		data() {
			return {
				url: '',
                backButtonPress: 0,
                refresh: false,
                toUid: '',
                refeshFlag: false,
                showWebview: true,
				// imWebUrl: 'https://env-00jxt0xsfk5j-static.normal.cloudstatic.cn',
				// path: '/#/uni_modules/uni-im/pages/index/index',
				// param: {},
			}
		},
		// created() {
		//     // 在这里使用const声明一个常量
		//     const imWebUrl = 'https://env-00jxt0xsfk5j-static.normal.cloudstatic.cn';
		// 	const path = '/#/uni_modules/uni-im/pages/index/index';
		//     console.log(imWebUrl, path); // 输出: This value will not change
		//     // ...其他初始化逻辑
		// },
		onShow() {
            // wv.reload();
            // uni.$on('refreshIm',(action)=>{  
            //     this.refresh = action;  
            // }) 

            console.log('refreshIm_before_before', this.refresh, this.backButtonPress, wv);
            if (this.refresh) {
                // wv.reload();
                // this.refeshFlag = !this.refeshFlag;
                this.showWebview = false;
                setTimeout(() => {
                    this.showWebview = true;
                    this.addWvEventListener();
                    this.refresh = false;
                }, 20);

            }

            console.log('refreshIm_after_after', this.refresh, this.refeshFlag);
			// console.log('onShow url: ', this.url);
			// console.log('const value: ', this.imWebUrl, this.path);
			// if (!this.url) {
			// 	this.loadWebView();
			// }
		},
		onLoad(e) {
            uni.$on('refreshIm',(action)=>{  
                this.refresh = action;  
            }) 
			// this.loadWebView();
		},
        onUnload() {
            // 页面卸载时移除监听器，避免内存泄漏
            uni.$off('refreshIm');
        },
		methods: {
            // 跳转登录页
			tologin() {
				this.$api.tologin();
			},
            addWvEventListener() {
                // #ifdef APP-PLUS
                var self = this;
                var currentWebview = this.$scope.$getAppWebview(); //此对象相当于html5plus里的plus.webview.currentWebview()。在uni-app里vue页面直接使用plus.webview.currentWebview()无效，非v3编译模式使用this.$mp.page.$getAppWebview()
                setTimeout(function () {
                    wv = currentWebview.children()[0];
                    wv.addEventListener(
                        "progressChanged",
                        function (e) {
                            wv.canBack(function (e) {
                            self.canBack = e.canBack;
                            });
                        },
                        false
                    );
                }, 500); //如果是页面初始化调用时，需要延时一下
                // #endif
            }
		}
	}
</script>
<style>
	.page {
		width: 100%;
		height: 100%;
		flex: 1;
		background-color: #f8f8f8;
	}

	/* .web-view {
		width: 750rpx;
		flex: 1;
	} */
</style>