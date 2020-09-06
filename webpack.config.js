const path = require("path");

module.exports = {
    mode: "development",
    entry: "./src/Sidebar/index.jsx",
    output: {
        filename: "index.bundle.js",
        path: path.resolve(__dirname, "chrome_extension/sidebar")
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
