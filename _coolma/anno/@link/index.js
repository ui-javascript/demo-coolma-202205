import { getNextNodeByLatestAncestor, renderVoidElement } from "../../utils/utils";
import { h } from "hastscript";
import { trim } from "lodash";

export const urlRegex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\*\+,;=.]+$/

export default {
  namespace: "link",
  
  realAnnoRequiredArgNames: ['href'],
  realAnnoExtArgNames: null, // 补充字段, 数组形式, 非必填  
  realAnnoShortcutAttrs: null,

  // 参数转换配置
  autoConvertArg2Attr: true,
  needConvertPrevNode2Attr: false, // 默认false, 配置true会优先向前读
  needConvertNextNode2Attr: true, 


  beforeRender: {
    

    nextNode2Attr: (node, ancestors, realAnnoRequiredArgNames, nextNode) => {
      debugger
      
      // 判断后置节点内容是否为URL
      let nextVal = trim(nextNode.value || nextNode.url)
      if (!urlRegex.test(nextVal)) {
          return
      }

      node.attributes[realAnnoRequiredArgNames[0]] = nextVal
      renderVoidElement(nextNode) // 取值结束不再需要渲染后置节点
    }
  },

  // @advice node.args映射至node.attributes的工作 请在beforeRender的函数内完成
  render: (node, ancestors, realAnnoRequiredArgNames, realAnnoShortcutAttrs, loseAttrs)  => {

  const linkSplitArr =  node.attributes[realAnnoRequiredArgNames[0]].split("/");
  const linkSplitName =
    linkSplitArr.length > 0
      ? linkSplitArr[linkSplitArr.length - 1] || node.attributes[realAnnoRequiredArgNames[0]]
      : node.attributes[realAnnoRequiredArgNames[0]];

    const data = node.data || (node.data = {});
    const hast = h(
      node.attributes.tagName || "a",
      {
        ...node.attributes,
        [node.attributes.srcName || realAnnoRequiredArgNames[0]]: node.attributes[realAnnoRequiredArgNames[0]],
        target: "_blank",
      },
      [node.attributes.title || linkSplitName]
    );

    data.hName = hast.tagName;
    data.hProperties = hast.properties;
    data.hChildren = hast.children;



  },


};
