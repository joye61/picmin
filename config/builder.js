module.exports = {
  productName: "图小小",
  appId: "com.tuxiaoxiao.picmin",
  copyright: "Copyright © 2022 ${author}",
  asar: false,
  directories: {
    output: "release",
    buildResources: "assets",
  },
  extraResources: [
    {
      from: "./assets/bin",
      to: "./bin",
    },
  ],
  files: ["./dist/**"],
};
