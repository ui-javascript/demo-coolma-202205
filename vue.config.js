const path = require("path")

// 构建工具类
const utils = require("./utils")

// 配置
const CONFIG = require("./config")

// 几个辅助函数
function resolve(dir) {
  return path.join(__dirname, dir)
}

const isEnvProd = (process.env.NODE_ENV === 'production')
const isEnvDev = (process.env.NODE_ENV === 'development')

const currentOutsidePath = CONFIG.entry.split('/')[1];
console.log('-------当前工程最外层目录-------')
console.log(currentOutsidePath)

// 获取多页面信息
let pages = utils.getEntry(CONFIG.entry)

// 给html添加参数, 用于生成多页面路径的导航
// @fix 2019-11-16 pages是对象类型 不是数组 改为Object.keys().length
const entries = pages.entries
if (!isEnvProd && Object.keys(entries).length > 1 && CONFIG.showNav) {
  for (let index in entries) {
    Object.assign(entries[index], {
      _browserPage: pages.browserPages,
    })
  }
}


module.exports = {

  // 基本配置
  // 1) / 绝对路径
  // 2) ./ 相对路径
  publicPath: './',
  outputDir: 'docs',
  assetsDir: 'static',
  lintOnSave: isEnvDev,
  // 设为false打包时不生成.map文件
  productionSourceMap: false,
  devServer: {
    disableHostCheck: true,
    port: CONFIG.port,
    // open: true,
    overlay: {
      warnings: false,
      errors: true
    },

    // vue-element-admin的mock环境 =============
    proxy: {
      // change xxx-api/login => mock/login
      // detail: https://cli.vuejs.org/config/#devserver-proxy
      [process.env.VUE_APP_BASE_API]: {
        target: `http://127.0.0.1:${CONFIG.port}/mock`,
        changeOrigin: true,
        pathRewrite: {
          ['^' + process.env.VUE_APP_BASE_API]: ''
        }
      }
    },
    after: require('./mock/mock-server.js')

  },
  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          // less vars，customize ant design theme

          // 'primary-color': '#F5222D',
          // 'link-color': '#F5222D',
          // 'border-radius-base': '4px'
        },
        // do not remove this line
        javascriptEnabled: true
      }
    }
  },

  // 全局样式
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'scss',
      // patterns: [
      //   path.resolve(__dirname, 'src/styles/_variables.scss'),
      //   path.resolve(__dirname, 'src/styles/_mixins.scss')
      // ]
    }
  },
  // vue-cli 多页面
  pages: entries,
  configureWebpack: {
    // plugins: [],
    resolve: {
      alias: {
        '@': resolve('src'),
        // @TODO 目前这个变量仅仅给vue-element-admin使用
        // --> 所以src内使用到^/store的地方代码都有耦合
        // 当前项目最外层路径
        '^': resolve(currentOutsidePath || 'src'),
        // @fix runtime -> compiler模式
        // https://blog.csdn.net/wxl1555/article/details/83187647
        'vue$': 'vue/dist/vue.esm.js'
      }
    }
  },
  chainWebpack: config => {

    // TODO: need test
    config.plugins.delete('preload')
    // TODO: need test
    config.plugins.delete('prefetch')

    // set svg-sprite-loader



    config.module
        .rule('vue')
        .use('vue-loader')
        .loader('vue-loader')
        .tap(options => {
            options.compilerOptions.preserveWhitespace = true
            return options;
        });

    // 开发环境 cheap-source-map
    config
      .when(isEnvDev,
        config => config.devtool('cheap-source-map')
      )

  },

}
