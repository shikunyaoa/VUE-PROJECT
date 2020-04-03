<template>
    <div>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>分类参数</el-breadcrumb-item>
      </el-breadcrumb>
      <el-card class="box-card">
        <el-row>
          <el-col>
            <el-alert
              title="注意：只能为分类第三级设置参数！"
              type="warning"
              show-icon :closable="false">
            </el-alert>
          </el-col>
        </el-row>
        <el-row class="param_opt">
          <el-col>
            <span>选择商品分类：</span>
            <el-cascader
              v-model="selectCategoryId"
              :options="categoryList"
              :props="categoryProps"
              @change="handleChange"></el-cascader>
          </el-col>
        </el-row>

        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="动态参数" name="many">
            <el-button type="primary" :disabled="isDisable" @click="addDialogVisible=true">添加参数</el-button>
            <el-table :data="manyTableData" border stripe>
              <el-table-column type="expand"></el-table-column>
              <el-table-column label="序号" type="index"></el-table-column>
              <el-table-column label="参数名称" prop="attr_name"></el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button type="primary" icon="el-icon-edit"  @click="showEditDialog(scope.row)">编辑</el-button>
                  <el-button type="danger" icon="el-icon-delete" @click="removeParams(scope.row.attr_id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="静态属性" name="only">
            <el-button type="primary" :disabled="isDisable" @click="addDialogVisible=true">添加属性</el-button>
            <el-table :data="onlyTableData" border stripe>
              <el-table-column type="expand"></el-table-column>
              <el-table-column label="序号" type="index"></el-table-column>
              <el-table-column label="属性名称" prop="attr_name"></el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row)">编辑</el-button>
                  <el-button type="danger" icon="el-icon-delete" @click="removeParams(scope.row.attr_id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </el-card>

      <el-dialog
        :title="'添加' + titleText"
        :visible.sync="addDialogVisible"
        width="50%" @close="addDialogClose">
        <el-form :model="addForm" :rules="ruleFormRule" ref="addFormRef" label-width="100px" >
          <el-form-item :label="titleText" prop="attr_name">
            <el-input v-model="addForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addParams">确 定</el-button>
        </span>
      </el-dialog>

      <el-dialog
        :title="'修改' + titleText"
        :visible.sync="editDialogVisible"
        width="50%" @close="editDialogClose">
        <el-form :model="editForm" :rules="editruleFormRule" ref="editFormRef" label-width="100px" >
          <el-form-item :label="titleText" prop="attr_name">
            <el-input v-model="editForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editParams">确 定</el-button>
        </span>
      </el-dialog>
    </div>
</template>

<script>
export default {
  name: 'Params',
  data () {
    return {
      categoryList: [],
      selectCategoryId: [],
      categoryProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      activeName: 'many',
      manyTableData: [],
      onlyTableData: [],
      addDialogVisible: false,
      addForm: {
        attr_name: ''
      },
      ruleFormRule: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      },
      editDialogVisible: false,
      editForm: {},
      editruleFormRule: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getCategoryList()
  },
  methods: {
    async getCategoryList () {
      const { data: ret } = await this.$http.get('categories')
      if (ret.meta.status !== 200) {
        return this.$message.error('获取商品分类列表失败')
      }
      this.categoryList = ret.data
    },
    handleChange () {
      this.getParamsDate()
    },
    handleClick () {
      this.getParamsDate()
    },
    async getParamsDate () {
      if (this.selectCategoryId.length !== 3) {
        this.selectCategoryId = []
      } else {
        const { data: ret } = await this.$http.get(`categories/${this.catId}/attributes`, { params: { sel: this.activeName } })
        if (ret.meta.status !== 200) {
          return this.$message.error('获取分类参数失败')
        }
        if (this.activeName === 'many') {
          this.manyTableData = ret.data
        } else {
          this.onlyTableData = ret.data
        }
      }
    },
    addDialogClose () {
      this.$refs.addFormRef.resetFields()
    },
    addParams () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: ret } = await this.$http.post(`categories/${this.catId}/attributes`, { attr_name: this.addForm.attr_name, attr_sel: this.activeName })
        if (ret.meta.status !== 201) {
          return this.$message.error('添加参数失败')
        }
        this.$message.success('添加参数成功')
        this.addDialogVisible = false
        this.getParamsDate()
      })
    },
    editDialogClose () {
      this.$refs.editFormRef.resetFields()
    },
    editParams () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data: ret } = await this.$http.put(`categories/${this.catId}/attributes/${this.editForm.attr_id}`, { attr_name: this.editForm.attr_name, attr_sel: this.activeName })
        if (ret.meta.status !== 200) {
          return this.$message.error('修改参数失败')
        }
        this.$message.success('修改参数成功')
        this.editDialogVisible = false
        this.getParamsDate()
      })
    },
    async showEditDialog (res) {
      const { data: ret } = await this.$http.get(`categories/${this.catId}/attributes/${res.attr_id}`, { params: { attr_sel: this.activeName } })
      if (ret.meta.status !== 200) {
        return this.$message.error('获取分类信息失败')
      }
      this.editForm = ret.data
      this.editDialogVisible = true
    },
    async removeParams (id) {
      const confirmResult = await this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(error => error)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已经取消删除！')
      }
      const { data: res } = await this.$http.delete(
        `categories/${this.catId}/attributes/${id}`
      )
      if (res.meta.status !== 200) {
        return this.$message.error('删除参数失败！')
      }
      this.$message.success('删除参数成功！')
      this.getParamsDate()
    }
  },
  computed: {
    isDisable () {
      if (this.selectCategoryId.length !== 3) {
        return true
      }
      return false
    },
    catId () {
      if (this.selectCategoryId.length === 3) {
        return this.selectCategoryId[2]
      }
      return null
    },
    titleText () {
      if (this.activeName === 'many') {
        return '动态参数'
      }
      return '静态属性'
    }
  }
}
</script>

<style scoped>
.param_opt{
  margin: 15px 0;
}
</style>
