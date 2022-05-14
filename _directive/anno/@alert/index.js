import { getNextNodeByLatestAncestor, getNextNodeByAncestor, renderVoidElement, getPrevNodeByAncestors, getPrevNodeByLatestAncestor } from "../../utils/utils";
import { h } from "hastscript";
import { trim } from "lodash";
import { nanoid } from "nanoid";

export default {
  namespace: "alert",
  
  realAnnoRequiredArgNames: null, // 不需要参数
  realAnnoExtArgNames: ['type'], // 补充字段, 数组形式, 非必填
  autoConvertArg2Attr: true,
  realAnnoShortcutAttrs: null,

  beforeRender: {
    args2Attr: (node, ancestors) => {},
  },
  
  // @advice node.args映射至node.attributes的工作 请在beforeRender的函数内完成
  render: (node, ancestors, realAnnoRequiredArgNames, realAnnoShortcutAttrs, loseAttrs)  => {
    
    const latestAncestors = ancestors[ancestors.length - 1];
    const hasEnoughChildren = latestAncestors.children && latestAncestors.children.length > 1; // 除指令外至少还有一个元素
    if (!hasEnoughChildren) {
      return
    }

    let renderNode = null

    // 优先渲染后置节点
    renderNode = getPrevNodeByLatestAncestor(node, latestAncestors)
    
    if (!renderNode) {
      renderNode = getNextNodeByLatestAncestor(node, latestAncestors)
    }

    if (renderNode) {
      
      debugger
      
      var Alert = Vue.extend({
        template: `<el-alert
        title="${renderNode.value}"
        type=${ node.attributes['type'] ? "'" + node.attributes['type'] + "'" : 'info'}>
      </el-alert>`,
        data: function () {
          return {
            value: node.attributes[realAnnoRequiredArgNames[0]],
          }
        }
      })

      const alertId = nanoid()
      const data = renderNode.data || (renderNode.data = {});
      const hast = h(`div#${alertId}`, node.attributes, null);
      data.hName = hast.tagName;
      data.value = null
      data.hProperties = hast.properties;
      data.hChildren = hast.children;

      // @todo 待优化 div好像没有onload方法
      const timer = setTimeout(() => {
        const alert = document.getElementById(alertId)
        if (alert) {
          // 创建 Profile 实例，并挂载到一个元素上。
          new Alert().$mount(`#${alertId}`)
        } else {
          timer()
        }
      }, 200)


    }

    renderVoidElement(node)

  },
};
