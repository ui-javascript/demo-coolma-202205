import { getNextTextOrLinkNodeByAncestors, getNextTextOrLinkNodeByLatestAncestor, renderVoidElement } from "../../utils/utils";
import { h } from "hastscript";
import { trim, upperCase } from "lodash";

export const urlRegex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\*\+,;=.]+$/

export default {
  namespace: "link",
  
  realAnnoRequiredArgNames: null,
  realAnnoExtArgNames: ['srcName'], // 补充字段, 数组形式, 非必填  
  realAnnoShortcutAttrs: null,

  // 参数转换配置
  autoConvertArg2Attr: true,
  needConvertPrevNode2Attr: false, // 默认false, 配置true会优先向前读
  needConvertNextNode2Attr: true, 


  beforeRender: {
    

  },

  // @advice node.args映射至node.attributes的工作 请在beforeRender的函数内完成
  render: (node, ancestors, realAnnoRequiredArgNames, realAnnoShortcutAttrs, loseAttrs)  => {

    let renderNode = null

    // 优先渲染后置节点
    renderNode = getNextTextOrLinkNodeByAncestors(node, ancestors) 
    
    if (!renderNode) {
      const data = node.data || (node.data = {});
      const hast = h("span", {}, "@" + node.name);

      data.hName = hast.tagName;
      data.hProperties = hast.properties;
      data.hChildren = hast.children;

      return
    }

    const urlVal = trim(renderNode.value || renderNode.url)
    renderVoidElement(renderNode)

    const linkSplitArr =  urlVal.split("/");
    const linkSplitName =
      linkSplitArr.length > 0
        ? linkSplitArr[linkSplitArr.length - 1] || urlVal
        : urlVal;

      const data = node.data || (node.data = {});
      const hast = h(
        node.attributes.tagName || "a",
        {
          ...node.attributes,
          [node.attributes.srcName || 'href']: urlVal,
          target: "_blank",
        },
        [node.attributes.title || linkSplitName]
      );

      data.hName = hast.tagName;
      data.hProperties = hast.properties;
      data.hChildren = hast.children;



  },


};
