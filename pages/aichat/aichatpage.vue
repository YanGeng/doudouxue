<template>
    <view class="y-wrap" :style="'--bottom-height:' + bottomHeight">
        <scroll-view class="y-wrap_message_content" id="scrollBox" scroll-y :scroll-into-view="scrollToId"
            :scroll-top="scrollTop" :refresher-enabled="useRefresh" :refresher-threshold="100"
            :refresher-triggered="triggered" @scroll="onScroll" :scroll-with-animation="enableScrollAnimation"
            refresher-default-style="white" @scrolltolower="scroll2Lower" refresher-background="#F2F2F2"
            @refresherrefresh="onRefresh" @refresherrestore="onReset" @tap="closeFooter">
            <view id="scroll-view-content">
                <view v-for="(item, index) in list" :key="index" :id="'y-chat-' + item[defaultOptions['msgId']]"
                    :class="['y-wrap_message_content_box', { 'y-wrap_message_content_my': item[defaultOptions['userId']] == userId }]">
                    <view style="text-align: center; padding: 10rpx 0 20rpx;" v-if="item.showTime">
                        {{ item.timeLabel }}
                    </view>
                    <view>
                        <u-image width="65rpx" height="65rpx" :src="item[defaultOptions['avator']] || defaultAvator"
                            @click="tapAvator(item)" radius="20rpx" bgColor="red"></u-image>
                        <view
                            :class="['y-wrap_message_content_box_msg', { 'y-wrap_message_content_box_my': item[defaultOptions['userId']] == userId }]">
                            <!-- 这段代码用于显示当前用户的名字 -->
                            <!-- <view :class="['y-wrap_message_content_box_msg__name', { 'y-wrap_message_content_box_msg__me' : item[defaultOptions['userId']] == userId }]">
							<u-tag
								v-if="tagOptions[item[defaultOptions['tagLabel']]]"
								:bgColor="tagOptions[item[defaultOptions['tagLabel']]] ? tagOptions[item[defaultOptions['tagLabel']]].bgColor : ''"
								:borderColor="tagOptions[item[defaultOptions['tagLabel']]] ? tagOptions[item[defaultOptions['tagLabel']]].bgColor : ''"
								:color="tagOptions[item[defaultOptions['tagLabel']]] ? tagOptions[item[defaultOptions['tagLabel']]].color : ''"
								:text="tagOptions[item[defaultOptions['tagLabel']]] ? tagOptions[item[defaultOptions['tagLabel']]].text : ''"
								size="mini"
							></u-tag>
			
							<text>{{ item[defaultOptions['name']] }}</text>
						</view> -->

                            <!-- 这段是聊天内容 -->
                            <view :class="[
                                { 'y-wrap_message_content_box_msg__val': item[defaultOptions['userId']] !== userId && (item[defaultOptions['message']] || item[defaultOptions['img']]) },
                                { 'y-wrap_message_content_box_msg__dot': item[defaultOptions['userId']] !== userId && !item[defaultOptions['message']] && !item[defaultOptions['img']] },
                                { 'y-wrap_message_content_box_msg__my': item[defaultOptions['userId']] === userId },
                                { 'y-wrap_message_content_box_msg__img': item[defaultOptions['img']] }
                            ]">
                                <view v-if="item[defaultOptions['message']]">
                                    <!-- <text selectable="true">{{ item[defaultOptions['message']] }}</text> -->
                                    <rich-text selectable :nodes="item[defaultOptions['message']]"></rich-text>
                                    <!-- <rich-text :nodes="nodes"></rich-text> -->
                                </view>
                                <!-- 显示模拟对方正在输入 -->
                                <view v-else-if="!item[defaultOptions['img']]" :class="[
                                    { 'y-wrap_message_content_box_msg__dot': item[defaultOptions['userId']] !== userId },
                                    { 'y-wrap_message_content_box_msg__my': item[defaultOptions['userId']] === userId }
                                ]">
                                    <span class="dot dot-1"></span>
                                    <span class="dot dot-2"></span>
                                    <span class="dot dot-3"></span>
                                </view>
                                <u-image @tap="lookImg(item[defaultOptions['img']], index)"
                                    v-if="item[defaultOptions['img']]" :src="item[defaultOptions['img']]"
                                    width="calc(65vw - 15rpx)" height="auto" mode="widthFix"
                                    :lazy-load="true"></u-image>
                            </view>
                        </view>
                    </view>
                </view>
                <!-- 不可见的 view 元素 -->
                <view id="y-chat-bottom-view" class="hidden-view"></view>
            </view>
        </scroll-view>
        <view class="y-wrap_footer">
            <view class="y-wrap_footer_show_box" id="show_box">
                <!-- @click="textShowFlag = false" -->
                <u-icon custom-style="padding: 0 10rpx;" :size="iconSize" name="camera"
                    v-if="textShowFlag && !aiChatImgUrl && !focus" @click="playCamera"></u-icon>
                <!-- <u-icon custom-style="padding: 0 20rpx 0 10rpx;" :size="iconSize" name="camera" v-else @click="showText"></u-icon> -->
                <view v-else-if="aiChatImgUrl" style="padding: 0 10rpx;" @click="clearAiChatImgUrl">
                    <u-image :src="aiChatImgUrl" width="70rpx" height="70rpx"></u-image>
                </view>
                <view class="y-wrap_footer_show_box__ipt">
                    <!-- <input v-if="textShowFlag" v-model="sendVal" :focus="focus" @blur="blur"></input> -->
                    <!-- <u-textarea v-if="textShowFlag" type="textarea" v-model="sendVal" rows="1" autoHeight :cursorSpacing="30"	
						:placeholder="bannedToPost ? '禁言中' : placeholderText" :disabled="bannedToPost" :focus="focus"
						@focus="focusChange" @blur="blur"></u-textarea> -->
                    <u-input v-if="textShowFlag" type="textarea" v-model="sendVal"
                        :placeholder="bannedToPost ? '禁言中' : placeholderText" :disabled="bannedToPost" :focus="focus"
                        @focus="focusChange" @blur="blur"></u-input>
                    <!-- <u-button v-else @touchstart="startAudio" @touchend="endAudio">按住说话</u-button> -->
                    <button v-else style="font-size: 32rpx; overflow: inherit;" @touchstart="startAudio"
                        @touchmove="moveAudio" @touchend="endAudio">按住说话</button>
                </view>
                <view>
                    <!-- <u-icon custom-style="padding: 0 10rpx" :size="iconSize" name="star"></u-icon> -->
                    <!-- #ifndef MP-WEIXIN -->
                    <u-icon customStyle="padding: 0 10rpx;" :size="iconSize" :name="hideBoxIconName"
                        @click="showHideBox" :class="!sendVal ? 'width_to_mini' : 'fade_show'" v-if="!sendVal"></u-icon>
                    <button style="width:116rpx; padding: 0; text-align: center; margin-left: 10rpx;" type="primary"
                        size="mini" :class="sendVal ? 'width_to_large' : 'fade_show'" @touchend.prevent="send"
                        ref="send" v-else>发送</button>
                    <!-- #endif -->
                    <!-- #ifdef MP-WEIXIN -->
                    <u-transition :show="!sendVal">
                        <u-icon customStyle="padding: 0 10rpx;" :size="iconSize" name="plus" @click="showHideBox"
                            v-if="!sendVal"></u-icon>
                    </u-transition>
                    <u-transition :show="sendVal">
                        <button style="width:116rpx; 60rpx; padding: 0; text-align: center; margin-left: 10rpx;"
                            type="primary" size="mini" v-if="sendVal" @touchend.prevent="send">发送</button>
                    </u-transition>
                    <!-- #endif -->
                </view>
            </view>
            <view class="y-wrap_footer_hide_box" id="hide_box">
                <view class="y-wrap_footer_hide_box_item" v-for="(item, index) in sheet" :key="index"
                    @click="moreFun(item)">
                    <view class="y-wrap_footer_hide_box_item__btn">
                        <u-image v-if="item.img" :src="item.img" width="60rpx" height="60rpx" mode="aspectFill" />
                        <u-icon v-else :size="iconSize" :name="item.icon"></u-icon>
                        <text>{{ item.name }}</text>
                    </view>
                </view>
            </view>
        </view>
        <!-- readyCloseAudio -->
        <u-popup :show="audioFlag" :bgColor="readyCloseAudio ? 'rgba(255, 0, 0, 0.4)' : ''" mode="center" :zoom="false"
            round="20">
            <view class="y-wrap_audio">
                <view class="y-wrap_audio__large" :style="'border-color:' + borderColor">
                    <view class="y-wrap_audio__small" :style="'border-color:' + borderColor">
                        <view class="y-wrap_audio__mini" :style="'border-color:' + borderColor"></view>
                    </view>
                </view>
            </view>
        </u-popup>

        <view v-if="audioFlag"
            :style="'position: fixed; bottom: 200rpx; left: 50%; transform: translateX(-50%); z-index: 10080; color: #fff;'">
            上划取消发送
        </view>
    </view>
</template>
<script>
import {
    mapState,
    mapMutations
} from 'vuex';

import {
    parseTokens
} from "@/uni_modules/wtto-markdown/js_sdk/index";
// import {
// 	katexPlugin
// } from "@/uni_modules/wtto-markdown/js_sdk/katex";

// // highlight
// // import { createHighlighterCoreSync } from "shiki/core";
// // import { createJavaScriptRegexEngine } from "shiki/engine/javascript";
// // import { bundledLanguages } from "shiki/langs.mjs";
// // import githubLight from "shiki/themes/github-light.mjs";
// // import githubDark from "shiki/themes/github-dark.mjs";
// // import { highlightPlugin } from "@/uni_modules/wtto-markdown/js_sdk/highlight";

// import deflistPlugin from "markdown-it-deflist";
// import {
// 	full as emoji
// } from "markdown-it-emoji";
// import insPlugin from "markdown-it-ins";
// import markPlugin from "markdown-it-mark";
// import subPlugin from "markdown-it-sub";
// import supPlugin from "markdown-it-sup";
// import footnotePlugin from "markdown-it-footnote";
// import abbrPlugin from "markdown-it-abbr";
// import containerPlugin from "markdown-it-container";

// 用来获取随机id的, 正式项目不需要
function getRandomNum() {
    return Math.floor(Math.random() * 1000).toString() + Math.floor(Math.random() * 1000).toString()
}
import {
    disposeTime,
    repairZero,
    deepClone,
    isEmpty
} from './common.js'
import props from './props.js'
import data from './data.js'
export default {
    // props,
    watch: {
        sheetList: {
            handler: function () {
                setTimeout(() => {
                    const query = uni.createSelectorQuery().in(this);
                    let showBox = query.select('#show_box')
                    let hideBox = query.select('#hide_box')
                    hideBox.boundingClientRect((res) => {
                        this.hideBoxHeight = res.height
                    }).exec()
                    showBox.boundingClientRect((res) => {
                        this.showBoxHeight = res.height
                    }).exec()
                })
            },
            immediate: true,
            deep: true
        },
        newMessageList: {
            handler(newVal, oldVal) {
                console.log('newMessageList changed', newVal, oldVal);
                const timeOptions = this.defaultOptions.time
                if (newVal.length > 0 && newVal.length != oldVal.length) {
                    newVal.forEach((item, index) => {
                        item.showTime = index == 0 ? true : item.time - newVal[index - 1][timeOptions] >= this
                            .intervalTime
                        item.timeLabel = disposeTime(item.time)
                    })
                    this.list = newVal
                    // 判断视口和容器高度判断要不要滚动
                    setTimeout(async () => {
                        console.log('newMessageList changed scrollBottom');
                        if (oldVal.length == 0) {
                            const query = uni.createSelectorQuery().in(this);
                            const scrollBox = query.select('#scrollBox')
                            const containerBox = query.selectAll('.y-wrap_message_content_box')

                            const scroll = new Promise(resolve => {
                                scrollBox.boundingClientRect((res) => {
                                    resolve(res.height)
                                }).exec()
                            })
                            const content = new Promise(resolve => {
                                containerBox.boundingClientRect((res) => {
                                    let height = res.reduce((pre, next) => {
                                        return pre + next.height
                                    }, 0)
                                    resolve(height)
                                }).exec()
                            })

                            const [window, container] = await Promise.all([scroll, content])
                            if (window < container) {
                                // this.scrollBottom()
                            }
                            return
                        }
                        // this.scrollBottom()
                    }, 100)
                }
            },
            deep: true
        },
        updateList: {
            handler: function (newVal, oldVal) {
                console.log('updateList changed', newVal, oldVal);
                this.addListNode(newVal);

                if (!Object.prototype.toString.call(newVal).includes('Array')) {
                    // this.scrollBottom();
                }
                // if (isEmpty(newVal)) return
                // const timeOptions = this.defaultOptions.time
                // const idOptions = this.defaultOptions.msgId
                // if (Object.prototype.toString.call(newVal).includes('Array')) {
                // 	//历史消息
                // 	newVal.forEach((item, index) => {
                // 		item.showTime = index == 0 ? true : item[timeOptions] - newVal[index - 1][
                // 			timeOptions
                // 		] >= this.intervalTime
                // 		item.timeLabel = disposeTime(item[timeOptions])
                // 	})
                // 	this.list = newVal.concat(this.list)
                // } else {
                // 	//发送消息
                // 	if (newVal.id != oldVal.id) {
                // 		let empty = isEmpty(this.list)
                // 		newVal.showTime = empty || newVal[timeOptions] - this.list[this.list.length - 1][
                // 			timeOptions
                // 		] >= this.intervalTime
                // 		newVal.timeLabel = disposeTime(newVal[timeOptions])
                // 		this.list.push(newVal)
                // 		// setTimeout(() => {
                // 		//     console.log('updateList changed scrollBottom');
                // 		// 	this.scrollBottom()
                // 		// })
                // 		this.scrollBottom()
                // 	}
                // }
            },
            immediate: true,
            deep: true
        },
        value: {
            handler: function (newVal, oldVal) {
                this.sendVal = newVal
            },
            immediate: true
        }
    },
    data: data,
    created() {
        console.log('created data,', this.defaultSheet, this.list);
        // this.scrollBottom();
    },
    onShow() {
        console.log('onShow this.list', this.hideBoxHeight, this.showBoxHeight, this.list);
        // this.scrollBottom();
    },
    onReady() {
        console.log('onReady');
        // 页面初次渲染完成后，设置一个足够大的值使滚动到底部
        // this.scrollBottom();
        // this.$nextTick(() => {
        //     // this.scrollBottomValue = 9999;
        //     // this.scrollToId = 'y-chat-bottom-view'
        //     this.scrollBottom();
        // });
    },
    onLoad() {
        // this.init();
        this.ai_chat_list_tmp = this.ai_chat_list.slice(Math.max(this.ai_chat_list.length - 10, 0));
        this.curChatNodeTime = this.ai_chat_list_tmp[0].time;
        console.log('onLoad ai_chat_list ai_chat_list ai_chat_list :', this.ai_chat_list);
        if (this.ai_chat_list_tmp.length > 0) {
            const timeOptions = this.defaultOptions.time
            this.ai_chat_list_tmp.forEach((item, index) => {
                item.showTime = index == 0 ? true : item.time - this.ai_chat_list_tmp[index - 1][timeOptions] >=
                    this
                        .intervalTime
                item.timeLabel = disposeTime(item.time)
            })
            this.list = this.ai_chat_list_tmp;
        }
        console.log('onLoad 222 ai_chat_list_tmp ai_chat_list_tmp ai_chat_list_tmp :', this.curChatNodeTime, this.ai_chat_list_tmp);
        // setTimeout(() => {
        // this.scrollBottom();
        // }, 300);
    },
    computed: {
        ...mapState(['ai_chat_list', 'token']),
        bottomHeight() {
            return this.footerFlag ? (this.hideBoxHeight + this.showBoxHeight + 'px') : this.showBoxHeight + 'px'
        },
        sheet() {
            let sheet = this.sheetList
            if (sheet && sheet.length > 0) {
                return this.retainSheet ? this.defaultSheet.concat(sheet) : sheet
            } else {
                return this.defaultSheet
            }
        },
        borderColor() {
            return this.readyCloseAudio ? '#fff' : '#000;'
        },
        // 解决watch新老数据一样问题
        newMessageList() {
            return deepClone(this.messageList)
        }
    },
    methods: {
        ...mapMutations(['updateAiChatList']),
        onScroll(e) {
            // 记录当前的滚动位置
            // this.scrollTop11 = e.detail.scrollTop;
            // console.log('onScroll', e.detail.scrollTop, this.scrollTop);
        },
        scroll2Lower() {
            console.log('scroll2Lower');
            if (this.isUpperLoading) return;
            this.isLoading = true;
            const currentScrollTop = this.scrollTop11;
            ;
            const result = [];
            let startIndex = -1;
            console.log('scroll2Lower', currentScrollTop, this.list);

            // 从数组尾部开始遍历，找到第一个 time < targetTime 的元素
            for (let i = this.ai_chat_list.length - 1; i >= 0; i--) {
                if (this.ai_chat_list[i].time < this.curChatNodeTime) {
                    startIndex = i;
                    break;
                }
            }

            let preNode = this.list[0];
            // 如果找到了符合条件的起始元素
            if (startIndex !== -1) {
                // 从起始元素开始，向上取 n 条记录
                for (let i = startIndex; i >= 0 && result.length < 10; i--) {
                    this.ai_chat_list[i].showTime = this.ai_chat_list[i].time - preNode.time >= this.intervalTime
                    this.ai_chat_list[i].timeLabel = disposeTime(this.ai_chat_list[i].time)
                    result.push(this.ai_chat_list[i]);
                    preNode = this.ai_chat_list[i];
                }
            }


            // this.scrollToId = 'y-chat-' + this.list[this.list.length - 1][this.defaultOptions.msgId];
            // setTimeout(() => {
                // 将提取的记录插入到目标数组的头部
                this.list.unshift(...result.reverse());
                // this.list.push(...result.reverse());
                // 恢复滚动位置
                // this.$nextTick(() => {
                    // this.scrollTop = currentScrollTop;
                    // this.scrollToId = 'y-chat-' + this.list[this.list.length - 1][this.defaultOptions.msgId]
                    this.isLoading = false;
                    console.log('scroll2Upper done', currentScrollTop, this.list);
                // });
                this.curChatNodeTime = this.list[0].time;
            // }, 1000);
        },
        scroll2Upper() {
            if (this.isUpperLoading) return;
            this.isLoading = true;
            const currentScrollTop = this.scrollTop11;
            ;
            const result = [];
            let startIndex = -1;
            console.log('scroll2Upper', currentScrollTop, this.list);

            // 从数组尾部开始遍历，找到第一个 time < targetTime 的元素
            for (let i = this.ai_chat_list.length - 1; i >= 0; i--) {
                if (this.ai_chat_list[i].time < this.curChatNodeTime) {
                    startIndex = i;
                    break;
                }
            }

            let preNode = this.list[0];
            // 如果找到了符合条件的起始元素
            if (startIndex !== -1) {
                // 从起始元素开始，向上取 n 条记录
                for (let i = startIndex; i >= 0 && result.length < 10; i--) {
                    this.ai_chat_list[i].showTime = this.ai_chat_list[i].time - preNode.time >= this.intervalTime
                    this.ai_chat_list[i].timeLabel = disposeTime(this.ai_chat_list[i].time)
                    result.push(this.ai_chat_list[i]);
                    preNode = this.ai_chat_list[i];
                }
            }


            // this.scrollToId = 'y-chat-' + this.list[this.list.length - 1][this.defaultOptions.msgId];
            // setTimeout(() => {
                // 将提取的记录插入到目标数组的头部
                this.list.unshift(...result.reverse());
                // this.list.push(...result.reverse());
                // 恢复滚动位置
                // this.$nextTick(() => {
                    // this.scrollTop = currentScrollTop;
                    // this.scrollToId = 'y-chat-' + this.list[this.list.length - 1][this.defaultOptions.msgId]
                    this.isLoading = false;
                    console.log('scroll2Upper done', currentScrollTop, this.list);
                // });
                this.curChatNodeTime = this.list[0].time;
            // }, 1000);

        },
        addListNode(node) {
            if (isEmpty(node)) return
            const timeOptions = this.defaultOptions.time
            const idOptions = this.defaultOptions.msgId
            if (Object.prototype.toString.call(node).includes('Array')) {
                //历史消息
                node.forEach((item, index) => {
                    item.showTime = index == 0 ? true : item[timeOptions] - node[index - 1][
                        timeOptions
                    ] >= this.intervalTime
                    item.timeLabel = disposeTime(item[timeOptions])
                })
                this.list = node.concat(this.list)
            } else {
                //发送消息
                // if (node.id != oldVal.id) {
                let empty = isEmpty(this.list)
                node.showTime = empty || node[timeOptions] - this.list[this.list.length - 1][
                    timeOptions
                ] >= this.intervalTime
                node.timeLabel = disposeTime(node[timeOptions])
                this.list.push(node)
                // setTimeout(() => {
                //     console.log('updateList changed scrollBottom');
                // 	this.scrollBottom()
                // })
                // this.scrollBottom()
                // }
            }
        },
        async init() {
            uni.showLoading({
                title: "加载中",
                mask: true,
            });
            // 同步获取所有的语言
            //   const langs = [];
            //   for (const name in bundledLanguages) {
            //     langs.push((await bundledLanguages[name]()).default);
            //   }

            console.log('init xxxxx: 111111111111');
            //   const shiki = createHighlighterCoreSync({
            //     themes: [githubLight, githubDark],
            //     langs: langs,
            //     engine: createJavaScriptRegexEngine(),
            //   });

            this.markdownIt = MarkdownIt({
                typographer: true,
                linkify: true,
            })
                .use(emoji)
                .use(subPlugin)
                .use(supPlugin)
                .use(insPlugin)
                .use(markPlugin)
                .use(deflistPlugin)
                .use(footnotePlugin)
                .use(abbrPlugin)
                .use(containerPlugin, "warning")
                .use(katexPlugin, {
                    throwOnError: true
                });
            // .use(highlightPlugin, {
            //   codeToTokens: (code, lang) =>
            //     shiki.codeToTokens(code, {
            //       themes: {
            //         light: "github-light",
            //         dark: "github-dark",
            //       },
            //       lang,
            //     }),
            // });

            uni.hideLoading();

            // this.render(this.markdownContent);
        },
        render(input) {
            const tokens = this.$markdownIt.parse(input, {});
            let nodes = parseTokens(tokens, this.$markdownIt.options);
            console.log('render nodes', nodes);
            return nodes;
        },
        clearAiChatImgUrl() {
            this.aiChatImgUrl = '';
            this.placeholderText = '发消息...'
        },
        focusChange() {
            // console.log('focusChange', this.hideBoxHeight, this.showBoxHeight);
            this.enableScrollAnimation = true;
            this.getFocus = true;
            this.focus = true;
            // this.scrollBottom();
        },
        // 下拉刷新被触发
        onRefresh() {
            if (this.freshing) return;
            const stop = () => {
                this.triggered = false
                this.freshing = false
            }
            this.freshing = true;
            this.$emit('onRefresh', stop.bind(this))
        },
        // 下拉刷新被复位
        onReset() {
            this.triggered = 'restore'; // 需要重置
            // this.$emit('onReset')
        },
        tapAvator(item) {
            this.$emit('tapAvator', item)
        },
        scrollBottom(duration) {
            if (this.list.length == 0) return
            //'y-chat-' + this.list[this.list.length - 2][this.defaultOptions.msgId]
            this.scrollToId = 'y'
            console.log('scrollBottom xxxxxx', this.scrollToId)
            if (duration) {
                setTimeout(() => {
                    // this.scrollToId = 'y'
                    this.scrollToId = 'y-chat-bottom-view'
                    // this.scrollToId = 'y-chat-' + this.list[this.list.length - 1][this.defaultOptions.msgId]
                    console.log('scrollBottom yyyyy setTimeout', this.scrollToId)
                }, duration)
            } else {
                // duration = 0
                this.$nextTick(() => {
                    this.scrollToId = 'y-chat-bottom-view'
                    // this.scrollToId = 'y-chat-' + this.list[this.list.length - 1][this.defaultOptions.msgId]
                    console.log('scrollBottom yyyyy nextTick', this.scrollToId)
                });
            }
        },
        showHideBox() {
            this.footerFlag = !this.footerFlag
            this.hideBoxIconName = this.footerFlag ? 'close-circle' : 'plus-circle';
            if (this.footerFlag && this.useScrollBottom) {
                setTimeout(() => {
                    // this.scrollBottom()
                }, 500)
            }
        },
        closeFooter() {
            this.footerFlag = false
        },
        lookImg(img, index) {
            const urls = this.list.map(item => item.img).filter(item => item)
            const current = urls.findIndex(item => item == img)
            uni.previewImage({
                current,
                urls,
                // #ifndef MP-WEIXIN
                indicator: 'number',
                loop: true,
                // #endif
                longPressActions: {
                    itemList: ['发送给朋友', '保存图片'],
                    success(res) {
                        console.log(res, 'res')
                        console.log(this, 'this')
                    }
                }
            })
        },
        moreFun(item) {
            console.log('moreFun xxxxx: ', item);
            item.default ? this[item.default]() : this.$emit(item.funLabel, item)
        },
        playCamera() {
            let _this = this;
            if (_this.bannedToPost) {
                uni.showToast({
                    title: '当前正在禁言中, 不能拍摄',
                    icon: 'none'
                })
                return
            }
            uni.chooseImage({
                sourceType: ['camera'],
                success(res) {
                    console.log('playCamera xxxxxxxx', res)
                    _this.aiChatImgLocalPath = res.tempFilePaths[0];
                    _this.uploadImage(_this.aiChatImgLocalPath); // 调用上传图片的方法
                    console.log('this.aiChatImgLocalPath', _this.aiChatImgUrl, res);
                    // this.$emit('playCamera', res)
                },
                fail(err) {
                    console.error(err, 'err')
                }
            })
        },
        playPhoto() {
            if (this.bannedToPost) {
                uni.showToast({
                    title: '当前正在禁言中, 不能发送照片',
                    icon: 'none'
                })
                return
            }
            uni.chooseImage({
                count: 1,
                sourceType: ['album'],
                success: (res) => {
                    // console.log(res,'imgRes')
                    // this.$emit('playPhoto', res)
                    this.aiChatImgLocalPath = res.tempFilePaths[0]; // 获取选中的图片路径
                    this.uploadImage(this.aiChatImgLocalPath); // 调用上传图片的方法
                    console.log('this.aiChatImgLocalPath', this.aiChatImgUrl, res);
                },
                fail: (err) => {
                    console.error(err, 'imgErr')
                }
            })
        },
        async uploadImage(filePath) {
            let fileName = ''
            let lastSeparatorIndex = filePath.lastIndexOf("/");
            if (lastSeparatorIndex !== -1) {
                fileName = filePath.substring(lastSeparatorIndex + 1);
                console.log("File Name xxx:", fileName);
                // let lastIndex = fileName.lastIndexOf(".");
                // fileName = fileName.substring(0, lastIndex);
                // console.log("File Name:", fileName, lastIndex);
            } else {
                console.error("Invalid file path");
            }

            if (fileName) {
                fileName = '/ai_chat/' + Date.now() + '_' + fileName; // + '.webp';
            }
            console.log("uploadImage xxxx:", fileName, filePath);
            // 将图片转换为 WebP 格式
            // const webpFilePath = await this.convertToWebP(filePath);

            // let aaa = await uni.compressImage({
            // 	src: filePath,
            // 	quality: 50 // 压缩质量，范围 0 - 100，数值越小压缩越严重
            // });

            // console.log("uploadImage zzzzz:", fileName, aaa[1]);
            // let tmppath = aaa[1].tempFilePath;

            // 将 Blob 转换为临时文件路径
            // const webpTempFilePath = await this.blobToTempFilePath(webpBlob);
            // console.log("uploadImage yyyy:", fileName, tmppath, aaa);
            // 调用uni-app提供的上传文件API
            uni.showNavigationBarLoading();

            let {
                fileID
            } = await uniCloud.uploadFile({
                // url: this.uploadUrl, // 你的服务器上传接口地址
                filePath: filePath,
                cloudPath: fileName, // 文件对应的key，后端可能需要根据这个key来接收文件
                cloudPathAsRealPath: true,
                fileType: 'image'
            });

            uni.hideNavigationBarLoading();

            console.log('fileID', fileID);

            if (fileID) {
                this.aiChatImgUrl = fileID;
                this.placeholderText = '描述问题，如:第2题第1小题怎么做?'
            }
        },
        send() {
            // 开启滚动动画
            this.enableScrollAnimation = true;
            // this.$emit('send', this.sendVal)
            // this.sendVal = ''
            // this.focus = true
            //两种方式
            //方式一: 把数据以对象形式赋值给updateList即可自动发送(推荐)
            // 如果图片不为空先发送图片
            let sendValTmp = this.sendVal;
            let sendImgTmp = this.aiChatImgUrl;
            console.log('send send send: ', this.sendVal, this.aiChatImgUrl);
            if (this.aiChatImgUrl) {
                let picNode = {
                    userId: 1,
                    id: getRandomNum(), // id必须是唯一值
                    name: '姜夔',
                    message: '',
                    img: this.aiChatImgUrl,
                    localImg: this.aiChatImgLocalPath,
                    time: new Date().getTime(),
                    avator: 'https://mp-0fe42d5b-82e4-482d-8ad1-81bb97905319.cdn.bspapp.com/default_pic/huaxue_2.webp',
                    tagLabel: 'jiang'
                }

                this.addListNode(picNode);

                // setTimeout(() => {
                // 	this.updateList = {
                // 		userId: 1,
                // 		id: getRandomNum(), // id必须是唯一值
                // 		name: '姜夔',
                // 		message: this.sendVal,
                // 		time: new Date().getTime(),
                // 		avator: 'https://mp-0fe42d5b-82e4-482d-8ad1-81bb97905319.cdn.bspapp.com/default_pic/huaxue_2.webp',
                // 		tagLabel: 'jiang'
                // 	}

                // 	this.clearAiChatImgUrl();
                // 	this.sendVal = '';
                // 	this.focus = true;

                // 	setTimeout(() => {
                // 		this.getAiResponse(sendValTmp, sendImgTmp);
                // 	}, 600)
                // }, 400)
            }
            // else {
            let txtNode = {
                userId: 1,
                id: getRandomNum(), // id必须是唯一值
                name: '姜夔',
                message: this.sendVal,
                time: new Date().getTime(),
                avator: 'https://mp-0fe42d5b-82e4-482d-8ad1-81bb97905319.cdn.bspapp.com/default_pic/huaxue_2.webp',
                tagLabel: 'jiang'
            };

            this.addListNode(txtNode);

            this.clearAiChatImgUrl();
            this.sendVal = '';
            this.focus = true;

            // this.scrollBottom(0);

            // setTimeout(() => {
            this.getAiResponse(sendValTmp, sendImgTmp);
            // }, 600)
            // }

            //方式二: 自己操作messageList => 可以通过push, 也可以messageList整个重新赋值
            // this.messageList.push({
            // 	userId: 1,
            // 	id: ++this.messageList[this.messageList.length - 1].id + 10, // id必须是唯一值
            // 	name: '白',
            // 	message: val,
            // 	time: new Date().getTime(),
            // 	avator: 'https://tva3.sinaimg.cn/large/9bd9b167gy1g4lhmt4zm5j21hc0xcnhs.jpg',
            // 	tagLabel: 1
            // })
        },
        getAiResponse(inputTxt, inputImg) {
            console.log('getAiResponse sddddddddddddd', inputTxt, inputImg);
            let _this = this;
            let data = {};
            if (inputImg) {
                data = {
                    app_id: "1876996248230322176",
                    conversation_id: "1887751490903375872",
                    key_value_pairs: [{
                        id: "user",
                        "ivfiles": [{
                            "type": 1,
                            "url": inputImg
                        }],
                        type: "input",
                        name: "用户提问",
                        value: inputTxt
                    }]
                };
            } else {
                data = {
                    app_id: "1876996248230322176",
                    conversation_id: "1887751490903375872",
                    key_value_pairs: [{
                        id: "user",
                        type: "input",
                        name: "用户提问",
                        value: inputTxt
                    }]
                };
            }
            uni.request({
                url: 'https://open.bigmodel.cn/api/llm-application/open/v2/application/generate_request_id', // 替换为实际的 API 地址
                data: data,
                method: 'POST',
                header: {
                    'Authorization': 'Bearer ac7d10ffe70d460f899f0ca958ade77e.mIc6yDBK6XGZ3SCD',
                    'accept': '*/*',
                    'content-type': 'application/json'
                },
                success: function (res) {
                    _this.aiRequestId = res.data.data.id;
                    console.log('请求成功 getAiResponse', _this.aiRequestId, res.data);
                    // 在这里可以处理响应数据，例如更新页面显示
                    _this.getStreamResult(_this.aiRequestId);
                    // setTimeout(() => {
                    // 	this.getTest(requestId);
                    // }, 1000)

                },
                fail: function (err) {
                    console.error('请求失败 getAiResponse', err);
                    // 可以在这里显示错误提示信息
                },
                complete: function () {
                    console.log('请求完成 getAiResponse');
                }
            });
        },
        getStreamResult(requestId) {
            let _this = this;
            let botInputing = {
                userId: 2,
                id: getRandomNum(), // id必须是唯一值
                name: '豆豆学',
                message: "",
                time: new Date().getTime(),
                avator: this.aiTeacherAvator,
                tagLabel: 'jiang'
            };

            _this.addListNode(botInputing);
            // _this.scrollBottom();

            let url = `https://open.bigmodel.cn/api/llm-application/open/v2/model-api/${requestId}/sse-invoke`;
            console.log('getStreamResult url: ', requestId, url);
            uni.request({
                url: url, // 替换为实际的 Event Stream URL
                method: 'POST',
                // responseType: 'text',
                header: {
                    'Authorization': 'Bearer ac7d10ffe70d460f899f0ca958ade77e.mIc6yDBK6XGZ3SCD',
                    'content-type': 'text/event-stream'
                },
                success: function (res) {
                    console.log('请求成功 原始结果res: ', res);
                    // let resList = res.data.split(/\n|<br\s*\/?>/i);
                    let result = _this.extractAndCombineMessages(res.data);
                    console.log('请求成功 getStreamResult', result, _this.list);
                    // _this.scrollBottom();
                },
                fail: function (err) {
                    console.error('请求失败:', err);
                },
                complete: function () {
                    console.log('请求完成 getStreamResult');
                }
            });
        },
        extractAndCombineMessages(data) {
            let _this = this;
            let size = _this.list.length;
            let arr = data.split('\n');
            let combinedMessages = '';
            for (let i = 0; i < arr.length; i++) {
                const item = arr[i];
                if (item.startsWith('data:') && item.includes('msg')) {
                    try {
                        // 提取出 JSON 字符串部分
                        const jsonPart = item.slice(5);
                        const parsedObj = JSON.parse(jsonPart);
                        if (parsedObj.msg) {
                            combinedMessages += parsedObj.msg;
                        }
                    } catch (error) {
                        console.error('解析 JSON 时出错:', error);
                    }
                }
            }

            console.log('combinedMessages bb', combinedMessages);
            // let mewCombinedMessages = combinedMessages.split('**').join('');
            // mewCombinedMessages = mewCombinedMessages.split(/<br\s*\/?>/i).join('');
            let mewCombinedMessages = _this.render(combinedMessages);
            if (size > 0) {
                _this.list[size - 1].message = mewCombinedMessages
            }

            _this.updateAiChatList(_this.list);

            return mewCombinedMessages;
        },
        blur() {
            console.log('blur is run');
            this.focus = false
            this.getFocus = false;
        },

        showText() {
            this.textShowFlag = true
        },
        startAudio(e) {
            if (!this.textShowFlag) {
                this.audioFlag = true
                this.y = e.changedTouches[0].pageY
            }
        },
        moveAudio(e) {
            const y = e.changedTouches[0].pageY
            if (this.y - y > 70) {
                this.readyCloseAudio = true
            } else {
                this.readyCloseAudio = false
            }
        },
        endAudio() {
            this.audioFlag = false
            this.readyCloseAudio = false
        }
    }
}
</script>

<style lang="scss">
@import "@/uni_modules/wtto-markdown/js_sdk/markdown.css";
@import "@/uni_modules/wtto-markdown/js_sdk/katex.css";

// import ''
@mixin msgBox ($diretion, $position, $symbol) {
    content: '';
    display: block;
    position: absolute;
    #{$diretion}: auto;
    #{$position}: 0;
    top: 10rpx;
    width: 0;
    height: 0;
    // transform: translate(100%);
    transform: translateX(#{$symbol}90%);
    border: 15rpx solid transparent;
    border-#{$diretion}-color: #fff
}

@mixin audioAnimate ($color) {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border: 8rpx solid $color;
    border-radius: 50%;
    // border-top-color: transparent !important;
    border-left-color: transparent !important;
    border-right-color: transparent !important;
    border-bottom-color: transparent !important;
}

@keyframes fade_show {
    0% {
        opacity: 0;
        display: none;
    }

    10% {
        opacity: 0.1;
        display: block;
    }

    100% {
        opacity: 1;
        display: block;
    }
}

@keyframes width_animate_mini {
    0% {
        width: 116rpx;
    }

    50% {
        width: 98rpx;
    }

    100% {
        width: 80rpx;
    }
}

@keyframes width_animate_large {
    0% {
        width: 80rpx;
    }

    50% {
        width: 98rpx;
    }

    100% {
        width: 116rpx;
    }
}

.hidden-view {
    /* 设置元素不可见 */
    opacity: 0;
    /* 为了保证有一定高度，可以根据需要调整 */
    height: 1px;
}

.typing-indicator {
    display: flex;
    align-items: center;
    justify-content: center;
    //   margin-top: 20px;
}

#scroll-view-content {
    // display: flex;
    // flex-direction: column-reverse;
    // transform: scaleY(-1);
}

.dot {
    width: 8px;
    height: 8px;
    background-color: #000;
    border-radius: 50%;
    margin: 0 3px;
    animation: typing 1.4s infinite both;
}

.dot-1 {
    animation-delay: 0.2s;
}

.dot-2 {
    animation-delay: 0.4s;
}

.dot-3 {
    animation-delay: 0.6s;
}

@keyframes typing {

    0%,
    80%,
    100% {
        opacity: 0;
    }

    40% {
        opacity: 1;
    }
}

.y-wrap {
    overflow: hidden;
    height: 100%;
    width: 100%;
    position: absolute;
    top: 0px;
    bottom: 0px;

    &_message_content {
        background-color: #f5f5f5;
        height: calc(100% - var(--bottom-height));
        transition: height 0.5s;
        transform: scaleY(-1);
        // transform: rotate(180deg);
        // -ms-transform: rotate(180deg);
        // -moz-transform: rotate(180deg);
        // -webkit-transform: rotate(180deg);
        // -o-transform: rotate(180deg);

        &_box {
            padding: 20rpx 20rpx;
            height: auto;
            transform: scaleY(-1);

            &>view:last-child {
                display: flex;
                justify-content: flex-start;
                align-items: flex-start;
            }

            &_msg {
                max-width: 581rpx;
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                padding: 0 20rpx;
                font-size: 30rpx;

                &__name {
                    // padding: 0 10px 5px;
                    padding-bottom: 10rpx;
                    height: 56rpx;
                    font-size: 24rpx;
                    display: flex;
                    align-items: center;

                    &>text {
                        padding: 0 10px;
                    }
                }

                &__me {
                    flex-direction: row-reverse;
                }

                &__val {
                    background-color: #fff;
                    display: flex;
                    justify-content: flex-start;
                    align-items: center;
                    flex-wrap: wrap;
                    word-break: break-all;
                    padding: 15rpx 15rpx 0rpx 15rpx;
                    border-radius: 10rpx;
                    position: relative;
                }

                &__dot {
                    background-color: #fff;
                    display: flex;
                    justify-content: flex-start;
                    align-items: center;
                    flex-wrap: wrap;
                    word-break: break-all;
                    padding: 15rpx;
                    border-radius: 10rpx;
                    position: relative;
                }

                &__val::before {
                    @include msgBox(right, left, '-')
                }

                &__my {
                    background-color: #3a9af6;
                    display: flex;
                    justify-content: flex-end;
                    align-items: center;
                    flex-wrap: wrap;
                    word-break: break-all;
                    padding: 15rpx;
                    border-radius: 10rpx;
                    position: relative;
                    color: #fff;
                }

                &__my::before {
                    @include msgBox(left, right, '+') border-left-color: #3a9af6;
                }

                &__img {
                    background-color: #f5f5f5;
                }
            }

            &_my {
                align-items: flex-end;
            }
        }

        &_my {
            &>view:last-child {
                flex-direction: row-reverse;
            }
        }
    }

    &_footer {
        width: 100%;
        background-color: #fff;
        position: relative;
        z-index: 10078;

        &_show_box {
            padding: 20rpx 20rpx 20rpx 20rpx;
            box-sizing: border-box;
            height: 140rpx;
            display: flex;
            align-items: center;
            // justify-content: flex-end;
            // margin-top: 20rpx;
            // margin-bottom: 20rpx;

            &__ipt {
                flex: 1;
                padding: 0 10rpx 0 10rpx;
            }

            .fade_show {
                animation: fade_show .3s linear;
            }

            .width_to_mini {
                animation: width_animate_mini .3s linear;
            }

            .width_to_large {
                animation: width_animate_large .3s linear;
            }

            view:last-child {
                display: flex;
            }
        }

        &_hide_box {
            width: 100%;
            display: flex;
            flex-wrap: wrap;

            &_item {
                width: 25%;
                display: flex;
                justify-content: center;
                padding-bottom: 20rpx;

                &__btn {
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    align-items: center;
                }
            }
        }
    }

    &_audio {
        // background-color: #fff;
        position: relative;
        width: 210rpx;
        height: 210rpx;
        border-radius: 20rpx;
        padding: 0 20rpx;
        transform: translateY(25%);

        &__large {
            transition: border-color 0.6s;
            width: 200rpx;
            height: 200rpx;
            @include audioAnimate(#000);
        }

        &__small {
            transition: border-color 0.4s;
            width: 125rpx;
            height: 125rpx;
            @include audioAnimate(#000);
        }

        &__mini {
            transition: border-color 0.2s;
            width: 50rpx;
            height: 50rpx;
            @include audioAnimate(#000);
        }
    }

    // $_audio_popup {

    // }

}
</style>