import { h } from "hastscript";

// @todo 暂时先伪装成块内元素
export function renderVoidElement(node) {
    const nodeData = node.data || (node.data = {});
    nodeData.hName = h("span", {}).tagName;
}
 