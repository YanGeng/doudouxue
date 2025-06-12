修复了网络速度慢图片加载慢的时候生成不出来的问题，怪我文档看的不仔细，磕头认罪Orz
另外大家一定要注意配置微信安全域名，感谢支持！
##### 导入
```
import Poster from '../../../components/zhangyuhao-poster/Poster.vue'
```
##### 在components中声明
```
export default {
    components: {
        Poster
    }
}
```
##### 在template中使用
```
<poster ref="poster" :list="list" background-color="#FFF" :width="750" :height="1334"
            @on-success="posterSuccess" @on-error="posterError"></poster>
```
##### 调用create函数，生成图片
```
// 生成图片
this.$nextTick(() => {
	// 视情况而定是否要使用 $nextTick()
	this.$refs.poster.create();
})
```
##### list参数说明

|参数名|必选|类型|说明|
|:----    |:---|:----- |-----   |
|type |是  |string |类型，可选值：image（图片），text（文字），textarea（多行文字）   |
|x |是  |number | x轴位置    |
|y     |是  |number | y轴位置    |
|path     |否  |string | 图片路径，type为image时必填    |
|width     |否  |string | type为image时指定图片宽度，type为textarea时指定换行的宽度    |
|height     |否  |string | type为image时必填指定图片高度，type为textarea时指定文本区域高度，溢出展示“...”     |
|rotate     |否  |number | 旋转角度    |
|shape     |否  |string | 可选值：circle 圆形     |
|area     |否  |object | 绘制范围，超出该范围会被剪裁掉 该属性与shape暂时无法同时使用，area存在时，shape失效；例如: {x:10,y:10,width:100,height:100}     |
|text     |否  |string | 文本内容，type为text或textarea时必填     |
|color     |否  |string | 文本颜色     |
|size     |否  |number | 文本字体大小     |
|lineSpace     |否  |number | 行间距，type为textarea时有效     |
|textBaseline     |否  |string | 基线 默认top 可选值：'top'、'bottom'、'middle'、'normal'    |

##### 代码示例 

``` 
<template>
	<view>
		<button @click="start()">生成</button>
		<!-- 此处用于展示生成的图片 -->
		<image :src="poster" style="width: 750rpx;height: 1334rpx;"></image>
		<!-- 生成图片 -->
		<poster ref="poster" :list="list" background-color="#FFF" :width="750" :height="1334"
			@on-success="posterSuccess" @on-error="posterError"></poster>

	</view>
</template>

<script>
	import Poster from '../../../components/zhangyuhao-poster/Poster.vue'
	export default {
		components: {
			Poster
		},
		data() {
			return {
				poster: '',
				list: []
			};
		},
		methods: {
			posterError(err) {
				console.log(err)
			},
			posterSuccess(url) {
				// 生成成功，会把临时路径在这里返回
				this.poster = url;
				console.log(url)
			},
			start() {
				// 赋值需要渲染的信息
				this.list = [{
						type: 'image',
						// path替换成你自己的图片，注意需要在小程序开发设置中配置域名
						path: 'https://xxxxxxx.aliyuncs.com/test/1.jpg',
						x: 0,
						y: 0,
						width: 750,
						height: 750
					},
					{
						type: 'image',
						path: 'https://xxxxxxx.aliyuncs.com/test/1.jpg',
						x: (750 - 200) / 2,
						y: 880,
						width: 200,
						height: 200
					},
					{
						type: 'textarea',
						width: 700,
						height: 150,
						x: 20,
						y: 780,
						text: '童装卫衣2023春季新款',
						size: 24,
						color: '#000'
					}
				];
				// 生成图片
				this.$nextTick(() => {
					// 要放在$nextTick()里，不然会空白
					this.$refs.poster.create();
				})
			}
		}
	}
</script>

```




