export default {
  productName: "图小小",
  appId: "com.tuxiaoxiao.picmin",
  copyright: "Copyright © 2022 ${author}",
  asar: true,
  directories: {
    output: "release",
    buildResources: "assets",
  },
  extraResources: [
    {
      from: "./assets",
      to: "./assets",
    },
  ],
  files: ["./dist/**"],
};
