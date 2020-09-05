module.exports = {
    mode: "development",
    entry: "../src/Sidebar/index.jsx",
    output: {
        filename: "../static/js/index.js",
        // path: path.resolve(__dirname, "chrome_extension/sidebar")
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx|tsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                },
            },
        ],
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
    },
    devServer: {
        contentBase: path.join(__dirname, "chrome_extension/sidebar"),
        compress: true,
        hot: true,
        port: 9000,
    },
};
