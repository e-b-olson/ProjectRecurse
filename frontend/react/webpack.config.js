const path = require("path");
const webpack = require("webpack");
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

const isDevelopment = process.env.NODE_ENV !== 'production';

module.exports = {
  entry: {
    main: "./src/index.js",
  },
  mode: isDevelopment ? "development" : "production",
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
	use: {  
          loader: require.resolve("babel-loader"),
          options: {
	    plugins: [isDevelopment && require.resolve('react-refresh/babel')].filter(Boolean),
	    presets: ["@babel/env"] }
	}
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader", "source-map-loader"]
      }
    ]
  },
  resolve: { extensions: ["*", ".js", ".jsx"] },
  output: {
    path: path.resolve(__dirname, "dist/"),
    publicPath: "/",
    filename: "bundle.js"
  },
  devServer: {
    static: [
      {
	directory: path.join(__dirname, "public/"),
      },
      {
	directory: path.join(__dirname, "src/"),
      }  
    ],
    port: 3000,
    devMiddleware: {
      publicPath: "http://localhost:3000/dist/",
    },
    historyApiFallback: true,
    hot: true,
  },
  plugins: [isDevelopment && new ReactRefreshWebpackPlugin()].filter(Boolean),
};
