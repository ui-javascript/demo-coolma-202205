import { getNextNodeByLatestAncestor, getNextNodeByAncestor, renderVoidElement, getPrevNodeByAncestors, getPrevNodeByLatestAncestor, getNanoId } from "../../utils/utils";
import { h } from "hastscript";
import { trim } from "lodash";
import { customAlphabet, nanoid } from "nanoid";
import Vue from "vue";

export default {
  namespace: "divider",
  
  realAnnoRequiredArgNames: null, // 不需要参数
  realAnnoExtArgNames: ['title'], // 补充字段, 数组形式, 非必填

  realAnnoShortcutAttrs: null,

  // 参数转换配置
  autoConvertArg2Attr: true,
  needConvertPrevNode2Attr: false, // 默认false, 配置true会优先向前读
  needConvertNextNode2Attr: true, 

  beforeRender: {
    
  },
  
  // @advice node.args映射至node.attributes的工作 请在beforeRender的函数内完成
  render: (node, ancestors, realAnnoRequiredArgNames, realAnnoShortcutAttrs, loseAttrs)  => {
    
    var Divider = Vue.extend({
      template: `<el-divider content-position="left">${node.attributes.title ? node.attributes.title : ''}</el-divider>`,
      data: function () {
        return {
          // value: node.attributes[realAnnoRequiredArgNames[0]],
        }
      }
    })

    const dividerId = getNanoId()
    const data = node.data || (node.data = {});
    const hast = h(`div#${dividerId}`, node.attributes, null);
    data.hName = hast.tagName;
    data.hProperties = hast.properties;
    data.hChildren = hast.children;
    // data.value = null

    // @todo 待优化 div好像没有onload方法
    const timer = setTimeout(() => {
   
    }, 250)

 

    function renderTimer() {
      const alert = document.getElementById(dividerId)
      if (alert) {
        // 创建 Profile 实例，并挂载到一个元素上。
        new Divider().$mount(`#${dividerId}`)
      
      } else {
        setTimeout(() => {
          renderTimer()
        }, 200)
      }
    }

    renderTimer()

  },
};
