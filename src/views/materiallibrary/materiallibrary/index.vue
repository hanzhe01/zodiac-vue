<template>
  <div class="app-container">
    <el-row>
      <el-col :span="4">
        <el-card style="max-width: 250px; height: 100%;">
          <el-input v-model="queryParams.constellationId" size="" placeholder="星座名称"
            style="margin-bottom: 18px;height: 40px;" suffix-icon="Search" @keyup.enter="handleQuery" />
          <el-card>
            <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px"
              style="overflow-y: auto;">
              <el-menu class="el-menu-vertical-demo" default-active="1">
                <el-menu-item v-for="(option, index) in options" :key="index" :index="option.value"
                  :class="{ 'active-menu-item': option.isActive }" @click="onMenuItemClick(option)">
                  <span>{{ option.label }}</span>
                </el-menu-item>
              </el-menu>
            </el-form>
          </el-card>
        </el-card>
      </el-col>

      <el-col :span="20">
        <el-card class="box-card" style="max-width: 100%; height: 100%;">
          <template #header>
            <div class="card-header">
              <span><el-text class="mx-1" size="large">素材内容</el-text></span>
            </div>
          </template>
          <el-row :gutter="18" class="mb8">
            <el-col :span="5">
              <el-menu class="el-menu-demo" mode="horizontal" style="height: 30px;" :default-active="activeIndex">
                <el-menu-item index="1" @click="onIsTodayClick(1)">每日运势</el-menu-item>
                <el-menu-item index="2" @click="onIsTodayClick(0)" v-if="false">每周运势</el-menu-item>
              </el-menu>
            </el-col>
            <el-col :span="1.5">
              <el-button type="primary" plain icon="Plus" @click="handleAdd"
                v-hasPermi="['materiallibrary:materiallibrary:add']">新建素材</el-button>
            </el-col>
            <el-col :span="1.5">
              <el-button type="success" plain icon="Edit" @click="dialogAutoFormVisible = true"
                v-hasPermi="['materiallibrary:materiallibrary:auto']">自动生成</el-button>
            </el-col>
            <el-col :span="1.5">
              <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete"
                v-hasPermi="['materiallibrary:materiallibrary:remove']">删除</el-button>
            </el-col>
            <!-- <el-col :span="1.5">
              <el-button type="warning" plain icon="Download" @click="handleExport"
                v-hasPermi="['materiallibrary:materiallibrary:export']">导出</el-button>
            </el-col> -->
            <el-col :span="1.5">
              <el-button type="info" plain icon="Upload" @click="handleImport"
                v-hasPermi="['materiallibrary:materiallibrary:import']">导入</el-button>
            </el-col>
            <el-col :span="1.5">
              <el-form-item label="创建时间" style="width: 308px">
                <el-date-picker v-model="daterangeGenerationDate" value-format="YYYY-MM-DD" type="daterange"
                  range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-form-item>
              <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
              <el-button icon="Refresh" @click="resetQuery">重置</el-button>
            </el-form-item>
            <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
          </el-row>

          <el-table v-loading="loading" :data="materiallibraryList" @selection-change="handleSelectionChange"
            height="65vh">
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column label="星座名称" align="center" prop="constellationName" />
            <el-table-column label="总体运势星级" align="center" prop="horoscopeFortuneStar">
              <template #default="scope">
                <span style="text-align:left">
                  <el-rate v-model="scope.row.horoscopeFortuneStar" size="large" disabled="true" class="oy-el-rate" />
                </span>
              </template>
            </el-table-column>
            <el-table-column label="运势一星级" align="center" prop="firstTitleStar">
              <template #default="scope">
                <span style="text-align:left">
                  <el-rate v-model="scope.row.firstTitleStar" size="large" disabled="true" class="oy-el-rate" />
                </span>
              </template>
            </el-table-column>
            <el-table-column label="运势二星级" align="center" prop="secondTitleStar">
              <template #default="scope">
                <span style="text-align:left">
                  <el-rate v-model="scope.row.secondTitleStar" size="large" disabled="true" class="oy-el-rate" />
                </span>
              </template>
            </el-table-column>
            <el-table-column label="运势三星级" align="center" prop="thirdTitleStar">
              <template #default="scope">
                <span style="text-align:left">
                  <el-rate v-model="scope.row.thirdTitleStar" size="large" disabled="true" class="oy-el-rate" />
                </span>
              </template>
            </el-table-column>

            <el-table-column label="创建时间" align="center" prop="generationDate" width="180">
              <template #default="scope">
                <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d} {h}:{m}:{s}') }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
              <template #default="scope">
                <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
                  v-hasPermi="['materiallibrary:materiallibrary:edit']">修改</el-button>
                <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
                  v-hasPermi="['materiallibrary:materiallibrary:remove']">删除</el-button>
                <el-button link type="primary" icon="View" @click="showView(scope.row)"
                  v-hasPermi="['constellation:constellation:showView']">预览</el-button>
                <el-tooltip class="box-item" effect="light" content="复制ID" placement="top">
                  <el-button link icon="CopyDocument" size="small" type="primary" circle
                    @click="copyText(scope.row.id)"></el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
          <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
            v-model:limit="queryParams.pageSize" @pagination="getList" style="margin-top: 15px" />
        </el-card>
      </el-col>


      <!-- 添加或修改素材管理对话框 -->
      <el-dialog :title="title" v-model="open" width="1100px" append-to-body>
        <el-form ref="materiallibraryRef" :model="form" :rules="rules" label-width="80px">
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="星座分组:">
                <el-select v-model="form.constellationId" placeholder="请选择星座分组" clearable :disabled="isEditing">
                  <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8" v-if="isEditing">
              <el-form-item label="生日:">
                <el-text class="mx-1" size="large">{{ form.birthday }}</el-text>
              </el-form-item>
            </el-col>
            <el-col :span="8" v-if="isEditing">
              <el-form-item label="素材ID:">
                <el-text class="mx-1" size="small">{{ form.id }}</el-text>
                <el-tooltip class="box-item" effect="light" content="复制ID" placement="top">
                  <el-button link icon="CopyDocument" size="small" type="primary" circle
                    @click="copyText(form.id)"></el-button>
                </el-tooltip>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="总体运势:" prop="horoscopeFortuneStar">
            <span style="text-align:left">
              <el-rate v-model="form.horoscopeFortuneStar" allow-half />
            </span>
            <!-- <el-input v-model="form.horoscopeFortuneStar" placeholder="请输入总体运势星级" /> -->
          </el-form-item>
          <el-form-item prop="horoscopeFortune">
            <el-input v-model="form.horoscopeFortune" type="textarea" placeholder="请输入内容" />
          </el-form-item>
          <!-- 新的布局开始 -->
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="幸运色:" prop="luckyColor">
                <el-input v-model="form.luckyColor" placeholder="请输入幸运色" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="幸运数字:" prop="luckyNumbers">
                <el-input v-model="form.luckyNumbers" placeholder="请输入幸运数字" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="幸运时间" prop="luckyTime">
                <el-time-select v-model="startTime" style="width: 140px" :max-time="endTime" class="mr-4"
                  @change="updateLuckyTime" placeholder="Start time" start="06:30" step="00:30" end="23:00" />
                <el-time-select v-model="endTime" style="width: 140px" :min-time="startTime" placeholder="End time"
                  @change="updateLuckyTime" start="07:00" step="00:30" end="23:30" />
                <!-- 显示luckyTime -->
                <span>{{ form.luckyTime }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="是否本周" prop="isWeekFortune" v-if="false">
                <el-radio-group v-model="form.isWeekFortune">
                  <el-radio value="0">是</el-radio>
                  <el-radio value="1">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item label="幸运物品" prop="luckyItems">
            <el-input v-model="form.luckyItems" placeholder="请输入幸运物品" />
          </el-form-item>
          <el-form-item label="购买链接" prop="purchaseLink">
            <el-input v-if="showInput === 0" v-model="form.purchaseLink" placeholder="请输入购买链接" />
          </el-form-item>
          <el-row :gutter="20" class="row-bg">
            <el-col :span="6">
              <el-form-item label="运势一:" prop="firstTitleName">
                <el-input v-model="form.firstTitleName" placeholder="请输入标题" />
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <span style="text-align:left">
                <el-rate v-model="form.firstTitleStar" allow-half />
              </span>
            </el-col>
          </el-row>
          <el-form-item label="" prop="firstTitleContent">
            <el-input v-model="form.firstTitleContent" type="textarea" placeholder="请输入运势内容" />
          </el-form-item>
          <el-row :gutter="20">
            <el-col :span="6">
              <el-form-item label="运势二:" prop="secondTitleName">
                <el-input v-model="form.secondTitleName" placeholder="请输入标题" />
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <span style="text-align:left">
                <el-rate v-model="form.secondTitleStar" allow-half />
              </span>
            </el-col>
          </el-row>
          <el-form-item label="" prop="secondTitleContent">
            <el-input v-model="form.secondTitleContent" type="textarea" placeholder="请输入运势内容" />
          </el-form-item>
          <el-row :gutter="20">
            <el-col :span="6">
              <el-form-item label="运势三:" prop="thirdTitleName">
                <el-input v-model="form.thirdTitleName" placeholder="请输入标题" />
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <span style="text-align:left">
                <el-rate v-model="form.thirdTitleStar" allow-half />
              </span>
            </el-col>
          </el-row>
          <el-form-item label="" prop="thirdTitleContent">
            <el-input v-model="form.thirdTitleContent" type="textarea" placeholder="请输入运势内容" />
          </el-form-item>
        </el-form>
        <template #footer>
          <div class="dialog-footer">
            <el-button type="primary" @click="submitForm">确 定</el-button>
            <el-button @click="cancel">取 消</el-button>
          </div>
        </template>
      </el-dialog>
      <!-- 素材导入对话框 -->
      <el-dialog :title="upload.title" v-model="upload.open" width="400px" append-to-body>
        <el-upload ref="uploadRef" :limit="1" accept=".xlsx, .xls" :headers="upload.headers"
          :action="upload.url + '?updateSupport=' + upload.updateSupport" :disabled="upload.isUploading"
          :on-progress="handleFileUploadProgress" :on-success="handleFileSuccess" :auto-upload="false" drag>
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <template #tip>
            <div class="el-upload__tip text-center">
              <span>仅允许导入xls、xlsx格式文件。</span>
              <el-link type="primary" :underline="false" style="font-size:12px;vertical-align: baseline;"
                @click="importTemplate">下载模板</el-link>
            </div>
          </template>
        </el-upload>
        <template #footer>
          <div class="dialog-footer">
            <el-button type="primary" @click="submitFileForm">确 定</el-button>
            <el-button @click="upload.open = false">取 消</el-button>
          </div>
        </template>
      </el-dialog>
    </el-row>
    <el-dialog v-model="dialogVisible" title="预览" width="80%">
      <div class="homePage">
        <div class="container">
          <div class="wheelChunk"></div>
          <div class="titleChunk">
            <p class="tac title">{{ state.detailsObj.constellationName }}</p>
            <p class="tar readMore">Read More</p>
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
                <span class="title">Overall Horoscope</span>
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
                    <li class="mathch_li">Mathch</li>
                    <li id="feng" style="font-size: 24px">
                      <el-select id="wwww" v-model="state.selectVal" placeholder="Select" size="default"
                        suffix-icon="CaretBottom" class="custom-el-select__wrapper" @change="onExamNameChange">
                        <el-option v-for="item in state.dropdownArr" :key="item.id" :label="item.name"
                          :value="item.id" />
                      </el-select>
                    </li>
                  </ul>
                </div>
              </div>
              <div class="item_cel">
                <div class="match">
                  <span class="name">Mathc:</span>
                  <span class="">
                    <el-rate v-model="state.detailsObj.starLevel" allow-half disabled />
                  </span>
                </div>
                <div class="advice">
                  <span class="name">Advice:</span>
                  <span class="static">
                    {{ state.detailsObj.suggestion }}
                  </span>
                </div>
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
                    <span class="text_13">Lucky Color</span>
                  </div>
                </div>
              </div>
              <div class="item">
                <div class="i_content">
                  <p class="tac text_12 p_13">
                    {{ state.detailsObj.luckyNumbers }}
                  </p>
                  <div class="tac tag_2 flex-col">
                    <span class="text_13">Lucky Numbers</span>
                  </div>
                </div>
              </div>
              <div class="item">
                <div class="i_content">
                  <p class="text_12 p_13">{{ state.detailsObj.luckyTime }}</p>
                  <div class="tac tag_2 flex-col">
                    <span class="text_13">Lucky Time</span>
                  </div>
                </div>
              </div>
              <div class="item">
                <div class="i_content" style="padding-top: 10px;">
                  <p class="tac text_12 p_14">

                    <span class="fz26 s_1">{{ state.detailsObj.luckyItems }}</span>
                    <span class="fz26 s_1">
                      <a style="color: #1192ff" :href="state.detailsObj.purchaseLink" v-if="state.detailsObj.purchaseLink !== ''" target="_blank">Purchase link</a>
                    </span>
                  <div class="tac tag_2 flex-col" style="margin-top: 13px;">
                    <span class="text_13">Lucky Item</span>
                  </div>
                  </p>
                </div>
              </div>
            </div>
            <div class="listChunk">
              <div class="branner">
                <div class="imgBox">
                  <img src="../../../assets/img/allotype.png" alt="" />
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
                      <el-rate v-model="state.detailsObj.firstTitleStar" allow-half disabled />
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
                      <el-rate v-model="state.detailsObj.secondTitleStar" allow-half disabled />
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
                      <el-rate v-model="state.detailsObj.thirdTitleStar" allow-half disabled />
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
    </el-dialog>
    <!-- 自动生成对话框 -->
    <el-dialog v-model="dialogAutoFormVisible" title="自动生成(一条生成时间约为30秒)" width="500">
      <el-form :model="autoForm">
        <el-form-item label="星座名称" :label-width="formLabelWidth">
          <el-select v-model="autoForm.constellationName" :placeholder="请选择星座分组">
            <el-option v-for="item in constellationOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="生成条数" :label-width="formLabelWidth">
          <el-select v-model="autoForm.number" :placeholder="请选择生成条数一条生成时间约30秒">
            <el-option label="1" value="1" />
            <el-option label="2" value="2" />
            <el-option label="3" value="3" />
            <el-option label="4" value="4" />
            <el-option label="5" value="5" />
            <el-option label="6" value="6" />
            <el-option label="7" value="7" />
            <el-option label="8" value="8" />
            <el-option label="9" value="9" />
            <el-option label="10" value="10" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth">
          <el-input v-model="autoForm.remark" autocomplete="off" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-link type="primary" :underline="false" style="font-size:12px;vertical-align: baseline;" :disabled="dis_auto"
                @click="downAutoData">下载自动生成预览数据&nbsp;&nbsp;&nbsp;</el-link>
          <el-button @click="dialogAutoFormVisible = false">取消</el-button>
          <el-button type="primary" @click="submitAutoForm" v-loading.fullscreen.lock="fullscreenLoading" element-loading-text="温馨提示：正在自动生成（1条素材生成时间最多耗时20秒）···">
            确定生成
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Materiallibrary">
import { getPreviewDetails } from "@/api/constellation/constellation";
import { listMateriallibrary, getMateriallibrary, delMateriallibrary, addMateriallibrary, updateMateriallibrary } from "@/api/materialLibrary/materialLibrary";

const { proxy } = getCurrentInstance();
//消息弹出框
import { ElMessage } from 'element-plus'
//是否显示生日和ID框，点击编辑显示，添加不显示
const isEditing = ref(false); // 根据实际情况初始化此变量

const materiallibraryList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const daterangeGenerationDate = ref([]);
/**
 * 每日素材菜单
 */
const activeIndex = ref('1')
const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    constellationId: 1,
    luckyColor: null,
    luckyNumbers: null,
    isWeekFortune: 1,
    generationDate: null
  },
  rules: {
  }
});

const { queryParams, form, rules } = toRefs(data);

/**
 * 幸运时间的开始时间和结束时间
 */
const startTime = ref("")
const endTime = ref("")

/**
 * 拼接开始时间和结束时间
 */
const updateLuckyTime = () => {
  form.value.luckyTime = `${startTime.value}-${endTime.value}`
  console.log(startTime.value)
}

/**
 * 星座下拉框
 */
const options = reactive(
  [
    { label: '白羊座', value: '1', isActive: true },
    { label: '金牛座', value: '2', isActive: false },
    { label: '双子座', value: '3', isActive: false },
    { label: '巨蟹座', value: '4', isActive: false },
    { label: '狮子座', value: '5', isActive: false },
    { label: '处女座', value: '6', isActive: false },
    { label: '天秤座', value: '7', isActive: false },
    { label: '天蝎座', value: '8', isActive: false },
    { label: '射手座', value: '9', isActive: false },
    { label: '摩羯座', value: '10', isActive: false },
    { label: '水瓶座', value: '11', isActive: false },
    { label: '双鱼座', value: '12', isActive: false }
  ]
)

// 用于存储当前选中的菜单项的 label
const selectedLabel = ref(1);
// 处理星座菜单项点击事件
const onMenuItemClick = (option) => {
  options.forEach(opt => {
    opt.isActive = opt.value === option.value;
  });
  form.value.constellationId = option.value;
  queryParams.value.constellationId = option.value;
  selectedLabel.value = option.value;
  handleQuery();
};
// 处理每周或者每日运势菜单项点击事件
const onIsTodayClick = (value) => {
  queryParams.value.isWeekFortune = value;
  handleQuery();
};
//复制行id，素材id
const copyText = async (id) => {
  try {
    await navigator.clipboard.writeText(id);
    ElMessage.success('素材ID已复制到剪贴板')
  } catch (err) {
    ElMessage.error('无法复制ID:', err)
  }
};
/** 查询素材管理列表 */
function getList() {
  loading.value = true;
  queryParams.value.params = {};
  if (null != daterangeGenerationDate && '' != daterangeGenerationDate) {
    queryParams.value.params["beginGenerationDate"] = daterangeGenerationDate.value[0];
    queryParams.value.params["endGenerationDate"] = daterangeGenerationDate.value[1];
  }
  listMateriallibrary(queryParams.value).then(response => {
    materiallibraryList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

// 取消按钮
function cancel() {
  open.value = false;
  reset();
}

// 表单重置
function reset() {
  form.value = {
    id: null,
    constellationId: null,
    horoscopeFortune: null,
    horoscopeFortuneStar: null,
    luckyColor: null,
    luckyNumbers: null,
    luckyTime: null,
    luckyItems: null,
    purchaseLink: null,
    firstTitleName: null,
    firstTitleContent: null,
    firstTitleStar: null,
    secondTitleName: null,
    secondTitleContent: null,
    secondTitleStar: null,
    thirdTitleName: null,
    thirdTitleContent: null,
    thirdTitleStar: null,
    isWeekFortune: null,
    generationDate: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null,
  };
  proxy.resetForm("materiallibraryRef");
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  daterangeGenerationDate.value = [];
  proxy.resetForm("queryRef");
  handleQuery();
}

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();

  isEditing.value = false;
  open.value = true;
  title.value = "添加素材管理";
  form.value.constellationId = selectedLabel.value;
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  isEditing.value = true;
  const _id = row.id || ids.value
  getMateriallibrary(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改素材管理";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["materiallibraryRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateMateriallibrary(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addMateriallibrary(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getList();
        });
      }
    }
  });
}

/** 删除按钮操作 */
function handleDelete(row) {
  const _ids = row.id || ids.value;
  proxy.$modal.confirm('是否确认删除素材管理编号为"' + _ids + '"的数据项？').then(function () {
    return delMateriallibrary(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => { });
}

/** 导出按钮操作 */
// function handleExport() {
//   proxy.download('materiallibrary/materiallibrary/export', {
//     ...queryParams.value
//   }, `materiallibrary_${new Date().getTime()}.xlsx`)
// }

import { getToken } from "@/utils/auth";

/*** 用户导入参数 */
const upload = reactive({
  // 是否显示弹出层（用户导入）
  open: false,
  // 弹出层标题（用户导入）
  title: "",
  // 是否禁用上传
  isUploading: false,
  // 设置上传的请求头部
  headers: { Authorization: "Bearer " + getToken() },
  // 上传的地址
  url: import.meta.env.VITE_APP_BASE_API + "/materiallibrary/materiallibrary/importData"
});

/** 导入按钮操作 */
function handleImport() {
  upload.title = "批量素材导入";
  upload.open = true;
};
/** 下载模板操作 */
function importTemplate() {
  proxy.download("materiallibrary/materiallibrary/importTemplate", {
  }, `materialLibrary_template_${new Date().getTime()}.xlsx`);
};

/**文件上传中处理 */
const handleFileUploadProgress = (event, file, fileList) => {
  upload.isUploading = true;
};

/** 文件上传成功处理 */
const handleFileSuccess = (response, file, fileList) => {
  upload.open = false;
  upload.isUploading = false;
  proxy.$refs["uploadRef"].handleRemove(file);
  proxy.$alert("<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" + response.msg + "</div>", "导入结果", { dangerouslyUseHTMLString: true });
  getList();
};

/** 提交上传文件 */
function submitFileForm() {
  proxy.$refs["uploadRef"].submit();
};

getList();

/**
 * 预览组件控制
 * 
 */
import moment from "moment";
const dialogVisible = ref(false)
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
const materiallId = ref(null)
const onExamNameChange = () => {
  const params = {
    materiallLibraryId: materiallId.value,
    pairingId: state.selectVal
  }
  getDetails(params)
};

function showView(row) {
  const now = moment();
  state.fullMonth = now.format("MMMM DD");
  state.fullYear = now.format("YYYY");
  const _id = row.id
  materiallId.value = _id;
  currentIndex.value = row.constellationId
  const params = {
    materiallLibraryId: _id,
    pairingId: state.selectVal
  }
  getDetails(params)
  dialogVisible.value = true;
}
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
  return imageUrls[currentIndex.value-1];
});



/**
 * 自动生成
 */
const dialogAutoFormVisible = ref(false)
const formLabelWidth = '140px'
const constellationOptions = [
  { label: '白羊座', value: 'Aries' },
  { label: '金牛座', value: 'Taurus' },
  { label: '双子座', value: 'Gemini' },
  { label: '巨蟹座', value: 'Cancer' },
  { label: '狮子座', value: 'Leo' },
  { label: '处女座', value: 'Virgo' },
  { label: '天秤座', value: 'Libra' },
  { label: '天蝎座', value: 'Scorpio' },
  { label: '射手座', value: 'Sagittarius' },
  { label: '摩羯座', value: 'Capricorn' },
  { label: '水瓶座', value: 'Aquarius' },
  { label: '双鱼座', value: 'Pisces' }
]

// 自动生成表单数据
const autoForm = reactive({
  constellationName: '',
  number: '',
  remark: '生成英文',
})

import { autoAiGeneration } from "@/api/materialLibrary/auto";

/** 自动生成确认提交按钮 */
import { ElLoading } from 'element-plus'
import { ref } from "vue";
/**全屏加载条 */
const fullscreenLoading = ref(false)
/**下载数据禁用 */
const dis_auto = ref(true)
async function submitAutoForm() {
  fullscreenLoading.value = true
  try {
    await autoAiGeneration(autoForm).then(response => {
      if (response.code === 200) {
        ElMessage({
          message: response.msg,
          type: "success",
        });
      } else {
        ElMessage({
          message: response.msg,
          type: "error",
        });
      }
    })
  } catch (error) {
    ElMessage({
      message: '操作失败，请稍后再试',
      type: "error",
    });
  } finally {
    fullscreenLoading.value = false; // 关闭 loading
    dis_auto.value = false
    // dialogAutoFormVisible.value = false;
    getList();
  }
}
/**
 * 自动生成数据下载预览
 */
function downAutoData() {
  proxy.download('send/AutoExport',{},`materialData_${new Date().getTime()}.xlsx`)
}


</script>
<style>
@import "../../../assets/css/reset.css";
</style>
<style scoped>
@import "../../../assets/css/web.scss";
@import "../../../assets/css/mobile.scss";

/** max-width 小于或等于 */
/** min-width 大于或等于 */
/* 设置 suffix-icon 图标的大小 */

.tac {
  text-align: center;
}

/* 自定义 CSS 类 */
.active-menu-item {
  position: relative;
}

.active-menu-item::after {
  content: '';
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 50%;
  background-color: #409EFF;
}

.el-menu-vertical-demo .el-menu-item {
  padding-right: 30px;
  /* 为右侧留出空间 */
}
</style>
