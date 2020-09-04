const path = require("path");

module.exports = {
    mode: "development",
    entry: "./src/Sidebar/Sidebar.tsx",
    output: {
        filename: "sidebarReact.js",
        path: path.resolve(__dirname, "chrome_extension/components"),
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
            {
                test: /\.(js|jsx)$/,
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
};
