import { renderVoidElement } from "../utils/utils";
import { h } from "hastscript";
import { trim } from "lodash";

export const emojiXiongUrl =
  "https://luo0412.oss-cn-hangzhou.aliyuncs.com/static/images/index/xiong.gif";
export const emojiCatUrl =
  "https://luo0412.oss-cn-hangzhou.aliyuncs.com/1652243827370-DjxeEK7YYXXp.jpeg";

export default function registerAnnoImg(node, ancestors) {
  const latestAncestors = ancestors[ancestors.length - 1];

  const hasEnoughChildren =
    latestAncestors.children && latestAncestors.children.length > 1;
  const isEmoji = "xiong" in node.attributes || "cat" in node.attributes;
  const hasArg = node.args && node.args.length > 0;
  const hasUrlAttr = "url" in node.attributes || "src" in node.attributes;

  if (!isEmoji && !hasUrlAttr && !hasArg && !hasEnoughChildren) {
    renderVoidElement(node);
    return;
  }

  // @todo 冗余代码
  if (isEmoji) {
    const data = node.data || (node.data = {});
    const hast = h("img", {
      ...node.attributes,
      src: "xiong" in node.attributes ? emojiXiongUrl : emojiCatUrl,
    });

    data.hName = hast.tagName;
    data.hProperties = hast.properties;
    data.hChildren = hast.children;

    return;
  }

  if (hasUrlAttr) {
    const data = node.data || (node.data = {});
    const hast = h("img", {
      ...node.attributes,
      src: node.attributes.url || node.attributes.src,
    });

    data.hName = hast.tagName;
    data.hProperties = hast.properties;
    data.hChildren = hast.children;

    return;
  }

  if (hasArg) {
    const data = node.data || (node.data = {});
    const hast = h("img", {
      ...node.attributes,
      src: node.args[0],
    });

    data.hName = hast.tagName;
    data.hProperties = hast.properties;
    data.hChildren = hast.children;

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
        console.log("修改后节点");
        console.log(nextNode);

        const data = nextNode.data || (nextNode.data = {});
        const hast = h("img", {
          ...node.attributes,
          src: nextNode.value,
        });

        data.hName = hast.tagName;
        data.hProperties = hast.properties;
        data.hChildren = hast.children;
      }

      break;
    }
  }

  debugger
  if (!nextNode) {
    renderVoidElement(node);
  }
}
