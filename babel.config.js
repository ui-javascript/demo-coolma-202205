module.exports = {
  presets: ["@vue/app"],
  plugins: [
      // @fix 关于vue页面多了之后，webpack热更新速度慢的解决办法 --> 不知道是否有效??
      // https://blog.csdn.net/weixin_30795127/article/details/99082216
      ["dynamic-import-node"]

      // antd-按需加载配置 =========
      // , [
      //     "import",
      //     { libraryName: "ant-design-vue", libraryDirectory: "es", style: true }
      // ]

      // veui-配置 ===============
      , ['veui']
      , ['lodash']
  ]
};
