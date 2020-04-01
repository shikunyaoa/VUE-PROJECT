<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row>
        <el-col>
          <el-button type="primary">添加分类</el-button>
        </el-col>
      </el-row>
      <tree-table :data="cateList" :columns="columns" :selection-type="false" :expand-type="false" show-index index-text="序号" border>
        <template slot="isok" slot-scope="scope">
          <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color:green;"></i>
          <i class="el-icon-error" v-else style="color: red;"></i>
        </template>
      </tree-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Cate',
  data () {
    return {
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      cateList: [],
      total: 0,
      columns: [{
        label: '分类名称',
        prop: 'cat_name'
      }, {
        label: '是否有效',
        type: 'template',
        template: 'isok'
      }]
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    async getCateList () {
      const { data: ret } = await this.$http.get('categories', { params: this.queryInfo })
      if (ret.meta.status !== 200) {
        this.$message.error('获取分类列表失败')
      }
      this.cateList = ret.data.result
      this.total = ret.data.total
    }
  }
}
</script>

<style scoped>

</style>
