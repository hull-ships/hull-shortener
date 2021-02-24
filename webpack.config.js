const path = require("path");
const webpack = require("webpack");
let plugins = [];

if (process.env.NODE_ENV === "production") {
  plugins = [
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false,
        screw_ie8: false
      }
    }),
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
    }),
  ];
}

module.exports = {
  devtool: "#source-map",
  entry: {
    admin: path.join(__dirname, "src/index.js")
  },
  output: {
    path: path.join(__dirname, "/dist/"),
    filename: "[name].js",
    publicPath: "/",
  },
  plugins,
  resolve: { extensions: [".js", ".jsx"] },
  module: {
    rules: [
      {
        test: /\.(css|scss)$/,
        loaders: [
          "style-loader?singleton=true",
          "css-loader?modules&importLoaders=1"
        ],
      },
      { test: /\.svg$/, loader: "svg-inline-loader" },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        query: {
          presets: ["es2015", "stage-0"]
        },
      },
      {
        test: /.jsx?$/,
        loader: "babel-loader",
        exclude: /node_modules/,
        query: {
          presets: ["es2015", "react", "stage-0"]
        },
      },
    ],
  },
};
