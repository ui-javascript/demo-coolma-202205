import { getNanoId, getNextTextOrLinkNodeByAncestors, renderVoidElement } from "../../utils/utils";
import { h } from "hastscript";
import { trim } from "lodash";
import Vue from "vue";
import { nanoid } from "nanoid";
import { nextTick } from "@vue/composition-api";

export default {
  namespace: 'icon',

  realAnnoRequiredArgNames: ['type'],
  realAnnoExtArgNames: null, // 补充字段, 数组形式, 非必填
  realAnnoShortcutAttrs: null,
  
  // 参数转换配置
  autoConvertArg2Attr: true,
  needConvertPrevNode2Attr: false, // 默认false, 配置true会优先向前读
  needConvertNextNode2Attr: true, 


  beforeRender: {
    nextNode2Attr: (node, ancestors, realAnnoRequiredArgNames, nextNode) => {
      node.attributes.type = trim(nextNode.value)
      renderVoidElement(nextNode) // 取值结束不再需要渲染后置节点
    }
  },

  // @advice node.args映射至node.attributes的工作 请在beforeRender的函数内完成
  render: (node, ancestors, realAnnoRequiredArgNames, realAnnoShortcutAttrs, loseAttrs)  => {
   
    const iconId = getNanoId()
    const data = node.data || (node.data = {});
    const hast = h(`span#${iconId}`, {
      ...node.attributes,
      style: "display:inline-block"
    }, [])

    data.hName = hast.tagName;
    data.hProperties = hast.properties;
    data.hChildren = hast.children;

    var Icon = Vue.extend({
      template: `<i :class="type"></i>`,
      data: function () {
        return {
          type: 'el-icon-' + (node.attributes[realAnnoRequiredArgNames[0]]),
        }
      }
    })


    //  div好像没有onload方法
    let retryTimes = 0 
    function renderTimer() {
      const icon = document.getElementById(iconId)
      if (icon) {
        
        new Icon().$mount(`#${iconId}`)
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
