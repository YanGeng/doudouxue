<template>
	<view>
		<city-select
			@cityClick="cityClick"
			@activateLoc="activateLoc"
			:formatName="formatName"
			:active-city="activeCity"
			:hotCity="hotCity"
			:obtainCitys="obtainCitys"
			:isSearch="true"
			ref="citys"
		></city-select>
	</view>
</template>

<script>
import citys from './citys.js'
console.log(citys.length)
import citySelect from '@/components/city-select/city-select.vue'
import { mapState, mapMutations } from 'vuex';
export default {
	data() {
		return {
			//需要构建索引参数的名称（注意：传递的对象里面必须要有这个名称的参数）
			formatName: 'title',
			location_city: '',
			//当前城市
			activeCity: {
				id: 1,
				title: '上海市'
			},
			//热门城市
			hotCity: [
				{
					id: 0,
					title: '南京市'
				},
				{
					id: 1,
					title: '南京市'
				}
			],
			//显示的城市数据
			obtainCitys: [
				{
					id: 0,
					title: '南京'
				},
				{
					id: 1,
					title: '北京'
				},
				{
					id: 2,
					title: '天津'
				},
				{
					id: 3,
					title: '东京'
				}
			]
		}
	},
	components: {
		citySelect
	},
	onShow() {
		console.log('city.vue:', this.current_city, this.location_city);
	},
	onLoad() {
		//动态更新数据
		// setTimeout(() => {
			//修改数据格式
			this.formatName = 'cityName'
			//修改当前城市
			let location_city = uni.getStorageSync('location_city');
			if (location_city) {
				this.activeCity = location_city;
			} else {
				this.activeCity = {
					cityName: '上海市',
					cityCode: 310100
				}
			}

			//修改热门城市
			this.hotCity = [
				{
					cityName: '北京市',
					cityCode: 110102
				},
				{
					cityName: '上海市',
					cityCode: 310100
				},
				{
					cityName: '南京市',
					cityCode: 110100
				}
			]
			//修改构建索引数据
			this.obtainCitys = citys
			// uni.showToast({
			// 	icon: 'none',
			// 	title: '更新数据成功',
			// 	// #ifdef MP-WEIXIN
			// 	duration: 3000,
			// 	// #endif
			// 	mask: true
			// })
		// }, 5000)
	},
	methods: {
		...mapMutations(['updateCurrentCity', 'updateLocationCity']),
		cityClick(item) {
			console.log("this.current_city bf", this.location_city, this.current_city);
			let _this = this;
			console.log("item ", item);
			this.updateCurrentCity(item.cityName);
			// _this.updateLocationCity(item.activateCity);
			console.log("this.current_city af", this.current_city, item, this.location_city, this.current_city);
			console.log("getCurrentPages", getCurrentPages().length);
			uni.navigateBack({});
			// uni.showModal({
			// 	title: '提示',
			// 	content: '删除需求',
			// 	success: async function(res) {
			// 		if (res.confirm) {
			// 			console.log('用户点击确定');
			// 			await _this.$func.usemall
			// 				.call('goods/deleteGoods', {
			// 					_id: options._id,
			// 				})
			// 				.then(res => {
			// 					console.log("update request finished");
			// 					_this.loadData();
			// 				});
			// 		} else if (res.cancel) {
			// 			console.log('用户点击取消');
			// 		}
			// 	}
			// });
			                        
			// uni.showToast({
			// 	icon: 'none',
			// 	title: 'item: ' + JSON.stringify(item),
			// 	// #ifdef MP-WEIXIN
			// 	duration: 3000,
			// 	// #endif
			// 	mask: true
			// })
		},
		activateLoc(item) {
			console.log("this.activateLoc bf", this.location_city, this.current_city);
			let _this = this;
			console.log("item ", item);
			this.updateLocationCity(item);
			console.log("this.activateLoc af", this.current_city, item, this.location_city, this.current_city);
			// console.log("getCurrentPages", getCurrentPages().length);
			// uni.navigateBack({});
		}
	}
}
</script>

<style></style>
