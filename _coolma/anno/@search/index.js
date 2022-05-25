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
  realAnnoExtArgNames: ['createAt', 'c', 'stars', 's'], // 补充字段, 数组形式, 非必填
  realAnnoShortcutAttrs: [
    'github', 'google', 'zhihu', 'juejin', // 默认开启
    'sof', 'stackoverflow', 'gitee', 'baidu', 'csdn', 'sf', 'bing' // 需要显式设置 才开启
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
   
    const tagId = getNanoId()
    const data = node.data || (node.data = {});
    const hast = h(`div`, {
      style: "display: inline-block"
    }, [  
      h(`span#${tagId}`, {...node.attributes}, '')
    ]);

    data.hName = hast.tagName;
    data.hProperties = hast.properties;
    data.hChildren = hast.children;

    var Tag = Vue.extend({
      template: `<i class="el-icon-search" @click="openLinks"></i>`,
      data: () => {
        return {
   
        }
      },
      methods: {
        openLinks() {
          if (node.attributes.github != 'false') {
            window.open(`https://github.com/search?q=${node.attributes[realAnnoRequiredArgNames[0]]}+stars%3A%3E${node.attributes.stars || node.attributes.s ||1000}+created%3A%3E%3D${node.attributes.createAt || node.attributes.c || moment().add(-1, 'years')}`,"_blank")
          }
        }
      }
    })


    //  div好像没有onload方法
    let retryTimes = 0 
    function renderTimer() {
      const tag = document.getElementById(tagId)
      if (tag) {
        // 创建 Profile 实例，并挂载到一个元素上。
        new Tag().$mount(`#${tagId}`)
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
