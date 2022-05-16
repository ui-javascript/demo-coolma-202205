import { renderVoidElement, getPrevTextOrLinkNodeByLatestAncestors, getNextTextOrLinkNodeByLatestAncestors } from "../../utils/utils";
import { h } from "hastscript";
import { trim } from "lodash";

export default {
  namespace: "mark",
  
  realAnnoRequiredArgNames: null, // 不需要参数
  realAnnoExtArgNames: ['tagName'], // 补充字段, 数组形式, 非必填
  realAnnoShortcutAttrs: null,

  // 参数转换配置
  autoConvertArg2Attr: true,
  needConvertPrevNode2Attr: false, // 默认false, 配置true会优先向前读
  needConvertNextNode2Attr: false, 

  beforeRender: {
    
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
    renderNode = getPrevTextOrLinkNodeByLatestAncestors(node, latestAncestors) 
      || getNextTextOrLinkNodeByLatestAncestors(node, latestAncestors)
    


    if (renderNode) {
      const data = renderNode.data || (renderNode.data = {});
      const hast = h(node.attributes.tagName || "mark", node.attributes, renderNode.value);
      data.hName = hast.tagName;
      data.hProperties = hast.properties;
      data.hChildren = hast.children;
    }


    renderVoidElement(node)

  },
};
