import { getNextTextOrLinkNodeByLatestAncestor, getNextNodeByAncestor, renderVoidElement, getPrevTextOrLinkNodeByAncestors, getPrevTextOrLinkNodeByLatestAncestors, getNanoId } from "../../utils/utils";
import { h } from "hastscript";
import { trim } from "lodash";
import { customAlphabet, nanoid } from "nanoid";
import Vue from "vue";

export default {
  namespace: "divider",
  
  realAnnoRequiredArgNames: null, // 不需要参数
  realAnnoExtArgNames: ['title', 't'], // 补充字段, 数组形式, 非必填

  realAnnoShortcutAttrs: null,

  // 参数转换配置
  autoConvertArg2Attr: true,
  needConvertPrevNode2Attr: false, // 默认false, 配置true会优先向前读
  needConvertNextNode2Attr: false, 

  beforeRender: {
 
  },
  
  // @advice node.args映射至node.attributes的工作 请在beforeRender的函数内完成
  render: (node, ancestors, realAnnoRequiredArgNames, realAnnoShortcutAttrs, loseAttrs)  => {
    

    const title = node.attributes.title || node.attributes.t
    var Divider = Vue.extend({
      template: `<el-divider content-position="left">${title ? title : ''}</el-divider>`,
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

    //  div好像没有onload方法
    const timer = setTimeout(() => {
   
    }, 250)

 

    let retryTimes = 0 
    function renderTimer() {
      const alert = document.getElementById(dividerId)
      if (alert) {
        
        new Divider().$mount(`#${dividerId}`)
      
      } else {
        retryTimes++
        console.log(node.name + "重试" + retryTimes + "次")
        setTimeout(() => {
           retryTimes < 3 && renderTimer()
        }, 200)
      }
    }

    renderTimer()

  },
};
