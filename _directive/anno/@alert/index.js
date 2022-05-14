import { getNextNodeByLatestAncestor, getNextNodeByAncestor, renderVoidElement, getPrevNodeByAncestors, getPrevNodeByLatestAncestor, getNanoId } from "../../utils/utils";
import { h } from "hastscript";
import { trim } from "lodash";
import { customAlphabet, nanoid } from "nanoid";
import Vue from "vue";

export default {
  namespace: "alert",

  realAnnoRequiredArgNames: ['content'], // 不需要参数
  realAnnoExtArgNames: ['type'], // 补充字段, 数组形式, 非必填
  realAnnoShortcutAttrs: null,

  // 自动转换配置
  autoConvertArg2Attr: true,
  needConvertPrevNode2Attr: true,
  needConvertNextNode2Attr: true, 

  beforeRender: {
  
    prevNode2Attr: (node, ancestors, realAnnoRequiredArgNames, prevNode) => {
      node.attributes[realAnnoRequiredArgNames[0]] = trim(prevNode.value)
      renderVoidElement(prevNode) // 取值结束不再需要渲染后置节点
    },
    nextNode2Attr: (node, ancestors, realAnnoRequiredArgNames, nextNode) => {
      node.attributes[realAnnoRequiredArgNames[0]] = trim(nextNode.value)
      renderVoidElement(nextNode) // 取值结束不再需要渲染后置节点
    }
  },

  // @advice node.args映射至node.attributes的工作 请在beforeRender的函数内完成
  render: (node, ancestors, realAnnoRequiredArgNames, realAnnoShortcutAttrs, loseAttrs) => {

  
    var Alert = Vue.extend({
      template: `<el-alert
      title="${node.attributes[realAnnoRequiredArgNames[0]]}"
      type=${node.attributes['type'] ? "'" + node.attributes['type'] + "'" : 'info'}>
    </el-alert>`,
      data: function () {
        return {
          value: node.attributes[realAnnoRequiredArgNames[0]],
        }
      }
    })

    const alertId = getNanoId()
    const alertScriptId = getNanoId()
    const data = node.data || (node.data = {});
    const hast = h(`span`, { ...node.attributes }, [
      h(`script#${alertScriptId}`, {}),
      h(`div#${alertId}`, { ...node.attributes })
    ])
    data.hName = hast.tagName;
    data.hProperties = hast.properties;
    data.hChildren = hast.children;
    // data.value = null

    // @todo 待优化 div好像没有onload方法
    function renderTimer() {

      const alert = document.getElementById(alertId)
      if (alert) {

        // 创建 Profile 实例，并挂载到一个元素上。
        new Alert().$mount(`#${alertId}`)

      } else {
        setTimeout(() => {
          renderTimer()
        }, 200)
      }
    }

    renderTimer()


 

  },
};
