<template>
	<view>
		<canvas v-show="loading===false" :canvas-id="canvasId"   :style="styles+`width:`+width+unit+`;height:`+height+unit+`;`"></canvas>

		<view class="uqrcode-makeing" :style="styles+`width:`+width+unit+`;height:`+height+unit+`;`" v-if="loading === true">

			<image class="uqrcode-makeing-image"
				src="data:image/gif;base64,R0lGODlhAAEAAfIEAOHh4SSsWuDg4N3d3f///wAAAAAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh/wtYTVAgRGF0YVhNUDw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDYuMC1jMDAyIDc5LjE2NDQ4OCwgMjAyMC8wNy8xMC0yMjowNjo1MyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIyLjAgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjAyODhGMzM4RDEwMTExRUM4MDhCRkVBQkE2QUZDQzkwIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjAyODhGMzM5RDEwMTExRUM4MDhCRkVBQkE2QUZDQzkwIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MDI4OEYzMzZEMTAxMTFFQzgwOEJGRUFCQTZBRkNDOTAiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MDI4OEYzMzdEMTAxMTFFQzgwOEJGRUFCQTZBRkNDOTAiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4B//79/Pv6+fj39vX08/Lx8O/u7ezr6uno5+bl5OPi4eDf3t3c29rZ2NfW1dTT0tHQz87NzMvKycjHxsXEw8LBwL++vby7urm4t7a1tLOysbCvrq2sq6qpqKempaSjoqGgn56dnJuamZiXlpWUk5KRkI+OjYyLiomIh4aFhIOCgYB/fn18e3p5eHd2dXRzcnFwb25tbGtqaWhnZmVkY2JhYF9eXVxbWllYV1ZVVFNSUVBPTk1MS0pJSEdGRURDQkFAPz49PDs6OTg3NjU0MzIxMC8uLSwrKikoJyYlJCMiISAfHh0cGxoZGBcWFRQTEhEQDw4NDAsKCQgHBgUEAwIBAAAh+QQFFAAEACwAAAAAAAEAAQAD/0i63P4wykmrvTjrzbv/YCiOZGmeaKqubOu+cCzPdG3feK7vfO//wKBwSCwaj8ikcslsOp/QqHRKrVqv2Kx2y+16v+CweEwum8/otHrNbrvf8Lh8Tq/b7/i8fs/v+/+AgYKDhIWGh4iJiouMjY6PkJGSk5SVlpeYmZqbnJ2en6ChoqOkpaanigCqq6ytrieusbISAbW2t7i5uru8vb66bLLCrLDDw7S/ycrLzLXBxsLF0LHIzdbXzc/Trybb1BHY4eK92t6r0uaq1ePs4+Xp6PDg7fTh7+bx+PP1/Mz33vkA7utH0Ne/bQERDizIMNfBaQkhLmxIMcBDaBExTqzI8P+isYwfN3Ik6PFYt3TnRI7kVzLaSZQA1q0s2HLWS5QyZ/ar+a0ETHUqdbLjyc3nz5xC6RFtBdIkhKQ01/yMeVPeU6g7pR6tqu8q1npLiXEV6PVru7ApjcJEquyEPa1rxyosm83EWzVTm7qk688uNrRA1eIMatDvNcBUBVt9cJdEYzR55Urku8ztX7iDFXdlfLnE4zORNZPlfNiwNcR6bVJua7ou3q2i55I+3brv67ixJ8927bhzmtAkgDv4HIJ4GeEikDMw/oH5GOUgoCtw3oF6GOkesFvfsP0L9g7afY/o7uU7h/ClPYsHDTt4++Hri8c//j55/eXzm+d/fj96/+n/+1UX4HX/ZVcgeRggyIV5G6BHmycMauAgb5xEmMGEtnViIQYYVvbJhhd0yBqEBYJ34ICUgGiBiMmAomIFLP7iYonnnZiehjQ2aOODOE7l449MERbVai1iBuSRO67EVpG3IenkYvDptKSMRj5pZUhENjRlYU1e6aVqu420JTlVfmlmYGFyNCYviJ2ZWZoVrblLm25uFuVMcgJTZp1X5gmWkGzuyeeTfioF6JyCDopkoWcdqmeXilrJ6FCOOpRopD9O6k6luNCJ6V5wUqSpRZd+mqSYnN7iqalFhaplqrasyqpYWXYEqzOlzmpnA0mNKquuiblqa61kQgrsqWreSqqx/8e+eaeSyqIi7bTUVmvttdhmq+223Hbr7bejCCDuuOSWa+656Kar7rrnSjDAu/DGK++89NZr77340vsru/z2224E+QYs8MAEw7uvvwj3627BDDfM8MEJR5zuwg5XbHG9EEusMbkUX+zxxRlvvHHHH5f8cK4ip+wvySa3HHDIKifMsss0Y4xyzDijO3PNPBt8c85Aj7tzzzzDHPS6QxNNs9FHTwyw0lAPwHTT/0IQNdRTU11u0ld/nLXWQj/dddE/g50y12Nb/LXZaKft8Npgt+32ycyafbTccxMMt9Z45y3w3lT37Xe+qEnGruDxzihxalU/ULHiETNuLuI+k7i44f9Ii013j5Fjri7l70Ius+dOW/32hxpLvrXmBYuOsOocs6436pfndrjsA7u+Muk64/437Z3bnrnpDeuuMO+NO/A48KML/7nvLzP/OvKTQ0+49Ls7X7rjp1sevHu1c1889sdr3zvxm1eYOvWro986+fzCHrb7s3vfPPjfK9895/ePMLL1+DKe3c6Hv/fZb4DPM5++4IfA9hWwfvxrIAH9tz/1STCBD8wdAy8oNfYlboMXlF/oQChBEXbwgByMnQLnJcAUmrCFHDTh4FhYNrZ5cIY2q5sLb4hDGuowhjzs4Qd/GMIgCnGERCyhEY8IOAxS8IgVZE8Kk2cfKI4viQ2UIRPAaxi3JQqxiXcDoBXtVbgVOlB/YzTgb9ZnRhWKL40axCIVQ/A/+sExgFwU1wvFeMchrjF8T8xfA/oYxz8Kko5sfCMh71XGDJZPkYvMoSH7V8VDLiCS15Nj9do4P0hiUl6NDCQlGfBJRoLrlKhMpSpXycpWuvKVsIylLGdJy1ra8pa4zKUud8nLXvryl8AMpjCHScxiGvOYyEymMpfJzGY685nQjKY0p0nNalrzmtjMpja3yc1uevOb4AynOMdJhwQAACH5BAUUAAQALDIAMgCcAJwAAAP/KLrcTjDKSWt0OFsIuv9gKI5kaZ6Ztq1s6iorKs90/apsTt1pbP/AIA+mK16Gj41wyWwan8ikpUmtRp/GaMNn7Xq3WJ2Wwf2arWHxmDg9u6np3JpdeduX8da8fO8j83xXSn6EQ4CDa4GFi2CHO3uIjJJkjo+JkZOTlZZjipmFmxNzAp6ffqESo6Wmd6hHl22sjK4ckLGyoLSqmLh9tAS7t72+urZ1QL+LycacNcuEz528M9HErsHHP9WtxbDZNtt24YbTMuNu5zerJulm7S7rJe9e8zjfzt2n+VrxJPVo+wQJo/GvSsFG9wgGFLeQ3EBqDdFFVFcOxUEnE1/0G3GR/0lHOs0UXss10ltIiCX1peRX8cRHIS83iniJLVRNUcgyfonZkp1Oej/tnTT3K87NSkdfgSuaJukhp8ByMsUCNQ/UIFPDVDXKDKe2rFC6IhWrFB/YIlubkq319awak5uuSnWrB+5Yu2VF0pUpBZXctnt7jhqMl63KhMMIU3z4hm9ixY4xMn6sGENkj4IpVyaVuctlzdImn/kMWiDixp1L/z08VPVm0lhTuw59WqLo2YNhz22NO7dsOL9789ANmLfwwlGhBT8Obzke58wtQ499O/qf6bu9WvddHWj37RqxF9cOHrky8ZvTs/wOkH2IwPDjy59Pv779+/jz69/Pv7////8ABijggAQWaOCBCCao4FQDNOjggxBGKOGEFFZooYQrBKDhhhx26OGHIIYo4ogfXmjiiSim6GCGJLbo4oswaqjijDTSyGKMOOYYY4089ljhjToGKWSJPhZpJJBDJimkkUz2iKSSUO7Y5JQqPhnllSRSqeWJVmLpJZFbhjlhl1+WKaOYaEJIpplfpulmg2uyieWbbsYpZ5R0pmnnnUrmieaefA7pp5iABhrkoGEWamiOiG6p6KJSNjrlo5C+KCmVlFba4qWTbqCpl5w2memnIvLIkwVB6mdqUBh6qqOqNZ5aQar5rbpSiqMGAKuNrEaY664zykoBrfjZ6lesruYIbJX/vaqZLI7L4trsg7/WiuytKFZb7LXH8orqq9Z6222wz8YYbbbTrlgujOdymS6c677YronCTkDsfcbaxO2w4G4rrr7/2tsvvvvGVbAE99qXr8EBIzywwgc7srDDyoZLLrbufluxv6EOUFTC9XWsLi0g0ycyvCQ/HPLJH6tsMsu/lDzfyR7H7PLMMKe8McEit7wzxD3b/PPKQesMrcWh+kxqnzm7sjSeTaPyNJQ0Kz31oVGHcnWSVQu9tY5dG/01jmE7PTbYWW9yNtpFm712pDQ3HMHbZEf8lN0E0A03sxjTG6/eIU4sMd6AW4q3VYQXvunhXMkNgeKLOw6I4I9DPiLlGZMnbnngjKsl+ealdq6V5qB7iDnin5f+YQIAIfkEBRQABAAsMgAyAJwAnAAAA/84utxOMMpJa3Q4Wyi6/2AojmRpnpm2rWzqKisqz3T9qmxO3Wls/8AgD6YrXoaPjXDJbBqfyKSlSa1Gn8Zow2fterdYnZbB/ZqtYfGYOD27qencml1525fx1rx87yPzfFdKfoRDgINrgYWLYIc7e4iMkmSOj4mRk5OVlmOKmYWbE3MDnp9+oRKjpaZ3qEeXbayMrhyQsbKgtKqYuH20BLu3vb66tnVAv4vJxpw1y4TPnbwz0cSuwcc/1a3FsNk223bhhtMy427nN6sm6WbtLusl717zON/O3af5WvEk9Wj7BAmj8a9KwUb3CAYUt5DcQGoN0UVUVw7FQScTX/QbcZH/SUc6zRReyzXSW0iIJfWl5FfxxEchLzeKeIktVE1RyDJ+idmSnU56P+2dNPcrzs1KR1+BK5om6SGnwHIyxQI1D9QgU8NUNcoMp7asULoiFasUH9giW5uSrfX1rBqTm65KdasH7li7ZUXSlSkFldy2e3uOGoyXrcqEwwhTfPiGb2LFjjEyfqwYQ2SPgilXJpW5y2XN0iaf+QxaIOLGnUv/PTxU9WbSWFO7Dn1aoujZg2HPbY07t2w4v3vz0A2Yt/DCUaEFPw5vOR7nzC1Dj307+p/pu71a910daPftGrEX1w4euTLxm9Oz/A6QfYjA8OPLn0+/vv37+PPr38+/v////wAGKOCABBZo4IEIJqjgVAE06OCDEEYo4YQUVmihhMQBoOGGHHbo4YcghsjhhSSWaOKJDmYo4oostqghijDGGKOKLtZo44sy5qgjhTTe6OOKOwYpZAA9/mikh0MmKWORRzYJgJJQnsikk0ZGaeWFU1Lp45VcTpilljZ2KeaDX4Lp4pholmkmi2iOqeaaIrYp5ptwgihnl3TWieSdV+ap54h8WunnnzgGCuWghBoaJaJ/KnooeoTW6KiSjOo5aZKV1pnjL5tCp1+nroBaG4ufLkmLqMaJWOqMp5rqXoerwsipq6OuGCuKs7L6Koe3StmqrrWqmh+qmxCbipG9mpirrP+eDktrKMbmVWOyJS6La7P4RXuItsn5SC2J1vq664bfYvkrs+NqWK6F4SqL7X3c5sHtketW2G6179oXbxzzIusssNA+S56N9fJ47rXpAlCwlweLG2yIC7fJU7aXkhnUhxGnebGHGbu5Maz/Vkzkx7yGXPHE8IrcIMr6qjzySgSbfCnL9bn8sl/+UqwyTZHeaDPPPUvqMtBBt/gzyUVvOTTSSYe5NMxNr3k01FGDOTXOVWv6NNZZS721TV3DaXO/YZu5bxpkl63l2WGkrbaTbGPh9ttHxv3E3HT/aLcReOfts8CV9O230AAXC7i0gxOOLiqCJ87m4dtC3q3jThceuOQElP+YAAAh+QQFFAAEACwyADIAnACcAAAD/xi63E4wyklrdDhbOLr/YCiOZGmKWcpsbEuoMHvOdG17sOruVJ7Kt6Aw6NPwjq/iYzNsOkvKJXIXbQCfWGx1NaVuFdesWPgFd13lQHjMpqXP6PK6TSe94ay7pc6HyvEbehV9hCGCgBOHE4WMHYqIEI8RjYySiJYElIWYeJiahJxwnp98oWejpHSmXaipbKtTra5isEiys1p/kIm6g7hjtUe3v03BPMM0uxTFvcpJX3M1zhLM0NORzYtD1xxDxl7We9vc1Vvcz+ZM49flVefIM+ftUe/Z1OvT80r14b5C8t7sQYJ3AiAZgZcQZsLnTF8RfunE/SMXsJ8zgiYMElHYSf9hE403vsWxqG0iu4oRp2EsAdKGyBYrSbSs8TKPR4bKHPqA6E6dyXwoe16LOWKmG46ibv5sGJQeN6IijM6oGUhpkHMdSe6CGgJrUq0Drd7wegppWbDdlpIFl/KiWBtrY5ll9VZaXGFz5aJdqPZu1b1Z25a86petUJV1kxUeKXhr4niLYaaZTFmKP03RjlbePDkzIc8nOIt+3Ae0idGonUrE7HNj6tc6WlMy7Qe2bcvLSNG2c7v3gt1tgKPw7Vv4GOMgiBeX3Qj5B+W9nWOR7gi6bepOsFu/zpyR9u2vsX/srhn8aPE47x00f578Z/eh2bdfPRv+afmi0fed1BQ/VzH/3/lXmX6E0eeSgAPaV0eACP6XBXaRRSjhhBRWaOGFGGao4YYcdujhhyCGKOKIJJZo4okopqjiimQB4OKLMMYo44w01mjjjTMSKMCOPPbo449ABinkkDgWaeSROOpI5JJMNonkk1BGqaSTVFYZ5ZVY3jillVx2meWXSG7p5Zhkgmmmi2KWqeaZbBqZ5ppwtilnjG/GaeecbNZ55554Yqknn4D2eeSfgRYqaI2EGqrooS8muiijkDr6KKSCSjoppXNaeimmeSq46aec2qgpqKH66SmpqJYKwKipqjroqa3yKVWSsP64oaknSVmrj7deOauWu/bYq665QgmhhrgCRexl/1UOayxFy+bGpbNP/ipqsDxSGya0zxropLavFlsttjuC6ya343rbpLlFWosouQKwS6u426rLpLzA0hsus1Tie62+59q7pL/vAtwuvATT6K7CCCPrK7r18vutw9Hm9LDARCacI8T7SmulxjIuvDHGQ4JMJ8cBS7wuxa6GjPK9LLcMo8i2xiwzmi8PbPPNNPO6s8w9C/tzy0FnO7SrRZd7tKpJx7t0qU2bzGjUT4fadKxYn2xw1lwfvHXXYDP8ddhkN5pz2WhfjTbQZ68dttpuM9123De7PDbddZvJatZUk4x3xbsk6/Hfa/atMuGCWww4f4gXPrfYhzferbKTDy554hmBXxz55R0rXvlgnGvO1OJphS665+luTncCADs=">
			</image>
		</view>
	</view>
</template>
<script>
	/**
	 * canvasId   canvas-id的名称
	 * auto		  自动渲染[设置成false需要手动redraw]
	 * styles   整个canvas的样式不能设置宽高和背景颜色
	 * backgroundColor canvas的背景颜色
	 * width 整个canvas的宽
	 * height 整个canvas的高
	 * unit   宽高的单位
	 * //整个vanvas描述
	 // elementList:{
	 // 	images:[//图片对象
	 // 		{
	 // 			path:"http://t6.xin.cn/uploads/20231113/a07068b23e1d4969d09f4105fee78631.png",//图片路径[必填]注意h5不能跨域下载图片，需处理跨域问题
	 // 			dx:0,//左上角x轴[必填]
	 // 			dy:0,//左上角y轴[必填]
	 // 			dWidth:'',//宽度[必填]
	 // 			dHeight:'',//高度[必填]
	 // 			sx:650/2,//绘画的宽度[选填]
	 // 			sy:860/2,//绘画的高度[选填]
	 // 		}
	 // 	],
	 // 	text:[//渲染文字
	 // 		{
	 // 			value:"邀请码：",//渲染的文字
	 // 			color:"#999999",//文字颜色[选填]
	 // 			size:"14",//大小[选填]
	 // 			font:"PingFang SC-Regular, PingFang SC;",//字体[选填]
	 // 			x:"13",//左上角x轴[必填]
	 // 			y:"460",//左上角y轴[必填]
	 // 			backgroundColor:"#ffffff"//背景色
	 // 			maxWidth:"",//字体最大宽度
	 // 			maxHeight:"",//字体最大高度
	 // 		},
	 // 	],
	 // 	qr:[//渲染的二维码
	 // 		{
	 // 			url:"http://t6.xin.cn/#/pages/user/code_login?invite_mobile=5",//二维码文字[必填]
	 // 			dx:241,//左上角x轴[必填]
	 // 			dy:452,//左上角y轴[必填]
	 // 			size:71,//二维码大小
	 // 			color:"#333333",//二维码前景色
	 // 			backgroundColor:"#ffffff"//二维码背景色
	 // 		}
	 // 	]
	 	
	 // }
	 */
	import UQRCode from '../../js_sdk/uqrcode/uqrcode';
	export default {
		name: "mu-canvas",
		data() {
			return {
				canvasContext: null,
				has: true,
				loading: false
			}
		},
		props: {
			canvasId: {
				type: String,
				default: "mu-canvas-id"
			},
			styles: {
				type:String,
				default:""
			},
			elementList: {
				type: Object,
				default: {}
			},
			auto: {
				type: Boolean,
				default: false
			},
			backgroundColor:{
				type:String,
				default:""
			},
			width:{
				type:Number,
				default:"200"
			},
			height:{
				type:Number,
				default:"200"
			},
			unit:{
				type:String,
				default:"px"
			}
		},
		watch: {
			elementList:{
				handler(newName,oldName){
					if (this.auto === true) {
						this.redraw();
					}
				}
			}
		},
		created() {
			let that = this;
			// console.log(that.auto);
			setTimeout(() => {
				if (that.auto === true) {
					that.redraw();
				}
				// console.log(that.styles);
			}, 300)

		},
		methods: {
			//开始绘制
			async redraw(callback) {
				console.log("开始绘制");
				this.loading = true;
				let that = this;
				//获取绘画对象
				let canvasContext = this.canvasContext
				if (canvasContext == null) {
					canvasContext = uni.createCanvasContext(this.canvasId, this);
					this.canvasContext = canvasContext;
				}
				if(this.backgroundColor){
					canvasContext.setFillStyle(this.backgroundColor)
					canvasContext.fillRect(0, 0, this.width, this.height)
				}
				//绘画图片
				if (this.elementList.images && this.elementList.images.length > 0) {
					let imges = this.elementList.images
					for (let imgindex in imges) {

						await this._drawImges(canvasContext, imges[imgindex])
					}
				}
				//绘画文字
				if (this.elementList.text && this.elementList.text.length > 0) {
					let texts = this.elementList.text
					// console.log(texts);
					for (let textindex in texts) {
						await this._drawTxt(canvasContext, texts[textindex])
					}
				}
				//绘画二维码
				if (this.elementList.qr && this.elementList.qr.length > 0) {
					let qrs = this.elementList.qr
					for (let qrindex in qrs) {
						await this._drowQr(canvasContext, qrs[qrindex])
					}
				}
				this.loading = false;
				canvasContext.draw(false, (e) => {
					// console.log(e);
					console.log("绘制结束");
					if (callback) {
						callback(e)
					}
				});
			},
			//绘制图片
			async _drawImges(canvasContext, imgObj) {
				console.log(imgObj);
				let temPath = ""
				if (imgObj.path) {
					temPath = await this._downloadImga(imgObj.path)
				}
				console.log(temPath);
				if (temPath == false) {
					return false;
				}

				let info = await this._fileInfo(temPath)
				// console.log(info);
				if (!imgObj.dHeight) {
					imgObj.dHeight = info.height
				}
				if (!imgObj.dWidth) {
					imgObj.dWidth = info.width
				}
				if (!imgObj.sHeight) {
					imgObj.sHeight = info.height
				}
				if (!imgObj.sWidth) {
					imgObj.sWidth = info.width
				}
				if(!imgObj.sx){
					imgObj.sx = 0
				}
				if(!imgObj.sy){
					imgObj.sy = 0
				}
				if(!imgObj.dx){
					imgObj.dx = 0
				}
				if(!imgObj.dy){
					imgObj.dy = 0
				}
				// console.log(imgObj);
				// canvasContext.drawImage(
				// 	temPath,
				// 	parseInt(imgObj.dx),
				// 	parseInt(imgObj.dy),
				// 	parseInt(imgObj.dWidth),
				// 	parseInt(imgObj.dHeight),
				// 	parseInt(imgObj.sx),
				// 	parseInt(imgObj.sy),
				// 	parseInt(imgObj.sWidth),
				// 	parseInt(imgObj.sHeight)
				// )
				canvasContext.drawImage(
					temPath,
					parseFloat(imgObj.sx),
					parseFloat(imgObj.sy),
					parseFloat(imgObj.sWidth),
					parseFloat(imgObj.sHeight),
					parseFloat(imgObj.dx),
					parseFloat(imgObj.dy),
					parseFloat(imgObj.dWidth),
					parseFloat(imgObj.dHeight)
				)
			},
			//绘制文字
			async _drawTxt(canvasContext, txtObj) {
				// console.log(txtObj);
				if (txtObj.color) {
					canvasContext.setFillStyle(txtObj.color)
				}
				if (!txtObj.size) {
					txtObj.size = 10
				}
				canvasContext.setFontSize(parseFloat(txtObj.size))
				if (txtObj.align) {
					canvasContext.setTextAlign(txtObj.align)
				}
				if (txtObj.font) {
					canvasContext.font = txtObj.font
				}
				if (!txtObj.maxWidth) {
					txtObj.maxWidth = null
				}
				if (!txtObj.maxHeight) {
					txtObj.maxHeight = null
				}
				if (txtObj.backgroundColor) {
					let width = parseFloat(txtObj.size) * txtObj.value.length
					let height = parseFloat(txtObj.size)
					if (txtObj.maxWidth) {
						width = txtObj.maxWidth
					}
					if (txtObj.maxHeight) {
						height = txtObj.maxHeight
					}
					canvasContext.setFillStyle(txtObj.backgroundColor)
					canvasContext.fillRect(parseFloat(txtObj.x), parseFloat(txtObj.y) - parseFloat(txtObj.size), width,
						height)
				}
				// console.log(txtObj);
				canvasContext.fillText(txtObj.value, parseFloat(txtObj.x), parseFloat(txtObj.y))


			},
			//绘画二维码
			async _drowQr(canvasContext, qrObj) {
				const qr = new UQRCode();
				qr.setOptions({
					data: qrObj.url,
					size: qrObj.size
				})

				let qrCanvas = uni.createCanvasContext("QR_CODE", this);
				qr.make()
				if (qrObj.backgroundColor) {
					canvasContext.setFillStyle(qrObj.backgroundColor)
					canvasContext.fillRect(qrObj.dx ? qrObj.dx : 0, qrObj.dy ? qrObj.dy : 0, qrObj.size, qrObj.size)
				}
				let modules = qr.modules;

				// console.log(qrObj.dx?qrObj.dx:0);
				for (let row = 0; row < modules.length; row++) {
					for (let col = 0; col < modules[row].length; col++) {
						let x = (qrObj.dx ? qrObj.dx : 0) + modules[row][col].x
						let y = (qrObj.dy ? qrObj.dy : 0) + modules[row][col].y
						let w = modules[row][col].width
						let h = modules[row][col].height
						let color = modules[row][col].color
						if (color == "#000000") {
							if (qrObj.color) {
								color = qrObj.color
							}
						}
						// let color = qrObj.color?qrObj.color:modules[row][col].color
						// console.log(color);
						canvasContext.setFillStyle(color)
						canvasContext.fillRect(x, y, w, h)
					}
				}
			},
			//下载文件
			async _downloadImga(path) {
				// #ifndef H5
				try{
					let res = await uni.downloadFile({
						url: path,
						method:"GET",
					})
					
					if (res.statusCode == 200) {
						return res.tempFilePath;
					}
				}catch{
					return false;
				}
				
				// #endif
				// #ifdef H5
				return path
				// #endif
				return false;
			},
			//获取文件详情
			async _fileInfo(temPath) {
				let res = await uni.getImageInfo({
					src: temPath
				})
				if (res.errMsg == "getImageInfo:ok") {
					return {
						width: res.width,
						height: res.height
					}
				}
				return false;
			},
			//获取图片路径(有可能是base64)
			async getImgSrc() {
				let res = await uni.canvasToTempFilePath({
					canvasId: this.canvasId
				},this);
				if (res.tempFilePath) {
					return res.tempFilePath
				}
				return false;
			},
			async saveImg() {
				uni.canvasToTempFilePath({
					canvasId: this.canvasId,
					success(res) {
						let tempFilePath = res.tempFilePath;
						// #ifndef H5
						uni.saveImageToPhotosAlbum({
							filePath: tempFilePath,
							success(res) {
								uni.showToast({
									title: '保存成功',
									icon: 'none'
								})
							},
							fail(err) {
								uni.showToast({
									title: '保存失败',
									icon: 'none'
								})
								console.log('err', err);
							}
						});
						// #endif
						// #ifdef H5
						var arr = res.tempFilePath.split(',');
						var bytes = atob(arr[1]);
						let ab = new ArrayBuffer(bytes.length);
						let ia = new Uint8Array(ab);
						for (let i = 0; i < bytes.length; i++) {
							ia[i] = bytes.charCodeAt(i);
						}
						var blob = new Blob([ab], {
							type: 'application/octet-stream'
						});
						var url = URL.createObjectURL(blob);
						var a = document.createElement('a');
						a.href = url;
						a.download = new Date().valueOf() + ".png";
						var e = document.createEvent('MouseEvents');
						e.initMouseEvent('click', true, false, window, 0, 0, 0,
							0, 0, false, false, false, false, 0, null);
						a.dispatchEvent(e);
						URL.revokeObjectURL(url);

						// #endif
					},
					fail(err) {
						
						uni.showToast({
							icon: "none",
							title: "下载海报失败"
						})
						console.log('err', err);
					}
				},this)
			}
		}
	}
</script>
<style lang="scss">
	.uqrcode-makeing-image {
		/* #ifndef APP-NVUE */
		display: block;
		max-width: 120px;
		max-height: 120px;
		/* #endif */

	}

	.uqrcode-makeing {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;

	}

	// .uqrcode-makeing {
	//   // position: absolute;
	//   top: 0;
	//   right: 0;
	//   bottom: 0;
	//   left: 0;
	//   z-index: 10;
	//   /* #ifndef APP-NVUE */
	//   display: flex;
	//   /* #endif */
	//   justify-content: center;
	//   align-items: center;
	// }
</style>