'use strict';

const uidObj = require('uni-id');
const {
	Controller
} = require('uni-cloud-router');
const dbcmd = uniCloud.database().command;

module.exports = class GoodsController extends Controller {
	// 删除商品
	async deleteGoods() {
		const {
			// 商品信息 usemall-goods
			_id,
		} = this.ctx.data;

		await this.db.collection('usemall-goods').doc(_id).remove();
		await this.db.collection('usemall-goods-detail').doc(_id).remove();

		let response = {
			code: 1
		};
		response.datas = [];
		response.code = 0;
		response.msg = `删除成功`;
		return response;
	}

	// 更新商品
	async updateNewGoods() {
		const {
			// 商品信息 usemall-goods
			_id,
			consignee,
			mobile,
			name,
			cid,
			cids,
			create_uid,
			create_time,
			last_modify_uid,
			// last_modify_time,
			price,
			catetories,
			stock_num,
			sort,
			hot,
			state,
			version,
			is_delete,
			img,
			imgs,
			tags,
			description,
			detail_imgs,
			school,
			shoukeType,
			city_name,
			area_name,
			requestType,
			addressId,
			link,
			// 商品详情信息 usemall-goods-detail
			desc_mobile,
			// 商品sku信息 usemall-goods-sku
		} = this.ctx.data;

		let uid = '';
		if (this.ctx.event.uniIdToken) {
			// 已登录，获取当前登录 uid
			const user = await uidObj.checkToken(this.ctx.event.uniIdToken);
			if (user.code == 0) {
				uid = user.uid;
			}
		}

		let new_last_modify_time = new Date().getTime();

		let newPrice = price;
		this.db.collection('usemall-goods').doc(_id).update({
			consignee: consignee,
			mobile: mobile,
			name: name,
			cid: cid,
			cids: cids,
			version: version + 1,
			last_modify_uid: uid,
			last_modify_time: new_last_modify_time,
			price: newPrice,
			market_price: newPrice,
			img: img,
			imgs: imgs,
			tags: tags,
			catetories: catetories,
			state: state,
			sort: sort,
			hot: hot,
			stock_num: stock_num,
			description: description,
			detail_imgs: detail_imgs,
			school: school,
			shoukeType: shoukeType,
			city_name: city_name,
			area_name: area_name,
			requestType: requestType,
			addressId: addressId,
			link: link,
		});

		this.db.collection('usemall-goods-detail').doc(_id).update({
			goods_id: _id,
			version: version + 1,
			is_delete: is_delete,
			create_uid: uid,
			desc_mobile: desc_mobile,
			create_time: create_time,
			last_modify_uid: uid,
			last_modify_time: new_last_modify_time
		}).then(res => {
			if (res && res.updated <= 0) {
				// this.db.collection('usemall-goods-detail').add({
				// 	_id: _id,
				// 	goods_id: _id,
				// 	version: 1,
				// 	is_delete: 0,
				// 	create_uid: uid,
				// 	desc_mobile: desc_mobile,
				// 	create_time: create_time,
				// 	last_modify_uid: uid,
				// 	last_modify_time: new_last_modify_time
				// });
			}
		});

		let response = {
			code: 1
		};
		response.datas = [];
		response.code = 0;
		response.msg = `更新成功`;
		return response;
	}

	// 创建商品
	async createNewGoods() {
		const {
			// 商品信息 usemall-goods
			consignee,
			mobile,
			name,
			cid,
			cids,
			price,
			stock_num,
			sort,
			state,
			version,
			is_delete,
			img,
			imgs,
			tags,
			description,
			detail_imgs,
			school,
			shoukeType,
			city_name,
			area_name,
			requestType,
			catetories,
			link,
			// 商品详情信息 usemall-goods-detail
			desc_mobile,
			addressId,
			// 商品sku信息 usemall-goods-sku
		} = this.ctx.data;

		// 默认首页图片
		let yuwen = [
			"https://mp-0fe42d5b-82e4-482d-8ad1-81bb97905319.cdn.bspapp.com/default_pic/yuwen_1.webp",
			"https://mp-0fe42d5b-82e4-482d-8ad1-81bb97905319.cdn.bspapp.com/default_pic/yuwen_2.webp",
			"https://mp-0fe42d5b-82e4-482d-8ad1-81bb97905319.cdn.bspapp.com/default_pic/yuwen_3.webp",
			"https://mp-0fe42d5b-82e4-482d-8ad1-81bb97905319.cdn.bspapp.com/default_pic/yuwen_4.webp"
		];
		let shuxue = [
			"https://mp-0fe42d5b-82e4-482d-8ad1-81bb97905319.cdn.bspapp.com/default_pic/shuxue_1.webp",
			"https://mp-0fe42d5b-82e4-482d-8ad1-81bb97905319.cdn.bspapp.com/default_pic/shuxue_2.webp",
			"https://mp-0fe42d5b-82e4-482d-8ad1-81bb97905319.cdn.bspapp.com/default_pic/shuxue_3.webp",
			"https://mp-0fe42d5b-82e4-482d-8ad1-81bb97905319.cdn.bspapp.com/default_pic/shuxue_4.webp"
		];
		let yingyu = [
			"https://mp-0fe42d5b-82e4-482d-8ad1-81bb97905319.cdn.bspapp.com/default_pic/yingyu_1.webp",
			"https://mp-0fe42d5b-82e4-482d-8ad1-81bb97905319.cdn.bspapp.com/default_pic/yingyu_2.webp",
			"https://mp-0fe42d5b-82e4-482d-8ad1-81bb97905319.cdn.bspapp.com/default_pic/yingyu_3.webp",
			"https://mp-0fe42d5b-82e4-482d-8ad1-81bb97905319.cdn.bspapp.com/default_pic/yingyu_4.webp"
		];
		let wuli = [
			"https://mp-0fe42d5b-82e4-482d-8ad1-81bb97905319.cdn.bspapp.com/default_pic/wuli_1.webp",
			"https://mp-0fe42d5b-82e4-482d-8ad1-81bb97905319.cdn.bspapp.com/default_pic/wuli_2.webp",
			"https://mp-0fe42d5b-82e4-482d-8ad1-81bb97905319.cdn.bspapp.com/default_pic/wuli_3.webp",
			"https://mp-0fe42d5b-82e4-482d-8ad1-81bb97905319.cdn.bspapp.com/default_pic/wuli_4.webp"
		];
		let huaxue = [
			"https://mp-0fe42d5b-82e4-482d-8ad1-81bb97905319.cdn.bspapp.com/default_pic/huaxue_1.webp",
			"https://mp-0fe42d5b-82e4-482d-8ad1-81bb97905319.cdn.bspapp.com/default_pic/huaxue_2.webp",
			"https://mp-0fe42d5b-82e4-482d-8ad1-81bb97905319.cdn.bspapp.com/default_pic/huaxue_3.webp",
			"https://mp-0fe42d5b-82e4-482d-8ad1-81bb97905319.cdn.bspapp.com/default_pic/huaxue_4.webp"
		];
		let yinyue = [
			"https://mp-0fe42d5b-82e4-482d-8ad1-81bb97905319.cdn.bspapp.com/default_pic/yinyue_1.webp",
			"https://mp-0fe42d5b-82e4-482d-8ad1-81bb97905319.cdn.bspapp.com/default_pic/yinyue_2.webp",
			"https://mp-0fe42d5b-82e4-482d-8ad1-81bb97905319.cdn.bspapp.com/default_pic/yinyue_3.webp",
			"https://mp-0fe42d5b-82e4-482d-8ad1-81bb97905319.cdn.bspapp.com/default_pic/yinyue_4.webp"
		];
		let meishu = [
			"https://mp-0fe42d5b-82e4-482d-8ad1-81bb97905319.cdn.bspapp.com/default_pic/meishu_1.webp",
			"https://mp-0fe42d5b-82e4-482d-8ad1-81bb97905319.cdn.bspapp.com/default_pic/meishu_2.webp",
			"https://mp-0fe42d5b-82e4-482d-8ad1-81bb97905319.cdn.bspapp.com/default_pic/meishu_3.webp",
			"https://mp-0fe42d5b-82e4-482d-8ad1-81bb97905319.cdn.bspapp.com/default_pic/meishu_4.webp"
		];
		let shufa = [
			"https://mp-0fe42d5b-82e4-482d-8ad1-81bb97905319.cdn.bspapp.com/default_pic/shufa_1.webp",
			"https://mp-0fe42d5b-82e4-482d-8ad1-81bb97905319.cdn.bspapp.com/default_pic/shufa_2.webp",
			"https://mp-0fe42d5b-82e4-482d-8ad1-81bb97905319.cdn.bspapp.com/default_pic/shufa_3.webp",
			"https://mp-0fe42d5b-82e4-482d-8ad1-81bb97905319.cdn.bspapp.com/default_pic/shufa_4.webp"
		]
		let other = [
			"https://mp-0fe42d5b-82e4-482d-8ad1-81bb97905319.cdn.bspapp.com/default_pic/other_1.webp",
			"https://mp-0fe42d5b-82e4-482d-8ad1-81bb97905319.cdn.bspapp.com/default_pic/other_2.webp",
			"https://mp-0fe42d5b-82e4-482d-8ad1-81bb97905319.cdn.bspapp.com/default_pic/other_3.webp",
			"https://mp-0fe42d5b-82e4-482d-8ad1-81bb97905319.cdn.bspapp.com/default_pic/other_4.webp"
		];

		let imgTmp = img;
		let imgsTmp = imgs;
		if (cids && cids.length > 0 && (!imgs || imgs.length <= 0)) {
			for (let tag of cids) {
				if (tag == 10002) {
					imgTmp = !imgTmp || imgTmp == "" ? yuwen[Math.floor(Math.random() * 10) % 4] : imgTmp;
					let imgNote = {
						url: yuwen[Math.floor(Math.random() * 10) % 4]
					};
					imgsTmp.push(imgNote);
				} else if (tag == 10003) {
					imgTmp = !imgTmp || imgTmp == "" ? shuxue[Math.floor(Math.random() * 10) % 4] : imgTmp;
					let imgNote = {
						url: shuxue[Math.floor(Math.random() * 10) % 4]
					};
					imgsTmp.push(imgNote);
				} else if (tag == 10004) {
					imgTmp = !imgTmp || imgTmp == "" ? yingyu[Math.floor(Math.random() * 10) % 4] : imgTmp;
					let imgNote = {
						url: yingyu[Math.floor(Math.random() * 10) % 4]
					};
					imgsTmp.push(imgNote);
				} else if (tag == 10005) {
					imgTmp = !imgTmp || imgTmp == "" ? wuli[Math.floor(Math.random() * 10) % 4] : imgTmp;
					let imgNote = {
						url: wuli[Math.floor(Math.random() * 10) % 4]
					};
					imgsTmp.push(imgNote);
				} else if (tag == 10006) {
					imgTmp = !imgTmp || imgTmp == "" ? huaxue[Math.floor(Math.random() * 10) % 4] : imgTmp;
					let imgNote = {
						url: huaxue[Math.floor(Math.random() * 10) % 4]
					};
					imgsTmp.push(imgNote);
				} else if (tag == 10007) {
					imgTmp = !imgTmp || imgTmp == "" ? yinyue[Math.floor(Math.random() * 10) % 4] : imgTmp;
					let imgNote = {
						url: yinyue[Math.floor(Math.random() * 10) % 4]
					};
					imgsTmp.push(imgNote);
				} else if (tag == 10008) {
					imgTmp = !imgTmp || imgTmp == "" ? meishu[Math.floor(Math.random() * 10) % 4] : imgTmp;
					let imgNote = {
						url: meishu[Math.floor(Math.random() * 10) % 4]
					};
					imgsTmp.push(imgNote);
				} else {
					imgTmp = !imgTmp || imgTmp == "" ? other[Math.floor(Math.random() * 10) % 4] : imgTmp;
					let imgNote = {
						url: other[Math.floor(Math.random() * 10) % 4]
					};
					imgsTmp.push(imgNote);
				}
			}
		}

		let goods_id = (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1) + (((1 + Math.random()) *
				0x10000) | 0).toString(16).substring(1) + (((1 + Math.random()) * 0x10000) | 0).toString(16)
			.substring(1) + (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
		let uid = '';
		if (this.ctx.event.uniIdToken) {
			// 已登录，获取当前登录 uid
			const user = await uidObj.checkToken(this.ctx.event.uniIdToken);
			if (user.code == 0) {
				uid = user.uid;
			}
		}

		let create_time = new Date().getTime();
		// let tagsTmp = tags;
		// tags.push("极速退款");
		let newPrice = price;
		this.db.collection('usemall-goods').add({
			_id: goods_id,
			consignee: consignee,
			mobile: mobile,
			name: name,
			cid: cid,
			cids: cids,
			version: version,
			create_uid: uid,
			create_time: create_time,
			last_modify_uid: uid,
			last_modify_time: create_time,
			price: newPrice,
			market_price: newPrice,
			img: imgTmp,
			imgs: imgsTmp,
			tags: tags,
			catetories: catetories,
			state: '销售中',
			sort: 1,
			hot: 1,
			stock_num: stock_num,
			description: description,
			detail_imgs: detail_imgs,
			school: school,
			shoukeType: shoukeType,
			city_name: city_name,
			area_name: area_name,
			requestType: requestType,
			addressId: addressId,
			link: link,
		});

		this.db.collection('usemall-goods-detail').add({
			_id: goods_id,
			goods_id: goods_id,
			version: 1,
			is_delete: 0,
			create_uid: uid,
			desc_mobile: desc_mobile,
			create_time: create_time,
			last_modify_uid: uid,
			last_modify_time: create_time
		});

		let response = {
			code: 1
		};
		response.datas = [];
		response.code = 0;
		response.msg = `创建成功`;
		return response;
		//         this.db.collection('usemall-goods-sku').add({
		//             goods_id: goods_id,
		//             goods_sku: goods_sku,
		//             price: price,
		//             stock_num: stock_num,
		//             stock_wh_num: stock_wh_num,
		//             limit: 0,
		//             state: state,
		//             version: 1,
		//             is_delete: 0,
		//             create_uid: uid
		//         });
	}

	// 详情
	async detail() {
		let response = {
			code: 1,
			goods: {},
			goods_detail: {},
			goods_skus: [],
			evaluate: [],
			evaluate_cnt: 0,
		};

		let start = new Date().getTime();
		const {
			goods_id,
			share_mid
		} = this.ctx.data;

		// 产品状态
		let goods_state = '';
		let goods = await this.db.collection('usemall-goods').doc(goods_id).get();

		if (!goods || goods.data.length <= 0) {
			response.msg = `当前产品不存在`;
			return response;
		}
		goods_state = goods.data[0].state;
		if (goods_state != '销售中') {
			switch (goods_state) {
				case '待审核':
					response.msg = `当前产品未开售`;
					break;
				case '已下架':
					response.msg = `当前产品已下架`;
					break;
				default:
					response.msg = `当前产品${goods_state}`;
					break;
			}
			return response;
		}

		let collected = 0;
		if (this.ctx.event.uniIdToken) {
			// 已登录，获取当前登录 uid
			const user = await uidObj.checkToken(this.ctx.event.uniIdToken);
			if (user.code == 0) {
				const collect = await this.db.collection('usemall-member-collect').where({
					create_uid: user.uid,
					goods: goods_id
				}).get();
				// 是否已收藏
				if (collect && collect.data.length > 0 && collect.data[0].state == '已收藏') {
					collected = 1;
				}

				// 记录足迹（异步记录，提高响应时间）
				let obj_id = user.uid + goods_id;
				this.db.collection('usemall-goods-history').doc(obj_id).update({
					visit_cnt: this.db.command.inc(1),
					version: this.db.command.inc(1),
					state: goods_state,
					last_modify_uid: user.uid,
					last_modify_time: new Date().getTime()
				}).then(res => {
					if (res && res.updated <= 0) {
						this.db.collection('usemall-goods-history').doc(obj_id).set({
							goods: goods_id,
							sort: 0,
							visit_cnt: 1,
							version: 1,
							state: goods_state,
							create_uid: user.uid,
							create_time: new Date().getTime(),
							last_modify_time: new Date().getTime()
						});
					}
				});
			}
		}

		Object.assign(response.goods, {
			collected
		}, goods.data[0]);

		const detail = await this.db.collection('usemall-goods-detail')
			.where({
				goods_id
			})
			.get();
		const sku = await this.db.collection('usemall-goods-sku')
			.where({
				goods_id
			})
			.get();
		const evaluate = await this.db.collection('usemall-goods-comment')
			.where({
				goods_id: goods_id,
				state: '显示'
			})
			.limit(3)
			.orderBy('create_time', 'desc')
			.get();
		const evaluateCountRes = await this.db.collection('usemall-goods-comment').where({
			goods_id: goods_id,
			state: '显示'
		}).count();
		if (evaluateCountRes && evaluateCountRes.total) {
			response.evaluate_cnt = evaluateCountRes.total;
			response.evaluate = evaluate.data;
		}

		if (sku && sku.data) {
			response.goods_skus = sku.data;
		}

		if (detail.data && detail.data.length === 1) {
			response.goods_detail = detail.data[0];
		}

		let end = new Date().getTime();
		console.log(`耗时：${end - start}ms`);
		response.code = 0;
		response.msg = `耗时：${end - start}ms`;
		return response;
	}

	// 列表
	async list() {
		let response = {
			code: 1,
			goods: []
		};

		let start = new Date().getTime();
		// 请求参数
		const req = this.ctx.data;
		let {
			cid,
			sid,
			keyword,
			limited,
			hot,
			requestType,
		} = req;

		if (keyword) keyword = keyword.trim();

		let uid = '';
		if (this.ctx.event.uniIdToken) {
			// 已登录，获取当前登录 uid
			const user = await uidObj.checkToken(this.ctx.event.uniIdToken);
			if (user.code == 0) {
				uid = user.uid;
			}
		}

		if (sid) {
			// 通过热门搜索
			const hot = await this.db.collection('usemall-search-hot').doc(sid).get();
			if (hot && hot.data.length > 0) {
				keyword = hot.data[0].keyword;
				// 修改搜索记录次数
				await this.db.collection('usemall-search-hot').doc(sid).update({
					last_modify_time: new Date().getTime(),
					last_modify_uid: uid,

					version: this.db.command.inc(1),
					search_cnt: this.db.command.inc(1)
				});
			}
		}

		if (keyword && uid) {
			// 记录搜索历史			
			this.db.collection('usemall-search-history').where({
				create_uid: uid,
				keyword: keyword
			}).update({
				search_cnt: this.db.command.inc(1),
				version: this.db.command.inc(1),
				last_modify_uid: uid,
				last_modify_time: new Date().getTime()
			}).then(res => {
				if (res && res.updated <= 0) {
					this.db.collection('usemall-search-history').add({
						keyword,
						search_cnt: 1,
						version: 1,
						create_uid: uid,
						create_time: new Date().getTime(),
						last_modify_uid: uid,
						last_modify_time: new Date().getTime()
					});
				}
			});
		}

		let whereObj = {
			state: '销售中'
		};
		if (keyword) whereObj.name = new RegExp(keyword);
		if (limited == 1) whereObj.limited = 1;
		if (hot == 1) whereObj.hot = 1;
		if (cid) whereObj.cids = isFinite(cid) ? parseInt(cid, 10) : cid;
		if (requestType) whereObj.requestType = isFinite(requestType) ? parseInt(requestType, 10) : requestType;

		const goods = await this.db.collection('usemall-goods')
			.where(whereObj)
			.orderBy(req.sidx, req.sord)
			.skip((req.page - 1) * req.rows)
			.limit(req.rows)
			.get();

		response.goods = goods.data;

		let end = new Date().getTime();
		console.log(`耗时：${end - start}ms`);
		response.code = 0;
		response.msg = `耗时：${end - start}ms`;
		return response;
	}
	// 加入购物车
	async addcart() {
		let start = new Date().getTime();
		let response = {
			code: 1
		};
		let uid = '';
		if (this.ctx.event.uniIdToken) {
			// 已登录，获取当前登录 uid
			const user = await uidObj.checkToken(this.ctx.event.uniIdToken);
			if (user.code == 0) {
				uid = user.uid;
			}
		}
		if (!uid) {
			response.msg = '当前未登录'
			return response;
		}
		// 请求参数
		const req = this.ctx.data;
		let {
			goods_id,
			goods_num,
			goods_sku
		} = this.ctx.data
		let obj_id = uid + goods_id + (goods_sku || '');
		let cart = await this.db.collection('usemall-goods-cart').doc(obj_id).update({
			goods_num: this.db.command.inc(goods_num),
			version: this.db.command.inc(1),
			last_modify_uid: uid,
			last_modify_time: new Date().getTime()
		});
		if (cart && cart.updated <= 0) {
			cart = await this.db.collection('usemall-goods-cart').doc(obj_id).set({
				goods: goods_id,
				goods_num,
				goods_sku,
				version: 1,
				create_uid: uid,
				create_time: new Date().getTime(),
				last_modify_time: new Date().getTime()
			});
		}


		let end = new Date().getTime();
		console.log(`耗时：${end - start}ms`);
		response.cart = cart;
		response.code = 0;
		response.msg = `加入成功`;
		return response;

	}
	// 购买商品详情
	async detail2order() {
		let start = new Date().getTime();
		let response = {
			code: 1
		};
		let uid = '';
		if (this.ctx.event.uniIdToken) {
			// 已登录，获取当前登录 uid
			const user = await uidObj.checkToken(this.ctx.event.uniIdToken);
			if (user.code == 0) {
				uid = user.uid;
			}
		}
		if (!uid) {
			response.msg = '当前未登录'
			return response;
		}
		// 请求参数
		const req = this.ctx.data;
		let {
			goods_id,
			cart_ids,
			goods_sku_id
		} = this.ctx.data
		let goods = [];
		let goodsData = {};

		let goodsRes = {};
		let skuRes = {};

		if (goods_id) {
			// 从商品详情页下单
			goodsRes = await this.db.collection('usemall-goods').doc(goods_id).get();
			console.log('goodsRes', goodsRes);
			if (!(goodsRes && goodsRes.data.length == 1)) {
				response.msg = '当前下单商品不存在';
				return response;
			}
			goodsData = goodsRes.data[0];
			let goodsState = goodsData.state;
			if (goodsState != '销售中') {
				switch (goodsState) {
					case '待审核':
						response.msg = `当前产品未开售`;
						break;
					case '已下架':
					default:
						response.msg = `当前产品${goodsState}`;
						break;
				}
				return response;
			}

			// 默认下单数量1
			goodsData.goods_num = 1;

			let goods_sku = {};
			if (goods_sku_id) {
				// 商品存在 sku
				skuRes = await this.db.collection('usemall-goods-sku').doc(goods_sku_id).get();
				if (skuRes && skuRes.data.length === 1) {
					goods_sku = skuRes.data[0];
				}
			}
			goods.push({
				goods: goodsData,
				goods_sku: goods_sku
			});
		} else if (cart_ids && cart_ids.length > 0) {
			// 从购物车下单
			let goodsCartRes = await this.db.collection('usemall-goods-cart').where({
				create_uid: uid,
				_id: this.db.command.in(cart_ids)
			}).get();
			if (!(goodsCartRes && goodsCartRes.data.length > 0)) {
				response.msg = '当前购物车不存在';
				return response;
			}
			let goodsCarts = goodsCartRes.data;
			let goodsIds = goodsCarts.map(x => x.goods);
			let goodsSkuIds = goodsCarts.map(x => x.goods_sku);

			goodsRes = await this.db.collection('usemall-goods').where({
				_id: this.db.command.in(goodsIds)
			}).get();
			if (!(goodsRes && goodsRes.data.length > 0)) {
				response.msg = '当前购物车商品不存在';
				return response;
			}
			let goodsDatas = goodsRes.data;
			let goodsSkus = [];
			skuRes = await this.db.collection('usemall-goods-sku').where({
				goods_sku: this.db.command.in(goodsSkuIds)
			}).get();
			if (skuRes && skuRes.data.length > 0) {
				goodsSkus = skuRes.data;
			}

			goodsCarts.forEach(x => {
				goodsData = goodsDatas.find(g => g._id == x.goods);
				// 购物车商品数量
				goodsData.goods_num = x.goods_num;
				goods.push({
					goods: goodsData,
					goods_sku: goodsSkus.find(g => g.goods_sku == x.goods_sku),
					cart: x
				});
			});
		}


		let end = new Date().getTime();
		console.log(`耗时：${end - start}ms`);
		response.datas = goods;
		response.code = 0;
		response.msg = `获取成功`;
		return response;
	}
}