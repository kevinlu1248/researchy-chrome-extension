const path = require("path");

module.exports = {
  mode : "development",
  entry : {
    sidebar : "./src/Sidebar/Sidebar.jsx",
    iframe : "./src/Sidebar/Iframe.jsx",
  },
  output : {
    filename : "[name].js",
    path : path.resolve(__dirname, "chrome_extension/components"),
  },
  module : {
    rules : [
      {
        test : /\.(js|jsx|tsx)$/,
        exclude : /node_modules/,
        use : {
          loader : "babel-loader",
        },
      },
    ],
  },
  resolve : {
    extensions : [ ".tsx", ".ts", ".js" ],
  },
};
