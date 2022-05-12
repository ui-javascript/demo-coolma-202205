import { getNextNodeByLatestAncestor, getNextNodeByAncestor, renderVoidElement, getPrevNodeByAncestors, getPrevNodeByLatestAncestor } from "../../utils/utils";
import { h } from "hastscript";
import { trim } from "lodash";

export default {
  namespace: "mark",
  
  realAnnoExpectedArgNames: null, // 不需要参数
  autoConvertArg2Attr: true,
  beforeRender: {
    args2Attr: (node, ancestors) => {},
  },
  
  realAnnoShortcutAttrs: null,


  // @advice node.args映射至node.attributes的工作 请在beforeRender的函数内完成
  render: (node, ancestors, realAnnoExpectedArgNames, realAnnoShortcutAttrs, loseAttrs)  => {
    
    const latestAncestors = ancestors[ancestors.length - 1];
    const hasEnoughChildren = latestAncestors.children && latestAncestors.children.length > 1; // 除指令外至少还有一个元素
    if (!hasEnoughChildren) {
      return
    }

    let renderNode = null

    // 优先渲染后置节点
    renderNode = getNextNodeByLatestAncestor(node, latestAncestors)

    if (!renderNode) {
      renderNode = getPrevNodeByLatestAncestor(node, latestAncestors)
    }

    if (renderNode) {
      const data = renderNode.data || (renderNode.data = {});
      const hast = h(node.attributes.tagName || "mark", {...node.attributes}, renderNode.value);
      data.hName = hast.tagName;
      data.hProperties = hast.properties;
      data.hChildren = hast.children;
    }


    renderVoidElement(node)

  },
};
