const glob = require('glob')
const path = require("path")
const fs = require("fs")

// 配置信息
const CONFIG = require("./config")

function shouldReadAsEntry(moduleName) {
    // 小写字母开头的js作为入口文件
    return moduleName.charAt(0).match(/^.*[a-z]+.*$/)
}

function getEntry (globPath) {
    let entries = {}
    let browserPages = []

    glob.sync(globPath).forEach(function (entry) {

        // 切割路径 --> [ '.', '_project', 'module', 'foo.js' ]
        // --> ['_project', 'module', 'foo.js' ]
        // --> ['_project', 'module' ]
        // --> ['module' ]
        let sections = entry.split('/').splice(1)
        // console.log(sections)

        // 模块名称 --> 'foo'
        let moduleName = path.basename(entry, path.extname(entry));
        // console.log(moduleName)

        // 跳过不符合入口规则的文件
        if (!shouldReadAsEntry(moduleName)) {
            return
        }

        // 已获取模块名，section移除最后一个
        sections.pop()

        let template = `./${sections.join('/')}/${moduleName}.html`
        if (!fs.existsSync(template)) {
            console.log(`未找到${template}, 使用默认模板`)
            template = CONFIG.template
        }

        // 页面信息
        let infoPath = `./${sections.join('/')}/${moduleName}.json`
        if (!fs.existsSync(infoPath)) {
            infoPath = CONFIG.meta
        }

        let context = JSON.parse(fs.readFileSync(infoPath, "utf-8"))
        // console.log(context)

        // 已获取路径参数, 去掉section的工程名
        sections.shift()

        // 生成唯一id, 防止多个目录下路径重复
        let prefix = ''
        // 除了moduleName与当前文件名前缀一致, 且层级为1的
        // 其他情况将section串联，作为uuid的一部分
        if (sections.length > 1 ||
            (sections.length === 1 && moduleName.indexOf(sections[0]) !== 0)) {
            prefix = `${sections.join('-')}-`
        }

        let uuid = `${prefix}${moduleName}`
        browserPages.push(`./${uuid}.html`)

        entries[uuid] = {
            // js入口
            entry,
            // 模板
            template,
            // 输出文件名
            filename: `${uuid}.html`,
            // 文件名
            title: context.title,
            // @TODO 如何拆分??
            // 不写chunk-vendors --> iview-admin无法正常
            chunks: ['chunk-vendors', 'chunk-common', uuid],
        }

    });

    console.log('-------页面--------')
    console.log(browserPages)

    // console.log('-------入口--------')
    // console.log(JSON.stringify(entries).replace(/},/g, "},\n"))

    return {
        entries,
        browserPages
    }
}

module.exports = {
    getEntry,
    shouldReadAsEntry
}

