export default function (){
	return {
		sendVal: '',
		footerFlag: false,
		scrollToId: 'y-chat-last',
		freshing: false,
		triggered: true,
		hideBoxHeight: 0,
		showBoxHeight: 0,
		aiTeacherAvator: '/static/images/user/aiteacher.jpg',
		defaultSheet: [
			{
				img: '',
				icon: 'camera',
				name: '拍摄',
				default: 'playCamera'
			},
			{
				img: '',
				icon: 'photo',
				name: '相册',
				default: 'playPhoto'
			}
		],
		placeholderText: '发消息...',
		focus: false,
		aiChatImgUrl: '',
		list: [
			{
				userId: 1,
				id: 1,
				name: '白',
				message: '',
				time: new Date().getTime(),
				avator: '',
				img: 'https://mp-0fe42d5b-82e4-482d-8ad1-81bb97905319.cdn.bspapp.com/default_pic/huaxue_2.webp'
			},
			{
				userId: 2,
				id: 2,
				name: '黑',
				message: '',
				time: new Date().getTime(),
				avator: '',
				img: require('@/static/ces.png')
			},
			{
				userId: 1,
				id: 3,
				name: '白',
				message: '君不见昔时燕家重郭隗，拥篲折节无嫌猜',
				time: new Date().getTime(),
				avator: '',
				tagLabel: 'libai'
			},
			{
				userId: 2,
				id: 4,
				name: '黑',
				message: '醉卧沙场君莫笑，古来征战几人回',
				time: new Date().getTime(),
				avator: '',
				tagLabel: 'wanghan'
			},
			{
				userId: 1,
				id: 5,
				name: '白',
				message: '报君黄金台上意，提携玉龙为君死',
				time: new Date().getTime(),
				avator: '',
				tagLabel: 'lihe'
			},
			{
				userId: 2,
				id: 6,
				name: '黑',
				message: '马上相逢无纸笔，凭君传语报平安',
				time: new Date().getTime(),
				avator: '',
				tagLabel: 'censhen'
			},
			{
				userId: 1,
				id: 7,
				name: '白',
				message: '缓歌谩舞凝丝竹，尽日君王看不足',
				time: new Date().getTime(),
				avator: '',
				tagLabel: 'baijvyi'
			},
			{
				userId: 2,
				id: 8,
				name: '黑',
				message: '此时相望不相闻，愿逐月华流照君',
				time: new Date().getTime(),
				avator: '',
				tagLabel: 'zhangruoxu'
			},
			{
				userId: 1,
				id: 9,
				msgId: 'last',
				name: '白',
				message: '几回魂梦与君同 ',
				time: new Date().getTime(),
				avator: '',
				tagLabel: 'yanjidao'
			}
		],
		
		textShowFlag: true,
		audioFlag: false,
		y: 0,
		readyCloseAudio: false,

		tagOptions: {
			'lin':{
				text: '山园小梅·其一',
				bgColor: '#ff4100',
				color: '#fff'
			},
			'mao': {
				text: '菩萨蛮',
				bgColor: '#7d7dff',
				color: '#fff'
			},
			'li': {
				text: '渔歌子·荻花秋',
				bgColor: '#fddc71',
				color: '#fff'
			},
			'jiang': {
				text: '湘月·五湖旧约',
				bgColor: '#f86b2f',
				color: '#fff'
			},
			'jiang1':{
				text: '水龙吟·夜深客子移舟处',
				bgColor: '#f86b2f',
				color: '#fff'
			},
			'jiang2':{
				text: '八归·湘中送胡德华',
				bgColor: '#d4943b',
				color: '#fff'
			},
			'yuan': {
				text: '夜过借园见主人坐月下吹笛',
				bgColor: '#e06c75',
				color: '#fff'
			},
			'gu': {
				text: '浣溪沙',
				bgColor: '#42a5f5',
				color: '#fff'
			},
			'wen': {
				text: '初秋寄友人',
				bgColor: '#465e7d',
				color: '#fff'
			},
			'wu': {
				text: '暗香疏影·夹钟宫赋墨梅',
				bgColor: '#e9a5b4',
				color: '#fff'
			},
			'libai': {
				text: '行路难·其二',
				bgColor: '#e9a5b4',
				color: '#fff'
			},
			'wanghan': {
				text: '凉州词二首·其一',
				bgColor: '#465e7d',
				color: '#fff'
			},
			'lihe': {
				text: '雁门太守行',
				bgColor: '#f86b2f',
				color: '#fff'
			},
			'censhen': {
				text: '逢入京使',
				bgColor: '#42a5f5',
				color: '#fff'
			},
			'baijvyi': {
				text: '长恨歌',
				bgColor: '#ff4100',
				color: '#fff'
			},
			'zhangruoxu': {
				text: '春江花月夜',
				bgColor: '#7d7dff',
				color: '#fff'
			},
			'yanjidao': {
				text: '鹧鸪天·彩袖殷勤捧玉钟',
				bgColor: '#d4943b',
				color: '#fff'
			}
		},
		defaultOptions: {
			userId: 'userId',
			msgId: 'id',
			name: 'name',
			message: 'message',
			img: 'img',
			time: 'time',
			avator: 'avator',
			tagLabel: 'tagLabel'
		},
		aiRequestId: 'h7DyIa09oLpRn-3yI_aaq'
	}
}