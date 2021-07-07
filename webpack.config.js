const path = require("path");

module.exports = {
    mode: "development",
    entry: {
        sidebar: "./src/sidebar/index.jsx",
        popup: "./src/popup/index.jsx"
    },
    output: {
        filename: "[name]/index.bundle.js",
        path: path.resolve(__dirname, "chrome_extension/")
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx|tsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            }
        ]
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"]
    }
};
