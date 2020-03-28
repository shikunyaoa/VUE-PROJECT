const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const htmlPlugin = new HtmlWebpackPlugin({ // 创建插件的实例对象
    template: './src/index.html', // 指定要用到的模板文件
    filename: 'index.html' // 指定生成的文件的名称，该文件存在于内存中，在目录中不显示
})
module.exports = {
    //编译模式
    mode: 'development',//开发模式
    //自定义入口和输出
    entry: path.join(__dirname, './src/index.js'),
    output: {
        path: path.join(__dirname, './dist'),
        filename: 'bundle.js'
    },
    plugins: [ htmlPlugin,new VueLoaderPlugin() ],
    module: {
        //配置所有的第三方匹配和处理规则
        rules: [
            {test: /\.css$/, use:['style-loader', 'css-loader']},
            { test: /\.vue$/, loader: 'vue-loader' }
        ]
    }
}