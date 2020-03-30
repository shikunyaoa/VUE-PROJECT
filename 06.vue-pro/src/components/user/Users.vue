<template>
    <div>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
      </el-breadcrumb>
      <el-card class="box-card">
        <el-row :gutter="20">
          <el-col :span="7">
            <el-input placeholder="请输入内容"  class="input-with-select" v-model="queryInfo.query" clearable @clear="getUserList">
              <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
            </el-input>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" @click="dialogVisible = true">添加用户</el-button>
          </el-col>
        </el-row>

        <el-table :data="userList" border>
          <el-table-column type="index" label="序号"></el-table-column>
          <el-table-column label="姓名" prop="username"></el-table-column>
          <el-table-column label="邮箱" prop="email"></el-table-column>
          <el-table-column label="电话" prop="mobile"></el-table-column>
          <el-table-column label="角色" prop="role_name"></el-table-column>
          <el-table-column label="状态" >
            <temlate slot-scope="scope">
              <el-switch v-model="scope.row.mg_state" @change="userStateChange(scope.row)">
              </el-switch>
            </temlate>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-row>
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUser(scope.row.id)"></el-button>
                <el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable="false">
                  <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
                </el-tooltip>
              </el-row>
            </template>
          </el-table-column>
        </el-table>

        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </el-card>

      <el-dialog
        title="添加用户"
        :visible.sync="dialogVisible"
        width="50%" @close="addDialogClosed">
        <el-form :model="addForm" :rules="addFormRule" ref="addFormRef" label-width="70px" >
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addForm.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addForm.email"></el-input>
          </el-form-item>
          <el-form-item label="号码" prop="mobile">
            <el-input v-model="addForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
      </el-dialog>

      <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisible"
      width="50%" @close="editDialogClosed">
      <el-form :model="editForm" :rules="editFormRule" ref="editFormRef" label-width="70px" >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="号码" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="eidtUser">确 定</el-button>
        </span>
      </el-dialog>
    </div>
</template>

<script>
export default {
  name: 'Users',
  data () {
    const checkEmail = (rule, value, cb) => {
      // 验证邮箱的正则表达式
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) {
        // 合法的邮箱
        return cb()
      }
      cb(new Error('请输入合法的邮箱'))
    }

    // 验证手机号的规则
    const checkMobile = (rule, value, cb) => {
      // 验证手机号的正则表达式
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法的手机号'))
    }

    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      userList: [],
      total: 0,
      dialogVisible: false,
      editDialogVisible: false,
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      editForm: {},
      addFormRule: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      editFormRule: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      async removeUser (id) {
        const confirmResult = await this.$confirm('是否删除该用户?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(error => error)
        if (confirmResult !== 'confirm') {
          return this.$message.info('已取消删除')
        }
        const { data: ret } = await this.$http.delete('users/' + id)
        if (ret.meta.status !== 200) {
          this.$message.error('删除用户失败')
        }
        this.$message.success('删除用户成功')
        this.editDialogVisible = false
        this.getUserList()
      }
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    async getUserList () {
      const { data: res } = await this.$http.get('users', { params: this.queryInfo })
      if (res.meta.status !== 200) {
        return this.$message.error('获取用户数据失败')
      }
      this.userList = res.data.users
      this.total = res.data.total
      console.log(res.data)
    },
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    async userStateChange (res) {
      const { data: ret } = await this.$http.put(`users/${res.id}/state/${res.mg_state}`)
      if (ret.meta.status !== 200) {
        res.status = !res.status
        this.$message.error('更新用户状态失败')
      }
      this.$message.success('更新用户状态成功')
    },
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    addUser () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: ret } = await this.$http.post('users', this.addForm)
        if (ret.meta.status !== 201) this.$message.error('添加用户失败')
        this.$message.success('添加用户成功')
        this.dialogVisible = false
        this.getUserList()
      })
    },
    async showEditDialog (id) {
      const { data: ret } = await this.$http.get('users/' + id)
      if (ret.meta.status !== 200) {
        return this.$message.error('查询用户信息失败！')
      }
      this.editForm = ret.data
      this.editDialogVisible = true
    },
    eidtUser () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data: ret } = await this.$http.put('users/' + this.editForm.id, { email: this.editForm.email, mobile: this.editForm.mobile })
        if (ret.meta.status !== 200) {
          return this.$message.error('修改用户失败')
        }
        this.$message.success('修改用户成功')
        this.editDialogVisible = false
        this.getUserList()
      })
    }
  }
}
</script>

<style scoped>
</style>
