const path = require('path');
const DtsBundlePlugin = require("dts-bundle-webpack");
const TsConfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const PackageFile = require("./package.json");
const nodeExternals = require('webpack-node-externals');

module.exports = {
  mode: "development",
  entry: PackageFile.source,
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: ["babel-loader", "ts-loader"]
      },
      {
        test: /\.js$/,
        use: ["source-map-loader"],
        enforce: "pre"
      }
    ]
  },
  externals: [nodeExternals()],
  output: {
    filename: path.basename(PackageFile.main),
    path: path.resolve(__dirname, path.dirname(PackageFile.main)),
    libraryTarget: "umd"
  },
  resolve: {
    modules: [path.join(__dirname, 'src'), "node_modules"],
    extensions: ["js", ".ts", ".tsx"],
    plugins: [new TsConfigPathsPlugin()]
  },
  plugins: [new DtsBundlePlugin({
    name: PackageFile.name,
    main: PackageFile.source,
    // prevents deleting <baseDir>/**/*.d.ts outside of <baseDir>
    baseDir: path.dirname(PackageFile.source),
    // absolute path to prevent the join of <baseDir> and <out>
    out: path.resolve(__dirname, PackageFile.types),
    removeSource: true,
    outputAsModuleFolder: true
  })]
};
