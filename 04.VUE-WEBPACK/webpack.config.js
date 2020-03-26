const path = require('path');
module.exports = {
    //编译模式
    mode: 'development',//开发模式
    //自定义入口和输出
    entry: path.join(__dirname, './src/index.js'),
    output: {
        path: path.join(__dirname, './dist'),
        filename: 'bundle.js'
    }
}