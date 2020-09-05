const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const path = require("path");

module.exports = merge(common, {
    mode: "development",
    entry: path.join(__dirname, "../src/Sidebar/index.jsx"),
    output: {
        filename: "./index.js"
    },
    devServer: {
        contentBase: path.join(__dirname, "../chrome_extension/sidebar"),
        compress: true,
        hot: true,
        port: 5000
    }
});
