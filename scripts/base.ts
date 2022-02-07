import path from "path";
import webpack from "webpack";
import { dependencies as externals } from "../release/app/package.json";

const srcPath = path.resolve(__dirname, "../src");

const configuration: webpack.Configuration = {
  externals: [...Object.keys(externals || {})],

  stats: "errors-only",

  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        use: {
          loader: "ts-loader",
          options: {
            transpileOnly: true,
          },
        },
      },
    ],
  },

  output: {
    path: srcPath,
    library: {
      type: "commonjs2",
    },
  },

  resolve: {
    extensions: [".js", ".jsx", ".json", ".ts", ".tsx"],
    modules: [srcPath, "node_modules"],
    alias: {
      "@": srcPath,
    },
  },

  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: "production",
    }),
  ],
};

export default configuration;
