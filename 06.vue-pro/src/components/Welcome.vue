<template>
    <div>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      </el-breadcrumb>

      <el-card>
        <div id="main" style="width: 1300px;height:400px;"></div>
      </el-card>
    </div>
</template>

<script>
import echarts from 'echarts'
import _ from 'loadsh'

export default {
  name: 'Welcome',
  data () {
    return {
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },
  async mounted () {
    var myChart = echarts.init(document.getElementById('main'))
    const { data: ret } = await this.$http.get('reports/type/1')
    if (ret.meta.status !== 200) {
      return this.$message.error('获取数据失败')
    }
    const result = _.merge(ret.data, this.options)
    myChart.setOption(result)
  }
}
</script>

<style scoped>

</style>
