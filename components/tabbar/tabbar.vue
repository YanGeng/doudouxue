<template>
    <view class="tab-bar">
        <view v-for="(item,index) in list" :key="index" class="tab-bar-item" @click="switchTab(item, index)">
            <image class="tab_img" :src="currentIndex == index ? item.selectedIconPath : item.iconPath"></image>
            <view class="tab_text" :style="{color: currentIndex == index ? selectedColor : color}">{{item.text}}</view>
        </view>
    </view>
</template>

<script>
    export default {
        props: {
            selectedIndex: { // 当前选中的tab index
                default: 0
            },
        },
        data() {
            return {
                color: "#666666",
                selectedColor: "#00BAB2",
                list: [],
                currentIndex:0,
            }
        },
        created() {
            this.currentIndex = this.selectedIndex;
            
            var _this = this
            
            if (uni.getStorageSync('identify') == 'nurse') {
                //护士
                _this.list = [{
				"pagePath": "/pages/tabbar/home",
				"iconPath": "/static/images/tabbar/home.png",
				"selectedIconPath": "/static/images/tabbar/home-active.png",
				"text": "首页"
			},
			{
				"pagePath": "/pages/tabbar/category",
				"iconPath": "/static/images/tabbar/category.png",
				"selectedIconPath": "/static/images/tabbar/category-active.png",
				"text": "分类"
			},
			{
				"pagePath": "/pages/tabbar/cart",
				"iconPath": "/static/images/tabbar/cart.png",
				"selectedIconPath": "/static/images/tabbar/cart-active.png",
				"text": "购物车"
			},
			{
				"pagePath": "/pages/tabbar/user",
				"iconPath": "/static/images/tabbar/user.png",
				"selectedIconPath": "/static/images/tabbar/user-active.png",
				"text": "我的"
			}
                ]
            } else {
                //医管
                _this.list = [{
				"pagePath": "/pages/tabbar/home",
				"iconPath": "/static/images/tabbar/home.png",
				"selectedIconPath": "/static/images/tabbar/home-active.png",
				"text": "首页"
			},
			{
				"pagePath": "/pages/tabbar/category",
				"iconPath": "/static/images/tabbar/category.png",
				"selectedIconPath": "/static/images/tabbar/category-active.png",
				"text": "分类"
			},
			{
				"pagePath": "/pages/tabbar/shopping",
				"iconPath": "/static/images/tabbar/shopping.png",
				"selectedIconPath": "/static/images/tabbar/shopping-active.png",
				"text": "购物圈"
			},
			{
				"pagePath": "/pages/tabbar/user",
				"iconPath": "/static/images/tabbar/user.png",
				"selectedIconPath": "/static/images/tabbar/user-active.png",
				"text": "我的"
			}
                ]
            }
        },
        methods: {
            switchTab(item, index) {
                this.currentIndex = index;
                
                let url = item.pagePath;
                uni.redirectTo({url:url})
            }
        }
    }
</script>

<style lang="scss">
    .tab-bar {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        height: 100rpx;
        background: white;
        display: flex;
        justify-content: center;
        align-items: center;
        padding-bottom: env(safe-area-inset-bottom); // 适配iphoneX的底部

        .tab-bar-item {
            flex: 1;
            text-align: center;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            .tab_img {
                width: 37rpx;
                height: 41rpx;
            }
            .tab_text {
                font-size: 20rpx;
                margin-top: 9rpx;
            }
        }
    }
</style>