let uposter = {
	// 产品海报
	goods: {
		width: '750rpx',
		height: '1114rpx',
		background: '#ff6a6c',
		views: [{
				type: 'view',
				css: {
					left: '40rpx',
					top: '144rpx',
					background: '#fff',
					radius: '30rpx',
					width: '670rpx',
					height: '900rpx',
					shadow: '0 20rpx 48rpx rgba(0,0,0,.05)'
				}
			},
			// 1. 会员头像
			// {
			// 	type: 'image',
			// 	src: 'https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLj1JIHX0icWAu4Jw920k6ZIAqNd9ZfHLalqWsweMLphLrcwRJCYr0hcyeY6Y5Kyaqibl6icTAykDWRA/132',
			// 	mode: 'widthFix',
			// 	css: {
			// 		left: '50rpx',
			// 		top: '40rpx',
			// 		width: '84rpx',
			// 		height: '84rpx',
			// 		radius: '50%',
			// 		color: '#999',
			// 		shadow: '0px 0px 7px #f0f0f0'
			// 	}
			// },
			// 2. 会员名称
			{
				type: 'text',
				text: 'Usecloud',
				css: {
					color: '#fff',
					left: '154rpx',
					top: '40rpx',
					fontSize: '32rpx',
					fontWeight: 'bold'
				}
			},
			{
				type: 'text',
				text: '为您挑选了一个好物',
				css: {
					color: '#fff',
					left: '154rpx',
					top: '90rpx',
					fontSize: '24rpx'
				}
			},
			// 4. 产品图
			{
				type: 'image',
				src: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-7e00db99-ad65-4b9f-a74b-61bccb92b124/11bd19fa-6a70-49fd-9e71-72950828f6a8.jpg',
				mode: 'widthFix',
				css: {
					left: '72rpx',
					top: '176rpx',
					width: '606rpx',
					height: '606rpx',
					radius: '12rpx'
				}
			},
			{
				type: 'text',
				text: '￥',
				css: {
					color: '#ff6a6c',
					left: '70rpx',
					top: '840rpx',
					fontSize: '26rpx',
				}
			},
			// 6. 产品价格
			{
				type: 'text',
				text: '1339.90',
				css: {
					color: '#ff6a6c',
					left: '94rpx',
					top: '812rpx',
					fontSize: '56rpx',
					fontWeight: 'bold'
				}
			},
			// 7. 产品介绍
			{
				type: 'text',
				text: '小米10 Xiaomi/小米手机小米10手机骁龙865 1亿像素双模5G官方正品 骁龙865旗舰处理器 1亿像素8K电影相机',
				css: {
					maxLines: 2,
					width: '450rpx',
					color: '#333',
					left: '76rpx',
					top: '908rpx',
					fontSize: '30rpx',
					lineHeight: '50rpx'
				}
			},
			// 8. 产品二维码
			// {
			// 	type: 'image',
			// 	src: '',
			// 	mode: 'widthFix',
			// 	css: {
			// 		left: '545rpx',
			// 		top: '875rpx',
			// 		width: '135rpx',
			// 		height: '135rpx',
			// 		background: '#fff'
			// 	}
			// },
			{
				type: 'view',
				css: {
					top: '1040rpx',
					height: '100rpx',
					background: '#ff6a6c'
				}
			},
			{
				type: 'view',
				css: {
					left: '190rpx',
					top: '1078rpx',
					border: '1px solid #fff',
					width: '70rpx'
				}
			},
			{
				type: 'text',
				text: '用云 · 让开发更简单',
				css: {
					color: '#fff',
					left: '276rpx',
					top: '1060rpx',
					fontSize: '24rpx',
				}
			},
			{
				type: 'view',
				css: {
					left: '496rpx',
					top: '1078rpx',
					border: '1px solid #fff',
					width: '64rpx'
				}
			}
		]
	},
	// 产品海报数据
	getGoodsData: function(member, goods, qrcode) {
		// // 会员头像
		// this.goods.views[1].src = member.member_headimg;
		// // 会员名称
		// this.goods.views[2].text = member.member_nickname;
		// // 产品图
		// this.goods.views[4].src = goods.img;
		// // 产品价格
		// this.goods.views[6].text = '' + goods.price / 100;
		// // 产品名称
		// this.goods.views[7].text = goods.name + ' ' + goods.name_pw;

		// 二维码
		// this.goods.views[8].src = qrcode;
		return this.goods;
	},

	goods2: {
            css: {
                width: "750rpx",
                paddingBottom: "40rpx",
                background: "linear-gradient(,#000 0%, #ff5000 100%)"
            },
            views: [
                {
                    src: "/static/images/80x80.png",
                    type: "image",
                    css: {
                        background: "#fff",
                        objectFit: "cover",
                        marginLeft: "40rpx",
                        marginTop: "40rpx",
                        width: "84rpx",
                        border: "2rpx solid #fff",
                        boxSizing: "border-box",
                        height: "84rpx",
                        borderRadius: "50%"
                    }
                },
                {
                    type: "view",
                    css: {
                        marginTop: "40rpx",
                        paddingLeft: "20rpx",
                        display: "inline-block"
                    },
                    views: [
                        {
                            text: "豆豆学Pro",
                            type: "text",
                            css: {
                                display: "block",
                                paddingBottom: "10rpx",
                                color: "#fff",
                                fontSize: "32rpx",
                                fontWeight: "bold"
                            }
                        },
                        {
                            text: "为您推荐",
                            type: "text",
                            css: {
                                color: "rgba(255,255,255,.7)",
                                fontSize: "24rpx"
                            },
                        }
                    ],
                },
                {
                    css: {
                        marginLeft: "40rpx",
                        marginTop: "30rpx",
                        padding: "32rpx",
                        boxSizing: "border-box",
                        background: "#fff",
                        borderRadius: "16rpx",
                        width: "670rpx",
                        boxShadow: "0 20rpx 58rpx rgba(0,0,0,.15)"
                    },
                    views: [
                        {
                            src: "https://m.360buyimg.com/babel/jfs/t1/196317/32/13733/288158/60f4ea39E6fb378ed/d69205b1a8ed3c97.jpg",
                            type: "image",
                            css: {
                                objectFit: "contain",
                                objectPosition: "50% 50%",
                                width: "606rpx",
                                height: "506rpx"
                            },
                        }, {
                            css: {
                                marginTop: "32rpx",
                                color: "#FF0000",
                                fontWeight: "bold",
                                fontSize: "28rpx",
                                lineHeight: "1em"
                            },
                            views: [{
                                text: "￥",
                                type: "text",
                                css: {
                                    verticalAlign: "bottom"
                                },
                            }, {
                                text: "39",
                                type: "text",
                                css: {
                                    verticalAlign: "bottom",
                                    fontSize: "58rpx"
                                },
                            }, {
                                text: "￥59.99",
                                type: "text",
                                css: {
                                    verticalAlign: "bottom",
                                    paddingLeft: "10rpx",
                                    fontWeight: "normal",
                                    // textDecoration: "line-through",
                                    color: "#999999"
                                }
                            }],

                            type: "view"
                        }, {
                            css: {
                                marginTop: "32rpx",
                                fontSize: "26rpx",
                                color: "#8c5400"
                            },
                            views: [{
                                text: "自营",
                                type: "text",
                                css: {
                                    color: "#212121",
                                    background: "#ffb400"
                                },
                            }, {
                                text: "超高好评",
                                type: "text",
                                css: {
                                    marginLeft: "16rpx",
                                    background: "#fff4d9"
                                },
                            }],

                            type: "view"
                        }, {
                            css: {
                                marginTop: "30rpx"
                            },
                            views: [
                                {
                                    text: "360儿童电话手表9X 智能语音问答定位支付手表 4G全网通20米游泳级防水视频通话拍照手表男女孩星空蓝",
                                    type: "text",
                                    css: {
                                        paddingRight: "32rpx",
                                        boxSizing: "border-box",
                                        lineClamp: 4,
                                        color: "#333333",
                                        lineHeight: "1.8em",
                                        fontSize: "28rpx",
                                        width: "406rpx"
                                },
                            }, {
								// 使用生成 二维码
                                text: "https://a.app.qq.com/o/simple.jsp?pkgname=uni.doudouxue&fromcase=70051&g_f=1182517&scenevia=XQYFX",
                                type: "qrcode",
                                css: {
                                    width: "198rpx",
                                    height: "198rpx",
                                },
								
								// 使用固定 二维码
								// src: "/static/images/qrcode.jpg",
								// type: "image",
								// css: {
								//     width: "198rpx",
								//     height: "198rpx"
								// },

                            }],
                            type: "view"
                        }],
                    type: "view"
                }
            ]
        },
	getGoodsData2: function(member, goods, qrcode) {
		// // 会员头像
		// this.goods.views[1].src = member.member_headimg;
		// // 会员名称
		// this.goods.views[2].text = member.member_nickname;
		let tmpTxt = '（来自：小程序“豆豆学Pro”）'
		if (goods.requestType == 1) {
			tmpTxt = '免费为您推荐教员' + tmpTxt
		} else if (goods.requestType == 2) {
			tmpTxt = '免费为您推荐学员' + tmpTxt
		} else {
			tmpTxt = '免费为您推荐自习室' + tmpTxt
		}
		this.goods2.views[1].views[1].text = tmpTxt;
		// // 产品图
		this.goods2.views[2].views[0].src = goods.img;
		// // 产品价格
		this.goods2.views[2].views[1].views[1].text = '' + goods.price / 100;
		// // 产品名称
		this.goods2.views[2].views[1].views[2].text = '' + goods.name;
		
		
		this.goods2.views[2].views[2].views[0].text = '' + goods.school;
		this.goods2.views[2].views[2].views[1].text = goods.tags.filter(tag => tag !== goods.school).join(" ");
		
		// 详情和二维码
		// 先剔除首尾的空白字符（包括换行符）
		  const trimmed = goods.description.trim();
		  
		  // 替换中间的换行符为空格
		  // 使用正则表达式 /[\r\n]+/g 匹配一个或多个连续的换行符
		  const desc = trimmed.replace(/[\r\n]+/g, ' ');
		this.goods2.views[2].views[3].views[0].text = desc;
		// this.goods2.views[2].views[2].views[0].text = '' + goods.school;

		// 二维码
		this.goods2.views[2].views[3].views[1].text = qrcode;
		return this.goods2;
	},

	// 会员海报
	member: {

	},
	// 分销商海报
	fxs: {

	},

};

export default uposter;