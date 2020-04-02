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
      </el-card>
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
    handleChange () {}
  }
}
</script>

<style scoped>
.param_opt{
  margin: 15px 0;
}
</style>
