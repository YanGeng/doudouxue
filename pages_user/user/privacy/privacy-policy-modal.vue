<template>
    <view class="modal-mask" @click="closeModal" v-if="showModal">
        <view class="modal-container">
            <view class="modal-title">隐私政策提示</view>
            <view class="modal-content">
                请您仔细阅读我们的《隐私政策》，通过点击“同意”按钮，即表示您同意我们按照《隐私政策》收集、使用、共享和保护您的个人信息。
            </view>
            <view class="modal-buttons">
                <button @click="rejectPolicy">不同意</button>
                <button @click="acceptPolicy">同意</button>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            showModal: false
        };
    },
    methods: {
        openModal() {
            this.showModal = true;
        },
        closeModal() {
            this.showModal = false;
        },
        acceptPolicy() {
            uni.setStorageSync('hasAcceptedPrivacyPolicy', true);
            this.closeModal();
            // 可以在这里添加跳转到主页面等操作
        },
        rejectPolicy() {
            // 处理用户不同意的情况，如退出应用
            uni.exitApp();
        }
    }
};
</script>

<style scoped>
.modal-mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
}

.modal-container {
    background-color: white;
    padding: 20px;
    border-radius: 10px;
    width: 80%;
}

.modal-title {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 10px;
}

.modal-content {
    margin-bottom: 20px;
}

.modal-buttons {
    display: flex;
    justify-content: space-around;
}

.modal-buttons button {
    padding: 10px 20px;
    border-radius: 5px;
}
</style>    