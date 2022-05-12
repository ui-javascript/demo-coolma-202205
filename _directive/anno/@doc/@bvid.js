import { renderVoidElement } from "../../utils/utils";
import { h } from "hastscript";
import { trim } from "lodash";

export default {
  namespace: 'bvid',
  exec: (node, ancestors) => {
    const latestAncestors = ancestors[ancestors.length - 1];

    const hasEnoughChildren =
      latestAncestors.children && latestAncestors.children.length > 1;

    if (!hasEnoughChildren) {
      renderVoidElement(node);
      return;
    }

    let nextNode = null;
    for (let idx in latestAncestors.children) {
      // console.log("节点" + idx)
      // console.log(item)
      const item = latestAncestors.children[idx];
      idx = parseInt(idx);

      if (
        item.type === "textDirective" &&
        item.name === node.name // @todo 准确定位标签
      ) {
        let nextIdx = idx;

        while (++nextIdx < latestAncestors.children.length) {
          const tempNode = latestAncestors.children[nextIdx];

          if (tempNode && tempNode.type === "text" && trim(tempNode.value)) {
            nextNode = tempNode;
            break;
          }
        }

        if (nextNode) {
          const data = nextNode.data || (nextNode.data = {});
          const hast = h("iframe", {
            ...node.attributes,
            src: `https://player.bilibili.com/player.html?bvid=${trim(
              nextNode.value
            )}`,
            scrolling: "no",
            border: "0",
            frameborder: "no",
            framespacing: "0",
            allowfullscreen: "true",
          });

          data.hName = hast.tagName;
          data.hProperties = hast.properties;
          data.hChildren = hast.children;
        }

        break;
      }
    }

    // 无论是否找到nextNode, 当前节点都得渲染成空节点
    renderVoidElement(node);
  },
};
