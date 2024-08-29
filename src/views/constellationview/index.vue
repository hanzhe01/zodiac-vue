<template>
    <div class="homePage">
        <div class="container" v-loading="state.loadingShow">
            <div class="wheelChunk"></div>
            <div class="titleChunk">
                <p class="tac title">{{ state.detailsObj.constellationName }}</p>
                <p class="tar readMore" @click="onReadMoreChange">Read More</p>
                <div class="imgBox">
                    <img :src="currentImage" alt="" />
                </div>
                <p class="tac dater">
                    <span class="full_span">{{ state.fullMonth }}</span>
                    <span class="full_span">,</span>
                    <span class="full_span">{{ state.fullYear }}</span>
                </p>

                <div class="mt20 overallChunk">
                    <div class="tac item_cel">
                        <span class="title">Daily Horoscope</span>
                    </div>
                    <div class="tac item_cel">
                        <span style="text-align:left">
                            <el-rate v-model="state.detailsObj.horoscopeFortuneStar" allow-half disabled />
                        </span>
                    </div>
                    <div class="item_cel">
                        <div class="content">
                            {{ state.detailsObj.horoscopeFortune }}
                        </div>
                    </div>
                    <div class="tac item_cel">
                        <span class="title">Zodiac Compatibility</span>
                    </div>
                    <div class="mt20 item_cel" id="wen">
                        <div class="actionBtn">
                            <ul class="selectUl">
                                <li>
                                    <el-button id="jjjj" style="">{{
                                        state.detailsObj.constellationName
                                        }}</el-button>
                                </li>
                                <li class="mathch_li f800">Match</li>
                                <li id="feng">
                                    <el-select id="wwww" v-model="state.selectVal" placeholder="Select" size="default"
                                        @change="onExamNameChange">
                                        <el-option v-for="item in state.dropdownArr" :key="item.id" :label="item.name"
                                            :value="item.id" />
                                    </el-select>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="item_cel">
                        <ul class="i_ul">
                            <li>
                                <div class="li_l f800">Match:</div>
                                <div class="li_r">
                                    <el-rate v-model="state.detailsObj.starLevel" color="#F4C36F" allow-half
                                        disabled />
                                </div>
                            </li>
                            <li>
                                <div class="li_l f800">Summary:</div>
                                <div class="static">
                                    {{ state.detailsObj.suggestion }}
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="mt20 statisticChunk">
                    <div class="item">
                        <div class="i_content">
                            <p class="text_12 p_12">
                                <span class="round" :style="`background-color: ${state.detailsObj.luckyColor}`"></span>
                                <span class="ml20 s_cor">{{
                                    state.detailsObj.luckyColor
                                    }}</span>
                            </p>
                            <div class="tac tag_2 flex-col">
                                <span class="text_13 f800">Lucky Color</span>
                            </div>
                        </div>
                    </div>
                    <div class="item">
                        <div class="i_content">
                            <p class="tac text_12 p_13">
                                {{ state.detailsObj.luckyNumbers }}
                            </p>
                            <div class="tac tag_2 flex-col">
                                <span class="text_13 f800">Lucky Number</span>
                            </div>
                        </div>
                    </div>
                    <div class="item">
                        <div class="i_content">
                            <p class="text_12 p_13">{{ state.detailsObj.luckyTime }}</p>
                            <div class="tac tag_2 flex-col">
                                <span class="text_13 f800">Lucky Time</span>
                            </div>
                        </div>
                    </div>
                    <div class="item">
                        <div class="i_content">
                            <p class="tac text_12 p_14">
                                <span class="fz26 s_1">{{ state.detailsObj.luckyItems }}</span>
                                <span class="fz26 s_1" v-if="state.detailsObj.purchaseLink">
                                    <a style="color: #1192ff" :href="state.detailsObj.purchaseLink">Purchase link</a>
                                </span>
                            </p>
                            <div class="tac tag_2 flex-col">
                                <span class="text_13 f800">Lucky Item</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="listChunk">
                    <div class="branner">
                        <div class="imgBox">
                            <img src="../../assets/img/allotype.png" alt="" />
                        </div>
                    </div>
                    <div class="contentRow">
                        <div class="item">
                            <div class="score">
                                <div class="sco_title">
                                    <span class="name">{{
                                        state.detailsObj.firstTitleName
                                        }}</span>
                                </div>
                                <div class="ml30 s_rate">
                                    <el-rate v-model="state.detailsObj.firstTitleStar" color="#F4C36F" allow-half
                                        disabled />
                                </div>
                            </div>
                            <div class="i_content">
                                {{ state.detailsObj.firstTitleContent }}
                            </div>
                        </div>
                        <div class="item">
                            <div class="score">
                                <div class="sco_title">
                                    <span class="name">{{
                                        state.detailsObj.secondTitleName
                                        }}</span>
                                </div>
                                <div class="ml30 s_rate">
                                    <el-rate v-model="state.detailsObj.secondTitleStar" color="#F4C36F" allow-half
                                        disabled />
                                </div>
                            </div>
                            <div class="i_content">
                                {{ state.detailsObj.secondTitleContent }}
                            </div>
                        </div>
                        <div class="item">
                            <div class="score">
                                <div class="sco_title">
                                    <span class="name">{{
                                        state.detailsObj.thirdTitleName
                                        }}</span>
                                </div>
                                <div class="ml30 s_rate">
                                    <el-rate v-model="state.detailsObj.thirdTitleStar" color="#F4C36F" allow-half
                                        disabled />
                                </div>
                            </div>
                            <div class="i_content">
                                {{ state.detailsObj.thirdTitleContent }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { getPreviewDetails } from "@/api/constellation/constellation";
import moment from "moment";
import { ref, onMounted } from 'vue';
const state = reactive({
    fullMonth: "",
    fullDay: "",
    fullYear: "",
    selectVal: 1,    // 默认选中第一个选项的id
    dropdownArr: [
        {
            name: "Aries",
            id: 1,
        },
        {
            name: "Taurus",
            id: 2,
        },
        {
            name: "Gemini",
            id: 3,
        },
        {
            name: "Cancer",
            id: 4,
        },
        {
            name: "Leo",
            id: 5,
        },
        {
            name: "Virgo",
            id: 6,
        },
        {
            name: "Libra",
            id: 7,
        },
        {
            name: "Scorpio",
            id: 8,
        },
        {
            name: "Sagittarius",
            id: 9,
        },
        {
            name: "Capricorn",
            id: 10,
        },
        {
            name: "Aquarius",
            id: 11,
        },
        {
            name: "Pisces",
            id: 12,
        },
    ],
    detailsObj: {},
});
const materiallId = ref()
// 在组件挂载时获取 URL 参数并调用 fetchData 函数
onMounted(() => {
    const urlParams = new URLSearchParams(window.location.search); // 获取 URL 查询参数
    const id = urlParams.get('id'); // 获取 Id 参数
    const constellationId = urlParams.get('constellationId'); // 获取 constellationId 参数

    if (id && constellationId) {
        fetchData(id, constellationId); // 调用函数获取数据
    }
});
// 获取数据的函数
const fetchData = async (id, constellationId) => {
    try {
        const now = moment();
        state.fullMonth = now.format("MMMM DD");
        state.fullYear = now.format("YYYY");
        materiallId.value = id;
        currentIndex.value = constellationId
        const params = {
            materiallLibraryId: id,
            pairingId: state.selectVal
        }
        getDetails(params)
    } catch (error) {
        console.error('加载数据失败', error);
    }
};

const onExamNameChange = () => {
    const params = {
        materiallLibraryId: materiallId.value,
        pairingId: state.selectVal
    }
    getDetails(params)
};
function getDetails(params) {
    getPreviewDetails(params).then(response => {
        if (response.code === 200) {
            state.detailsObj = response.data;
        } else {
            ElMessage({
                message: response.msg,
                type: "error",
            });
        }
    });
}

// 按顺序定义图片路径数组
const imageUrls = [
    new URL('@/assets/img/by.png', import.meta.url).href,
    new URL('@/assets/img/jn.png', import.meta.url).href,
    new URL('@/assets/img/szz.png', import.meta.url).href,
    new URL('@/assets/img/jx.png', import.meta.url).href,
    new URL('@/assets/img/sz.png', import.meta.url).href,
    new URL('@/assets/img/cn.png', import.meta.url).href,
    new URL('@/assets/img/tp.png', import.meta.url).href,
    new URL('@/assets/img/tx.png', import.meta.url).href,
    new URL('@/assets/img/ss.png', import.meta.url).href,
    new URL('@/assets/img/mj.png', import.meta.url).href,
    new URL('@/assets/img/sp.png', import.meta.url).href,
    new URL('@/assets/img/sy.png', import.meta.url).href,
];

// 定义一个用于存储当前图片编号的变量
const currentIndex = ref(0);

// 动态获取当前图片路径的计算属性
const currentImage = computed(() => {
    return imageUrls[currentIndex.value - 1];
});
</script>
<style>
@import "@/assets/css/reset.css";
/* .el-select__wrapper {
  height: 68px !important;
  text-align: center !important;
  font-size: 24px !important;
  border-radius: 6px !important;
} */
</style>
<style scoped>
@import "@/assets/css/web.scss";
@import "@/assets/css/mobile.scss";
@import "@/assets/font/font.css";
/** max-width 小于或等于 */
/** min-width 大于或等于 */

#app {
    width: 100%;
    height: 100%;
}

.tac {
    text-align: center;
}

/* .el-rate {
  --el-rate-icon-size: 10px;
} */
</style>
