# mu-canvas
# 使用方法


```javascript
<template>
	<view>
		<mu-canvas ref="share" width="650" unit="rpx" height="1160" styles="margin-left: 50rpx;margin-top: 36rpx;" backgroundColor="#FFFFFF" :elementList="elementList" :auto="true"></mu-canvas>
	</view>
</template>

<script>
export default {
	// components: { XqGeneratePoster },
	data() {
		return {
			elementList: {
				images: [ //图片对象
					{
						path: "http://t6.xin.cn/uploads/20231113/a07068b23e1d4969d09f4105fee78631.png", //图片路径[必填]
						dx: 0, //左上角x轴[必填]
						dy: 0, //左上角y轴[必填]
						dWidth: 325, //宽度[必填]
						dHeight: 430, //高度[必填]
						sx: 0, //绘画的宽度[选填]
						sy: 0, //绘画的高度[选填]
					}
				],
				text: [ //渲染文字
					{
						value: "邀请码：", //渲染的文字
						color: "#333333", //文字颜色[选填]
						size: "14", //大小[选填]
						font: "PingFang SC-Regular, PingFang SC;", //字体[选填]
						x: 13, //左上角x轴[必填]
						y: 452, //左上角y轴[必填]
						// backgroundColor: "#ffffff", //背景色
						maxWidth: "", //字体最大宽度
						maxHeight: "", //字体最大高度
					}
				],
				qr: [ //渲染的二维码
					{
						url: "http://t6.xin.cn/#/pages/user/code_login?invite_mobile=5", //二维码文字[必填]
						dx: 241, //左上角x轴[必填]
						dy: 452, //左上角y轴[必填]
						size: 71, //二维码大小
						color: "#333333", //二维码前景色
						backgroundColor: "#ffffff" //二维码背景色
					}
				]
			
			}
		};
	},
	methods: {
		redraw(){
			this.$refs.share.redraw();
		},
		getImgSrc(){
			this.$refs.share.getImgSrc();
		},
		save(){
			this.$refs.share.saveImg();
		}
	}
};
</script>
```
## mu-canvas参数说明

| 参数               | 说明                    |  类型   |    默认    |
| -------------     | ------------------------| -----  | ---------------|
| canvasId     | canvas-id的名称            |  String |        canvas-id,同页面不能重复   |
| auto     |是否自动渲染           |  Bool |          true是自动渲染,false需要手动调用          |
| styles     | 样式[不设置宽高和背景颜色]            |  String |                    |
| backgroundColor  | canvas背景颜色              |  String |   下载时会显示  |
| width        | canvas的宽度            |  String/num |   单位px,不设置，为最宽图片宽度|
| height     | canvas高度              |  String/num |    单位px,不设置，为最高图片高度|
| unit       | canvas的宽高的单位[支持rpx和px]       |  String |     rpx/px|
| elementList           | 绘画描述  |  Object | 下面描述|

## elementList参数说明

| 参数               | 说明                    |  类型   |    默认    |
| -------------     | ------------------------| -----  | ---------------|
| images     | 图片描述           |  Array |        多张图片   |
| text     |文本描述          |  Array |          多个文字          |
| qr     | 二维码面           |  Array |           多个二维码         |

## images参数说明

| 参数               | 说明                    |  类型   |  
| -------------     | ------------------------| -----  | 
| path     | 图片路径(必须可下载，h5跨域要能下载图片)           |  String |           
| dx     |左上角x轴[必填]          |  String |       
| dy     | 左上角y轴[必填]           |  String |   
| dWidth     | canvas上宽度[必填]          |  String/number |       
| dHeight     | canvas上高度[必填]]          |  String/number |
| sx     | 源图左上角x轴[必填]         |  String/number |
| sy     | 源图左上角y轴[必填]            |  String/number |
| sWidth     | 源图宽            |  String/number |
| sHeight     | 源图高            |  String/number |


## text参数说明

| 参数               | 说明                    |  类型   |  
| -------------     | ------------------------| -----  | 
| value     | 要展示的文字           |  String |           
| color     |颜色          |  String |       
| size     | 文字大小         |  String/Number |   
| font     | 文字字体          |  String |       
| x     | 文字左上角x轴          |  String/number |
| y     | 文字左上角y轴           |  String/number |
| backgroundColor     | 文字背景颜色            |  String |
| maxWidth     | 最大渲染宽度            |  String/number |
| maxHeight     | 最大渲染高度            |  String/number |

## qr参数说明

| 参数               | 说明                    |  类型   |  
| -------------     | ------------------------| -----  | 
| url     | 渲染地址           |  String |           
| dx     |二维码左上角x轴          |  String |       
| dy     | 二维码左上角y轴         |  String/Number |   
| size     | 二维码大小       |  String/number |       
| color| 前景色         |  String |
| backgroundColor    | 背景色           |  String |

## 可用函数说明

| 函数               | 说明                    |
| -------------     | ------------------------|
| redraw       | 手动渲染图片      |
| getImgSrc       | 获取图片的src[有可能是base64图片]      |
| saveImg       | 保存图片      |