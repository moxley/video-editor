const path = require("path")
const webpack = require("webpack")

module.exports = {
  mode: "development",
  entry: "./src/index.jsx",
  devtool: "inline-source-map",
  devServer: {
    contentBase: "./dist",
  },
  plugins: [new webpack.HotModuleReplacementPlugin()],
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
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: ["file-loader"],
      },
    ],
  },
  resolve: {
    extensions: ["*", ".js", ".jsx", ".ts", ".tsx"],
  },
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
}
