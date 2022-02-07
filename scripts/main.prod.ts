import path from "path";
import webpack from "webpack";
import { merge } from "webpack-merge";
import TerserPlugin from "terser-webpack-plugin";
import baseConfig from "./base";

const devtoolsConfig =
  process.env.DEBUG_PROD === "true"
    ? {
        devtool: "source-map",
      }
    : {};

const configuration: webpack.Configuration = {
  ...devtoolsConfig,

  mode: "production",

  target: "electron-main",

  entry: {
    main: path.resolve(__dirname, "../src/main/main.ts"),
    preload: path.resolve(__dirname, "../src/main/preload.js"),
  },

  output: {
    path: path.resolve(__dirname, "../release/app/dist/main"),
    filename: "[name].js",
  },

  optimization: {
    minimizer: [
      new TerserPlugin({
        parallel: true,
      }),
    ],
  },

  plugins: [
    new webpack.EnvironmentPlugin({
      DEBUG_PROD: false,
      START_MINIMIZED: false,
    }),
  ],

  node: {
    __dirname: false,
    __filename: false,
  },
};

export default merge(baseConfig, configuration);
