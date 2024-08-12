<template>
  <div class="app-container">
    <el-row>
      <el-col :span="4">
        <el-card style="max-width: 250px;height: 100%;">
          <el-input v-model="queryParams.bePairedId" size="" placeholder="星座名称"
            style="margin-bottom: 18px;height: 50px;" suffix-icon="Search" @keyup.enter="handleQuery" />
            <el-card>
            <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px" style="overflow-y: auto;">
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
        <el-card class="box-card" style="height: 100%;">
          <template #header>
            <div class="card-header">

              <span><el-text class="mx-1" size="large">素材内容</el-text></span>
            </div>
          </template>
          <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
            <el-form-item label="更新时间" style="width: 308px">
              <el-date-picker v-model="daterangeDateUpdated" value-format="YYYY-MM-DD" type="daterange"
                range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
              <el-button icon="Refresh" @click="resetQuery">重置</el-button>
            </el-form-item>
          </el-form>

          <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
              <el-button type="primary" plain icon="Plus" @click="handleAdd"
                v-hasPermi="['pairing:pairing:add']">新增</el-button>
            </el-col>
            <el-col :span="1.5">
              <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate"
                v-hasPermi="['pairing:pairing:edit']">修改</el-button>
            </el-col>
            <el-col :span="1.5">
              <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete"
                v-hasPermi="['pairing:pairing:remove']">删除</el-button>
            </el-col>
            <el-col :span="1.5">
              <el-button type="info" plain icon="Upload" @click="handleImport"
                v-hasPermi="['pairing:pairing:import']">导入</el-button>
            </el-col>
            <el-col :span="1.5">
              <el-button type="warning" plain icon="Download" @click="handleExport"
                v-hasPermi="['pairing:pairing:export']">导出</el-button>
            </el-col>
            <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
          </el-row>

          <el-table v-loading="loading" :data="pairingList" @selection-change="handleSelectionChange">
            <el-table-column label="星座名称" align="center" prop="bePairedName" />
            <el-table-column label="配对星座" align="center" prop="pairedName" />
            <!-- <el-table-column label="星级" align="center" prop="starLevel" />
            <el-table-column label="建议" align="center" prop="suggestion" /> -->
            <el-table-column label="更新时间" align="center" prop="updateTime">
              <template #default="scope">
                <span>{{ parseTime(scope.row.updateTime, '{y}-{m}-{d} {h}:{m}:{s}') }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
              <template #default="scope">
                <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
                  v-hasPermi="['pairing:pairing:edit']">修改</el-button>
                <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
                  v-hasPermi="['pairing:pairing:remove']">删除</el-button>
              </template>
            </el-table-column>
          </el-table>

          <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
            v-model:limit="queryParams.pageSize" @pagination="getList" />
        </el-card>
      </el-col>
    </el-row>

    <!-- 添加或修改星座配对对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="pairingRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="星座名称" prop="bePairedId">
          <el-select v-model="form.bePairedId" placeholder="选择星座" size="large" style="width: 300px" v-if="isAdd">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
          <el-input v-model="form.bePairedName" placeholder="请输入星座被配对id" :disabled="!isAdd" v-if="!isAdd" />
        </el-form-item>
        <el-form-item label="配对星座" prop="pairingId">
          <el-select v-model="form.pairingId" placeholder="选择配对星座" size="large" style="width: 300px" v-if="isAdd">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
          <el-input v-model="form.pairedName" placeholder="请输入星座配对ID" :disabled="!isAdd" v-if="!isAdd" />
        </el-form-item>
        <el-form-item label="星级" prop="starLevel">
          <el-rate v-model="form.starLevel" allow-half size="large" />
        </el-form-item>
        <el-form-item label="建议" prop="suggestion">
          <el-input v-model="form.suggestion" type="textarea" placeholder="请输入内容" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 导入文件数据对话框 -->
    <el-dialog :title="upload.title" v-model="upload.open" width="400px" append-to-body>
      <el-upload ref="uploadRef" :limit="1" accept=".xlsx, .xls" :headers="upload.headers"
        :action="upload.url + '?updateSupport=' + upload.updateSupport" :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress" :on-success="handleFileSuccess" :auto-upload="false" drag>
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <template #tip>
          <div class="el-upload__tip text-center">
            <!-- <div class="el-upload__tip">
                     <el-checkbox v-model="upload.updateSupport" />是否更新已经存在的配对数据
                  </div> -->
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
  </div>
</template>

<script setup name="Pairing">
import { listPairing, getPairing, delPairing, addPairing, updatePairing } from "@/api/pairing/pairing";
import { getToken } from "@/utils/auth";
const { proxy } = getCurrentInstance();

const pairingList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const daterangeDateUpdated = ref([]);
const isAdd = ref(true);

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 12,
    bePairedId: 1,
    dateUpdated: null
  },
  rules: {
  }
});

const { queryParams, form, rules } = toRefs(data);

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
  queryParams.value.bePairedId = option.value;
  selectedLabel.value = option.value;
  handleQuery();
};

/** 查询星座配对列表 */
function getList() {
  loading.value = true;
  queryParams.value.params = {};
  if (null != daterangeDateUpdated && '' != daterangeDateUpdated) {
    queryParams.value.params["beginDateUpdated"] = daterangeDateUpdated.value[0];
    queryParams.value.params["endDateUpdated"] = daterangeDateUpdated.value[1];
  }
  listPairing(queryParams.value).then(response => {
    pairingList.value = response.rows;
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
    bePairedId: null,
    pairingId: null,
    starLevel: null,
    suggestion: null,
    dateUpdated: null
  };
  proxy.resetForm("pairingRef");
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  daterangeDateUpdated.value = [];
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
  open.value = true;
  isAdd.value = true;
  title.value = "添加星座配对";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  isAdd.value = false;
  reset();
  const _id = row.id || ids.value
  getPairing(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改星座配对";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["pairingRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updatePairing(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addPairing(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除星座配对编号为"' + _ids + '"的数据项？').then(function () {
    return delPairing(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => { });
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('pairing/pairing/export', {
    ...queryParams.value
  }, `pairing_${new Date().getTime()}.xlsx`)
}

/**
 * 批量导入数据
 * 
 */
/*** 配对数据导入参数 */
const upload = reactive({
  // 是否显示弹出层（配对数据导入）
  open: false,
  // 弹出层标题（配对数据导入）
  title: "",
  // 是否禁用上传
  isUploading: false,
  // 是否更新已经存在的数据
  updateSupport: 1,
  // 设置上传的请求头部
  headers: { Authorization: "Bearer " + getToken() },
  // 上传的地址
  url: import.meta.env.VITE_APP_BASE_API + "/pairing/pairing/importData"
});

/** 导入按钮操作 */
function handleImport() {
  upload.title = "配对数据导入";
  upload.open = true;
};
/** 下载模板操作 */
function importTemplate() {
  proxy.download("pairing/pairing/importTemplate", {
  }, `pairing_template_${new Date().getTime()}.xlsx`);
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
</script>
<style scoped>
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
