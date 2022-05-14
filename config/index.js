module.exports = {
  // 端口号
  port: process.env.port || 9527,

  // 默认模板位置
  template: './template/template.html',

  // 默认meta位置
  meta: "./template/template.json",

  // 当页面超过1张时, 是否在顶部插入多页面导航
  // showNav: false,
  showNav: true,

  entry: './_coolma/*.js',
}
