(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["pages-user-address-address"],{"663b":function(n,t,e){var a=e("c296");a.__esModule&&(a=a.default),"string"===typeof a&&(a=[[n.i,a,""]]),a.locals&&(n.exports=a.locals);var i=e("4f06").default;i("0b5ee55a",a,!0,{sourceMap:!1,shadowMode:!1})},"66f0":function(n,t,e){"use strict";e.r(t);var a=e("a16d"),i=e.n(a);for(var s in a)["default"].indexOf(s)<0&&function(n){e.d(t,n,(function(){return a[n]}))}(s);t["default"]=i.a},a16d:function(n,t,e){"use strict";e("7a82");var a=e("ee27").default;Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var i=a(e("f07e")),s=a(e("c964"));e("99af"),e("c975");var o="usemall-member-address",d={data:function(){return{env:{},is_mp:!1,platform:"",platform_name:"",platform_icon:"",source:0,addressDatas:[]}},onLoad:function(n){var t=this;this.$api.get_env((function(n){t.env=n,t.is_mp=t.env.is_mp,t.platform=t.env.platform,t.platform_icon=t.env.platform_icon,t.platform_name=t.env.platform_name})),this.source=n.source||0},onShow:function(){this.loadData()},methods:{loadData:function(){var n=this;this.$db[o].where("create_uid == $cloudEnv_uid").tolist({orderby:"is_default desc"}).then((function(t){200!==t.code?n.$api.msg(t.msg):n.addressDatas=t.datas}))},importAddr:function(){var n=this;uni.chooseAddress({success:function(t){var e={is_default:"否"};e.consignee=t.userName,e.mobile=t.telNumber,e.addr_detail=t.detailInfo,e.province_name=t.provinceName,e.city_name=t.cityName,e.area_name=t.countyName||"",e.address="".concat(e.province_name,"-").concat(e.city_name,"-").concat(e.area_name),e.addr_source=n.$env.platform,e.mobile?(console.log("uni chooseAddress",e),n.$db[o].add(e).then((function(t){if(200===t.code)return n.$api.msg("导入成功"),void n.loadData();n.$api.msg(t.msg)}))):n.$api.msg("收货人手机不存在")},fail:function(t){-1!==t.errMsg.indexOf("cancel")?n.$api.msg("已取消"):uni.showModal({content:"打开授权",success:function(n){n.confirm&&uni.openSetting({})}})}})},setDefault:function(n){var t=this;uni.showModal({title:"提示",content:"设为默认",success:function(){var e=(0,s.default)((0,i.default)().mark((function e(a){return(0,i.default)().wrap((function(e){while(1)switch(e.prev=e.next){case 0:if(!a.confirm){e.next=7;break}return e.next=3,t.$db[o].where('create_uid == $env.uid && is_default == "是"').update({is_default:"否"}).then((function(n){}));case 3:return e.next=5,t.$db[o].update(n._id,{is_default:"是"}).then((function(n){200===n.code&&t.loadData()}));case 5:e.next=8;break;case 7:a.cancel&&console.log("用户点击取消");case 8:case"end":return e.stop()}}),e)})));return function(n){return e.apply(this,arguments)}}()})},selectAddr:function(n){1==this.source&&(uni.$emit("__event_choice_address",n),uni.navigateBack())},addAddr:function(n,t){t=t||{id:0},uni.navigateTo({url:"/pages/user/address/address-edit?type=".concat(n,"&id=").concat(t._id)})},removeAddr:function(n){var t=this;uni.showModal({title:"提示",content:"删除收货人",success:function(){var e=(0,s.default)((0,i.default)().mark((function e(a){return(0,i.default)().wrap((function(e){while(1)switch(e.prev=e.next){case 0:if(!a.confirm){e.next=5;break}return e.next=3,t.$db[o].remove(n._id).then((function(n){200===n.code&&t.loadData()}));case 3:e.next=6;break;case 5:a.cancel&&console.log("用户点击取消");case 6:case"end":return e.stop()}}),e)})));return function(n){return e.apply(this,arguments)}}()})}}};t.default=d},b876:function(n,t,e){"use strict";e.d(t,"b",(function(){return a})),e.d(t,"c",(function(){return i})),e.d(t,"a",(function(){}));var a=function(){var n=this,t=n.$createElement,e=n._self._c||t;return e("v-uni-view",{staticClass:"padding-lr padding-bottom-big margin-bottom ft-main bg-drak"},[n._l(n.addressDatas,(function(t,a){return e("v-uni-view",{key:a,staticClass:"bg-main padding-top padding-lr border-radius margin-top-sm",on:{click:function(e){arguments[0]=e=n.$handleEvent(e),n.selectAddr(t)}}},[e("v-uni-view",{staticClass:"w-full dflex-wrap-w border-line"},[e("v-uni-view",{staticClass:"fwb margin-bottom-xs desc"},[e("v-uni-text",[n._v(n._s(t.address)+" "+n._s(t.addr_detail))])],1),e("v-uni-view",{staticClass:"margin-bottom-sm"},[e("v-uni-text",[n._v(n._s(t.consignee))]),e("v-uni-text",{staticClass:"margin-left"},[n._v(n._s(t.mobile))])],1)],1),e("v-uni-view",{staticClass:"dflex-b"},["是"==t.is_default?e("v-uni-view",{staticClass:"dflex active"},[e("v-uni-text",{staticClass:"iconfont iconxuanzhongzhuangtai padding-tb-sm padding-right-sm"}),e("v-uni-text",[n._v("默认地址")])],1):e("v-uni-view",{staticClass:"dflex ft-dark",on:{click:function(e){e.stopPropagation(),arguments[0]=e=n.$handleEvent(e),n.setDefault(t)}}},[e("v-uni-text",{staticClass:"iconfont iconweixuanzhongzhuangtai padding-tb-sm padding-right-sm"}),e("v-uni-text",[n._v("设为默认")])],1),0==n.source||1==n.source?e("v-uni-view",{staticClass:"dflex"},[e("v-uni-view",{staticClass:"padding-tb-sm padding-right-sm",on:{click:function(e){e.stopPropagation(),arguments[0]=e=n.$handleEvent(e),n.addAddr("edit",t)}}},[e("v-uni-text",{staticClass:"iconfont iconbianji-01 ft-dark"})],1),e("v-uni-view",{staticClass:"padding-tb-sm padding-left-sm",on:{click:function(e){e.stopPropagation(),arguments[0]=e=n.$handleEvent(e),n.removeAddr(t)}}},[e("v-uni-text",{staticClass:"iconfont iconlajitong-01 ft-dark"})],1)],1):n._e()],1)],1)})),e("v-uni-view",{staticClass:"btn-container dflex-b pos-f border-radius-big"},[n.is_mp?e("v-uni-view",{staticClass:"tac padding-tb-sm flex1 bg-main",on:{click:function(t){arguments[0]=t=n.$handleEvent(t),n.importAddr.apply(void 0,arguments)}}},[n._v(n._s(n.platform_name)+"导入")]):n._e(),e("v-uni-view",{staticClass:"tac padding-tb-sm flex1 bg-base",on:{click:function(t){arguments[0]=t=n.$handleEvent(t),n.addAddr("add")}}},[n._v("添加地址")])],1)],2)},i=[]},bb9a:function(n,t,e){"use strict";e.r(t);var a=e("b876"),i=e("66f0");for(var s in i)["default"].indexOf(s)<0&&function(n){e.d(t,n,(function(){return i[n]}))}(s);e("f888");var o=e("f0c5"),d=Object(o["a"])(i["default"],a["b"],a["c"],!1,null,"b90f76f8",null,!1,a["a"],void 0);t["default"]=d.exports},c296:function(n,t,e){var a=e("24fb");t=a(!1),t.push([n.i,'@charset "UTF-8";\n/* 页面左右间距 */\n/* 文字尺寸 */\n/*文字颜色*/\n/* 边框颜色 */\n/* 图片加载中颜色 */\n/* 颜色变量 */\n/* 行为相关颜色 */\n/* 文字基本颜色 */\n/* 背景颜色 */\n/* 边框颜色 */\n/* 尺寸变量 */\n/* 文字尺寸 */\n/* 图片尺寸 */\n/* Border Radius */\n/* 水平间距 */\n/* 垂直间距 */\n/* 透明度 */\n/* 文章场景相关 */uni-page-body[data-v-b90f76f8]{background:#f5f5f5}body.?%PAGE?%[data-v-b90f76f8]{background:#f5f5f5}.desc[data-v-b90f76f8]{font-size:%?32?%}.btn-container[data-v-b90f76f8]{left:%?20?%;right:%?20?%;bottom:%?20?%}',""]),n.exports=t},f888:function(n,t,e){"use strict";var a=e("663b"),i=e.n(a);i.a}}]);