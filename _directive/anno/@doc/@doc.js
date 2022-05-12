import { getNextNodeByLatestAncestor, renderVoidElement } from "../../utils/utils";
import { h } from "hastscript";
import { trim } from "lodash";

export default {
  namespace: "doc",
  beforeRender: {
    nextNode2Attr: (node, ancestors) => {
      
    }
  },
  render: (node, ancestors) => {
    const latestAncestors = ancestors[ancestors.length - 1];
    const hasEnoughChildren =
      latestAncestors.children && latestAncestors.children.length > 1;

    if (!hasEnoughChildren) {
      renderVoidElement(node);
      return;
    }


    let nextNode = getNextNodeByLatestAncestor(node, latestAncestors);

    if (nextNode) {
      const linkSplitArr = nextNode.value.split("/");
      const linkSplitName =
        linkSplitArr.length > 0
          ? linkSplitArr[linkSplitArr.length - 1]
          : nextNode.value;

      const data = nextNode.data || (nextNode.data = {});
      const hast = h(
        node.attributes.tagName || "a",
        {
          ...node.attributes,
          [node.attributes.srcName || "href"]: trim(nextNode.value),
          target: "_blank",
        },
        [node.attributes.docName || linkSplitName]
      );

      data.hName = hast.tagName;
      data.hProperties = hast.properties;
      data.hChildren = hast.children;
    }

    // 无论是否找到nextNode, 当前节点都得渲染成空节点
    renderVoidElement(node);


  },


};
