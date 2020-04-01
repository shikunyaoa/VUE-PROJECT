<template>
    <div>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>角色列表</el-breadcrumb-item>
      </el-breadcrumb>
      <el-card>
        <el-row>
          <el-col>
            <el-button type="primary">添加角色</el-button>
          </el-col>
        </el-row>
        <el-table :data="roleList" border stripe>
          <el-table-column type="expand">
            <template slot-scope="scope">
              <el-row :class="['elBottom', i1 === 0 ? 'elTop' : '','vcenter']" v-for="(item1,i1) in scope.row.children" :key="item1.id">
                <el-col :span="5">
                  <el-tag closable @close="removeById(scope.row, item1.id)">{{item1.authName}}</el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <el-col :span="19">
                  <el-row :class="[i2 === 0 ? '' : 'elTop','vcenter']" v-for="(item2,i2) in item1.children" :key="item2.id">
                    <el-col :span="6">
                      <el-tag type="success" closable @close="removeById(scope.row, item2.id)">{{item2.authName}}</el-tag>
                      <i class="el-icon-caret-right"></i>
                    </el-col>
                    <el-col :span="18">
                      <el-tag  type="warning" closable v-for="(item3) in item2.children" :key="item3.id" @close="removeById(scope.row, item3.id)">
                        {{item3.authName}}
                      </el-tag>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column type="index" label="序号"></el-table-column>
          <el-table-column label="角色名称" prop="roleName"></el-table-column>
          <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
          <el-table-column label="操作" width="300px">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
              <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
              <el-button size="mini" type="warning" icon="el-icon-setting" @click="showDialogVisible(scope.row)">分配权限</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>

      <el-dialog
        title="分配权限"
        width="50%"
        :visible.sync="rightDialogVisible" @close="setRightDialogClosed">
        <el-tree :data="rightList" show-checkbox :default-checked-keys="defKeys" node-key="id" default-expand-all :props="defaultProps" ref="treeRef"></el-tree>
        <span slot="footer" class="dialog-footer">
          <el-button @click="rightDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="allRight">确 定</el-button>
        </span>
      </el-dialog>
    </div>
</template>

<script>
export default {
  name: 'Roles',
  data () {
    return {
      roleList: [],
      rightDialogVisible: false,
      rightList: [],
      defaultProps: {
        label: 'authName',
        children: 'children'
      },
      defKeys: [],
      roleId: ''
    }
  },
  created () {
    this.getRoleList()
  },
  methods: {
    async getRoleList () {
      const { data: ret } = await this.$http.get('roles')
      if (ret.meta.status !== 200) {
        this.$message.error('获取角色列表失败')
      }
      this.roleList = ret.data
    },
    async removeById (role, rightId) {
      const confirmText = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(error => error)
      if (confirmText !== 'confirm') {
        return this.$message.info('已经取消了删除')
      }
      const res = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
      if (res.meta.status !== 200) {
        return this.$message.error('删除权限失败')
      }
      role.children = res.data
    },
    async showDialogVisible (role) {
      this.roleId = role.id
      const { data: ret } = await this.$http.get('rights/tree')
      if (ret.meta.status !== 200) {
        this.$message.error('获取权限列表失败')
      }
      this.rightList = ret.data

      this.getLeafKeys(role, this.defKeys)
      this.rightDialogVisible = true
    },
    getLeafKeys(node, arr) {
      // 如果当前 node 节点不包含 children 属性，则是三级节点
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => this.getLeafKeys(item, arr))
    },
    setRightDialogClosed () {
      this.defKeys = []
    },
    async allRight () {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const rightStr = keys.join(',')
      const { data: ret } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        { rids: rightStr }
      )
      if (ret.meta.status !== 200) {
        this.$message.error('分配权限失败')
      }
      this.$message.success('分配权限成功')
      this.getRoleList()
      this.rightDialogVisible = false
    }
  }
}
</script>

<style scoped>
  .el-tag{
    margin: 7px;
  }

  .elTop{
    border-top: 1px solid #eee;
  }

  .elBottom{
    border-bottom: 1px solid #eee;
  }
  .vcenter{
    display: flex;
    align-items: center;
  }
</style>
