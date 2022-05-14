import { renderVoidElement } from "../../utils/utils";
import { h } from "hastscript";
import { trim } from "lodash";

export default {
  namespace: 'bvid',

  realAnnoRequiredArgNames: ['vid'],
  realAnnoExtArgNames: null, // 补充字段, 数组形式, 非必填  
  realAnnoShortcutAttrs: null,

  // 自动转换配置
  autoConvertArg2Attr: true,
  needConvertPrevNode2Attr: false,
  needConvertNextNode2Attr: true,
  
  beforeRender: {

    nextNode2Attr: (node, ancestors, realAnnoRequiredArgNames, nextNode) => {
        node.attributes[realAnnoRequiredArgNames[0]] = trim(nextNode.value)
        renderVoidElement(nextNode) // 取值结束不再需要渲染后置节点
    }
  },

  // @advice node.args映射至node.attributes的工作 请在beforeRender的函数内完成
  render: (node, ancestors, realAnnoRequiredArgNames, realAnnoShortcutAttrs, loseAttrs)  => {
   
    const data = node.data || (node.data = {});
    const hast = h("iframe", {
      ...node.attributes,
      src: `https://player.bilibili.com/player.html?bvid=${node.attributes[realAnnoRequiredArgNames[0]]}`,
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

};
