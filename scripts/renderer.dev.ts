import path from "path";
import webpack from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import { merge } from "webpack-merge";
import { spawn } from "child_process";
import baseConfig from "./base";
import ReactRefreshWebpackPlugin from "@pmmmwh/react-refresh-webpack-plugin";

const port = process.env.PORT || 1212;
const configuration: webpack.Configuration = {
  devtool: "inline-source-map",

  mode: "development",

  target: ["web", "electron-renderer"],

  entry: [
    `webpack-dev-server/client?http://localhost:${port}/dist`,
    "webpack/hot/only-dev-server",
    path.resolve(__dirname, "../src/renderer/index.tsx"),
  ],

  output: {
    path: path.resolve(__dirname, "../release/app/dist/renderer"),
    publicPath: "/",
    filename: "renderer.dev.js",
    library: {
      type: "umd",
    },
  },

  module: {
    rules: [
      {
        test: /\.s?css$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              modules: true,
              sourceMap: true,
              importLoaders: 1,
            },
          },
          "sass-loader",
        ],
        include: /\.module\.s?(c|a)ss$/,
      },
      {
        test: /\.s?css$/,
        use: ["style-loader", "css-loader", "sass-loader"],
        exclude: /\.module\.s?(c|a)ss$/,
      },
      {
        test: /\.less$/,
        use: [
          "style-loader",
          "css-loader",
          {
            loader: "less-loader",
            options: {
              lessOptions: {
                javascriptEnabled: true,
              },
            },
          },
        ],
        include: /\.less$/,
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: "asset/resource",
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
    ],
  },
  plugins: [
    new ReactRefreshWebpackPlugin(),

    new HtmlWebpackPlugin({
      filename: path.join("index.html"),
      template: path.join(__dirname, "../src/renderer/index.ejs"),
      minify: {
        collapseWhitespace: true,
        removeAttributeQuotes: true,
        removeComments: true,
      },
      isBrowser: false,
      env: process.env.NODE_ENV,
      isDevelopment: process.env.NODE_ENV !== "production",
      nodeModules: path.resolve(__dirname, "../release/app/node_modules"),
    }),
  ],

  node: {
    __dirname: false,
    __filename: false,
  },

  // @ts-ignore
  devServer: {
    port,
    compress: true,
    hot: true,
    headers: { "Access-Control-Allow-Origin": "*" },
    static: {
      publicPath: "/",
    },
    historyApiFallback: {
      verbose: true,
    },
    onBeforeSetupMiddleware() {
      console.log("Starting Main Process...");
      spawn("npm", ["run", "start:main"], {
        shell: true,
        env: process.env,
        stdio: "inherit",
      })
        .on("close", (code: number) => process.exit(code!))
        .on("error", (spawnError) => console.error(spawnError));
    },
  },
};

export default merge(baseConfig, configuration);
