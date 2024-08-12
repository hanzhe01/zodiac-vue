<template>
  <div class="app-container">
<div v-if="true">
  <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px" >
      <el-form-item label="更新日期" style="width: 308px">
        <el-date-picker v-model="daterangeUpdataDate" value-format="YYYY-MM-DD" type="daterange" range-separator="-"
          start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
</div>
    <el-row :gutter="10" class="mb8">
      <el-col :span="5">
        <el-menu class="el-menu-demo" mode="horizontal" style="height: 30px;" :default-active="activeIndex">
          <el-menu-item index="1" @click="onIsTodayClick(true)">每日运势</el-menu-item>
          <el-menu-item index="2" @click="onIsTodayClick(false)" v-if="false">每周运势</el-menu-item>
        </el-menu>
      </el-col>
      <el-col :span="1.5">
        <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['constellation:constellation:add']"
          disabled>新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate"
          v-hasPermi="['constellation:constellation:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['constellation:constellation:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="Download" @click="handleExport"
          v-hasPermi="['constellation:constellation:export']">导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="constellationList" @selection-change="handleSelectionChange">
      <el-table-column label="星座编号" align="center" prop="id" width="100px" />
      <el-table-column label="星座名称" align="center" prop="constellationName" />
      <el-table-column label="生日" align="center" prop="birthday" />
      <el-table-column label="更新日期" align="center" prop="updateTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.updateTime, '{y}-{m}-{d} {h}:{m}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="网址" align="left" prop="webUrl" width="250px">
        <template #default="scope">
          <el-link type="success"><span>{{ scope.row.webUrl }}</span></el-link>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="" @click="handleUpdateMaterialToday(scope.row)" v-if="isToday"
            v-hasPermi="['materiallibrary:materiallibrary:edit']">编辑内容</el-button>
          <el-button link type="primary" icon="" @click="handleUpdateMaterialWeek(scope.row)" v-if="!isToday"
            v-hasPermi="['materiallibrary:materiallibrary:edit']">编辑内容</el-button>
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['constellation:constellation:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
            v-hasPermi="['constellation:constellation:remove']" disabled>删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- <pagination
      v-show="total>0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    /> -->

    <!-- 添加或修改星座管理对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="constellationRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="星座名称" prop="constellationName">
          <el-input v-model="form.constellationName" placeholder="请输入星座名称" />
        </el-form-item>
        <el-form-item label="生日" prop="birthday">
          <el-input v-model="form.birthday" placeholder="请输入生日" />
        </el-form-item>
        <el-form-item label="更新日期" prop="updataDate">
          <el-date-picker clearable v-model="form.updateTime" type="date" value-format="YYYY-MM-DD"
            placeholder="请选择更新日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="网址" prop="webUrl">
          <el-input v-model="form.webUrl" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="素材id" prop="meterialLibraryId">
          <el-input v-model="form.meterialLibraryId" placeholder="请输入素材id" />
        </el-form-item>
        <el-form-item label="周素材ID" prop="weekMeterialLibraryId" v-if="false">
          <el-input v-model="form.weekMeterialLibraryId" placeholder="请输入周素材ID" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 预览编辑素材管理对话框 -->
    <el-dialog :title="title" v-model="materialOpen" width="1100px" append-to-body>
      <el-form ref="materiallibraryRef" :model="form" :rules="rules" label-width="80px">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="星座分组:">
              <el-select v-model="materialForm.constellationId" placeholder="请选择星座分组" clearable disabled>
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="生日:">
              <el-text class="mx-1" size="large">{{ materialForm.birthday }}</el-text>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="素材ID:">
              <el-text class="mx-1" size="small">{{ materialForm.id }}</el-text>
              <el-tooltip class="box-item" effect="light" content="复制ID" placement="top">
                <el-button link icon="CopyDocument" size="small" type="primary" circle
                  @click="copyText(materialForm.id)"></el-button>
              </el-tooltip>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="总体运势:" prop="horoscopeFortuneStar">
          <el-rate v-model="materialForm.horoscopeFortuneStar" allow-half />
          <!-- <el-input v-model="form.horoscopeFortuneStar" placeholder="请输入总体运势星级" /> -->
        </el-form-item>
        <el-form-item prop="horoscopeFortune">
          <el-input v-model="materialForm.horoscopeFortune" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <!-- 新的布局开始 -->
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="幸运色:" prop="luckyColor">
              <el-input v-model="materialForm.luckyColor" placeholder="请输入幸运色" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="幸运数字:" prop="luckyNumbers">
              <el-input v-model="materialForm.luckyNumbers" placeholder="请输入幸运数字" />
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
              <span>{{ materialForm.luckyTime }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否本周" prop="isWeekFortune" >
              <el-radio-group v-model="materialForm.isWeekFortune" disabled>
                <el-radio value="0" >是</el-radio>
                <el-radio value="1">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="幸运物品" prop="luckyItems">
          <el-input v-model="materialForm.luckyItems" placeholder="请输入幸运物品" />
        </el-form-item>
        <el-form-item label="购买链接" prop="purchaseLink">
          <el-radio-group v-model="showInput">
            <el-radio :label="0">有</el-radio>
            <el-radio :label="1">无</el-radio>
          </el-radio-group>
          <el-input v-if="showInput === 0" v-model="materialForm.purchaseLink" placeholder="请输入购买链接" />
        </el-form-item>
        <el-row :gutter="20" class="row-bg">
            <el-col :span="6">
              <el-form-item label="运势一:" prop="firstTitleName">
                <el-input v-model="materialForm.firstTitleName" placeholder="请输入标题" />
              </el-form-item>
            </el-col>
            <el-col :span="10">
                <el-rate v-model="materialForm.firstTitleStar" allow-half />
            </el-col>
          </el-row>
          <el-form-item label="" prop="firstTitleContent">
            <el-input v-model="materialForm.firstTitleContent" type="textarea" placeholder="请输入运势内容" />
          </el-form-item>
          <el-row :gutter="20">
            <el-col :span="6">
              <el-form-item label="运势二:" prop="secondTitleName">
                <el-input v-model="materialForm.secondTitleName" placeholder="请输入标题" />
              </el-form-item>
            </el-col>
            <el-col :span="10">
                <el-rate v-model="materialForm.secondTitleStar" allow-half />
            </el-col>
          </el-row>
          <el-form-item label="" prop="secondTitleContent">
            <el-input v-model="materialForm.secondTitleContent" type="textarea" placeholder="请输入运势内容" />
          </el-form-item>
          <el-row :gutter="20">
            <el-col :span="6">
              <el-form-item label="运势三:" prop="thirdTitleName">
                <el-input v-model="materialForm.thirdTitleName" placeholder="请输入标题" />
              </el-form-item>
            </el-col>
            <el-col :span="10">
                <el-rate v-model="materialForm.thirdTitleStar" allow-half />
            </el-col>
          </el-row>
          <el-form-item label="" prop="thirdTitleContent">
            <el-input v-model="materialForm.thirdTitleContent" type="textarea" placeholder="请输入运势内容" />
          </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitMateralForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Constellation">
import { listConstellation, getConstellation, delConstellation, addConstellation, updateConstellation } from "@/api/constellation/constellation";
import { getMateriallibrary, addMateriallibrary, updateMateriallibrary } from "@/api/materialLibrary/materialLibrary";
//消息弹出框
import { ElMessage } from 'element-plus'
import { ref } from "vue";

const { proxy } = getCurrentInstance();

const constellationList = ref([]);
const open = ref(false);
const materialOpen = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const daterangeUpdataDate = ref([]);
//每日运势本周运势默认显示每日
const activeIndex = ref('1'); // 默认选中每日运势菜单

const data = reactive({
  form: {},
  materialForm: {},
  queryParams: {
    pageNum: 1,
    pageSize: 12,
    updataDate: null,
  },
  rules: {
  }
});

const { queryParams, form, materialForm, rules } = toRefs(data);

/** 查询星座管理列表 */
function getList() {
  loading.value = true;
  queryParams.value.params = {};
  if (null != daterangeUpdataDate && '' != daterangeUpdataDate) {
    queryParams.value.params["beginUpdataDate"] = daterangeUpdataDate.value[0];
    queryParams.value.params["endUpdataDate"] = daterangeUpdataDate.value[1];
  }
  listConstellation(queryParams.value).then(response => {
    constellationList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

// 取消按钮
function cancel() {
  open.value = false;
  materialOpen.value = false;
  reset();
}

// 表单重置
function reset() {
  form.value = {
    id: null,
    constellationName: null,
    birthday: null,
    updataDate: null,
    webUrl: null,
    meterialLibraryId: null
  };
  proxy.resetForm("constellationRef");
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  daterangeUpdataDate.value = [];
  proxy.resetForm("queryRef");
  handleQuery();
}

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}


//显示预览编辑的周素材按钮还是每日素材按钮
const isToday = ref(true)
// 处理每周或者每日运势菜单项点击事件
const onIsTodayClick = (value) => {
  /**
   * 判断是否是每日运势还是每周运势显示不同的预览编辑按钮
   */
  isToday.value = value;
  // 更新 activeIndex 以反映当前选中的菜单项
  activeIndex.value = value ? '1' : '2';
};

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加星座管理";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getConstellation(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改星座管理";
  });
}

/** 预览编辑按钮操作 */
function handleUpdateMaterialToday(row) {
  materialReset();
  if ( row.meterialLibraryId === null) {
    ElMessage.warning('未设置素材');
    return;
  }
  const _id = row.meterialLibraryId || ids.value
  getMateriallibrary(_id).then(response => {
    materialForm.value = response.data;
    materialOpen.value = true;
    title.value = "修改每日素材管理";
  });
}
/** 预览编辑按钮显示周素材操作 */
function handleUpdateMaterialWeek(row) {
  materialReset();
  if ( row.weekMeterialLibraryId === null) {
    ElMessage.warning('未设置素材');
    return;
  }
  const _id = row.weekMeterialLibraryId || ids.value
  getMateriallibrary(_id).then(response => {
    materialForm.value = response.data;
    materialOpen.value = true;
    title.value = "修改周素材管理";
  });
}

/**
 * 购买链接是否展示
 */
const showInput = ref(0)
/**
 * 星座下拉框
 */
const options = [
  { label: '白羊座', value: '1' },
  { label: '金牛座', value: '2' },
  { label: '双子座', value: '3' },
  { label: '巨蟹座', value: '4' },
  { label: '狮子座', value: '5' },
  { label: '处女座', value: '6' },
  { label: '天秤座', value: '7' },
  { label: '天蝎座', value: '8' },
  { label: '射手座', value: '9' },
  { label: '摩羯座', value: '10' },
  { label: '水瓶座', value: '11' },
  { label: '双鱼座', value: '12' }
]
//复制素材id
const copyText = async (id) => {
  try {
    await navigator.clipboard.writeText(id);
    ElMessage.success('素材ID已复制到剪贴板')
  } catch (err) {
    ElMessage.error('无法复制ID:', err)
  }
};

/** 提交按钮 */
function submitForm() {
  proxy.$refs["constellationRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateConstellation(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addConstellation(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getList();
        });
      }
    }
  });
}


// 素材管理表单重置
function materialReset() {
  materialForm.value = {
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

/** 预览编辑提交素材按钮 */
function submitMateralForm() {
  proxy.$refs["materiallibraryRef"].validate(valid => {
    if (valid) {
      if (materialForm.value.id != null) {
        updateMateriallibrary(materialForm.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          materialOpen.value = false;
          getList();
        });
      } else {
        addMateriallibrary(materialForm.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          materialOpen.value = false;
          getList();
        });
      }
    }
  });
}

/** 删除按钮操作 */
function handleDelete(row) {
  const _ids = row.id || ids.value;
  proxy.$modal.confirm('是否确认删除星座管理编号为"' + _ids + '"的数据项？').then(function () {
    return delConstellation(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => { });
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('constellation/constellation/export', {
    ...queryParams.value
  }, `constellation_${new Date().getTime()}.xlsx`)
}

getList();
</script>
