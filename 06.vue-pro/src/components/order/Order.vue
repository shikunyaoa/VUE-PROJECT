<template>
    <div>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>订单管理</el-breadcrumb-item>
        <el-breadcrumb-item>订单列表</el-breadcrumb-item>
      </el-breadcrumb>
      <el-card>
        <el-row>
          <el-col :span="7">
            <el-input placeholder="请输入内容"  class="input-with-select" v-model="queryInfo.query" clearable >
              <el-button slot="append" icon="el-icon-search" ></el-button>
            </el-input>
          </el-col>
        </el-row>
        <el-table border stripe :data="orderList">
          <el-table-column type="index" label="序号"></el-table-column>
          <el-table-column  label="订单编号" prop="order_number"></el-table-column>
          <el-table-column  label="订单价格" prop="order_price"></el-table-column>
          <el-table-column  label="是否付款" prop="pay_status">
            <template slot-scope="scope">
              <el-tag type="success" v-if="scope.row.pay_status === '1'">已付款</el-tag>
              <el-tag type="danger" v-else>未付款</el-tag>
            </template>
          </el-table-column>
          <el-table-column  label="是否发货" prop="is_send">
            <template slot-scope="scope">
              {{scope.row.is_send}}
            </template>
          </el-table-column>
          <el-table-column  label="下单时间" prop="create_time">
            <template slot-scope="scope">
              {{scope.row.create_time | dateFormat}}
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template>
              <el-button size="mini" type="primary" icon="el-icon-edit" ></el-button>
              <el-button size="mini" type="success" icon="el-icon-location" @click="showPrograss"></el-button>
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
        title="物流进度"
        :visible.sync="progressVisible"
        width="50%">
        <el-timeline :reverse="reverse">
          <el-timeline-item
            v-for="(activity, index) in progressData"
            :key="index"
            :timestamp="activity.time">
            {{activity.context}}
          </el-timeline-item>
        </el-timeline>
        <span slot="footer" class="dialog-footer">
          <el-button @click="progressVisible = false">取 消</el-button>
          <el-button type="primary" @click="progressVisible = false">确 定</el-button>
        </span>
      </el-dialog>
    </div>
</template>

<script>
export default {
  name: 'Order',
  data () {
    return {
      queryInfo: {
        query: '',
        pagesize: 10,
        pagenum: 1
      },
      total: 0,
      orderList: [],
      progressVisible: false,
      progressData: []
    }
  },
  created () {
    this.getOrderList()
  },
  methods: {
    async getOrderList () {
      const { data: ret } = await this.$http.get('orders', { params: this.queryInfo })
      if (ret.meta.status !== 200) {
        return this.$message.error('获取订单数据失败')
      }
      console.log(ret)
      this.total = ret.data.total
      this.orderList = ret.data.goods
    },
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrderList()
    },
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getOrderList()
    },
    async showPrograss () {
      const { data: ret } = await this.$http.get('/kuaidi/1106975712662')
      if (ret.meta.status !== 200) {
        return this.$message.error('获取物流信息失败')
      }
      console.log(ret.data)
      this.progressData = ret.data
      this.progressVisible = true
    }
  }
}
</script>

<style scoped>
@import '../../plugins/timeline/timeline.css';
@import '../../plugins/timeline-item/timeline-item(1).css';
</style>
