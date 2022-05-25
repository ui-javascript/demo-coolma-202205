import { getNanoId, renderVoidElement } from "../../utils/utils";
import { h } from "hastscript";
import { trim } from "lodash";
import Vue from "vue";
import { nanoid } from "nanoid";
import { nextTick } from "@vue/composition-api";
import moment from "moment";

export default {
  namespace: 'search',

  realAnnoRequiredArgNames: ['keyword'],
  realAnnoExtArgNames: ['pushed', 'p', 'stars', 's'], // 补充字段, 数组形式, 非必填
  realAnnoShortcutAttrs: [
    'github', 'google', 'g',  // 默认开启
    'zhihu', 'jj', 'juejin', 'sof', 'stackoverflow', 'gitee', 'baidu', 'csdn', 'sf', 'segmentfault', 'bing' // @todo 需要显式设置 才开启
  ],
  
  // 参数转换配置
  autoConvertArg2Attr: true,
  needConvertPrevNode2Attr: true, // 默认false, 配置true会优先向前读
  needConvertNextNode2Attr: false, 

  beforeRender: {
    prevNode2Attr: (node, ancestors, realAnnoRequiredArgNames, prevNode) => {
      node.attributes[realAnnoRequiredArgNames[0]] = trim(prevNode.value)
    },
  },

  // @advice node.args映射至node.attributes的工作 请在beforeRender的函数内完成
  render: (node, ancestors, realAnnoRequiredArgNames, realAnnoShortcutAttrs, loseAttrs)  => {
   
    const keyword = node.attributes[realAnnoRequiredArgNames[0]]
    if (!keyword) {
      renderVoidElement(node)
      return 
    }

    const getSites = () => {
      const sites = []
      
      if (!(node.attributes.g && node.attributes.g == 'false')) {
        if (node.attributes.github != 'false') {
          sites.push('github')
        }
  
        if (node.attributes.google != 'false') {
          sites.push('google')
        }
      }
 

      if (node.attributes.zhihu && node.attributes.zhihu != 'false') {
        sites.push('知乎')
      }

      if ((node.attributes.juejin && node.attributes.juejin != 'false')
      || (node.attributes.jj && node.attributes.jj != 'false')) {
        sites.push('稀土掘金')
      }

  
      return sites
    }

    const sites = getSites().join('+')
    if (!sites) {
      renderVoidElement(node)
      return 
    }

    const searchId = getNanoId()
    const data = node.data || (node.data = {});
    const hast = h(`span`, {
      style: "border-bottom: none;",
      'data-tooltip': "在 " + sites + " 搜索 '" + keyword + "'"
    }, [  
      h(`span#${searchId}`, {
        ...node.attributes,
      }, '')
    ]);


    data.hName = hast.tagName;
    data.hProperties = hast.properties;
    data.hChildren = hast.children;

    var Search = Vue.extend({
      template: `<i class="el-icon-search cursor-pointer ml-1" @click="openLinks"></i>`,
      data () {
        return {

        }
      },
      methods: {
        
        openLinks() {
          if (!(node.attributes.g && node.attributes.g == 'false')) {
            if (node.attributes.github != 'false') {
              window.open(`https://github.com/search?q=${keyword}+stars%3A%3E${node.attributes.stars || node.attributes.s ||1000}+pushed%3A%3E%3D${node.attributes.pushed || node.attributes.p || moment().add(-1, 'years').format('YYYY-MM')}`,"_blank")
            }

            if (node.attributes.google != 'false') {
              window.open(`https://www.google.com/search?q=${keyword}`,"_blank")
            }
          }

          if (node.attributes.zhihu && node.attributes.zhihu != 'false') {
            window.open(`https://www.zhihu.com/search?q=${keyword}`,"_blank")
          }

          if ((node.attributes.juejin && node.attributes.juejin != 'false')
          || (node.attributes.jj && node.attributes.jj != 'false')) {
            window.open(`https://juejin.cn/search?query=${keyword}`,"_blank")
          }

        }
      }
    })


    //  div好像没有onload方法
    let retryTimes = 0 
    function renderTimer() {
      const tag = document.getElementById(searchId)
      if (tag) {
        
        new Search().$mount(`#${searchId}`)
      } else {
        retryTimes++
        console.log(node.name + "重试" + retryTimes + "次")
        setTimeout(() => {
           retryTimes < 3 && renderTimer()
        }, 200)
      }
    }

    renderTimer()

  }

};
