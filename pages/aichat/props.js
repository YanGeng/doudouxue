export default {
	// 自己的userId => 用于判断自己和别人
	userId: {
		type: String | Number,
		default: 1
	},
	// 更新的消息
	updateList: {
		type: Array | Object,
		default:() => []
	},
	// 消息列表
	messageList: {
		type: Array,
		default:() => []
	},
	// 標簽颜色配置項
	// tagOptions: {
	// 	type: Object,
	// 	default: () => {}
	// },
	// 列表key配置项
	// defaultOptions: {
	// 	type: Object,
	// 	default:() => (
	// 		{
	// 			userId: 'userId',
	// 			msgId: 'msgId',
	// 			name: 'name',
	// 			message: 'message',
	// 			img: 'img',
	// 			time: 'time',
	// 			avator: 'avator',
	// 			tagLabel: 'tagLabel'
	// 		}
	// 	)
	// },
	// 是否使用下拉
	useRefresh: {
		type: Boolean,
		default: true
	},
	// 图标大小
	iconSize: {
		type: String | Number,
		default: 30
	},
	// 自定义功能列表
	sheetList: {
		type: Array,
		default: () => []
	},
	// 是否保留默认自定义功能
	retainSheet: {
		type: Boolean,
		default: true
	},
	// 是否在点击加号后聊天列表移动到最下方
	useScrollBottom: {
		type: Boolean,
		default: true
	},
	// 显示时间的间隔	单位/毫秒
	intervalTime: {
		type: Number,
		default: 300000
	},
	// 默认头像
	defaultAvator: {
		type: String,
		default: 'https://mp-0fe42d5b-82e4-482d-8ad1-81bb97905319.cdn.bspapp.com/default_pic/yinyue_4.webp'
	},
	bannedToPost: {
		type: Boolean,
		default: false
	},
	value: {
		type: String,
		default: ''
	}
}