import { renderVoidElement } from "../../utils/utils";
import { h } from "hastscript";
import { trim } from "lodash";

export default {
  namespace: 'bvid',

  realAnnoExpectedArgNames: ['vid'],
  autoConvertArg2Attr: true,
  beforeRender: {
    args2Attr: (node, ancestors) => {},
  },
  
  realAnnoShortcutAttrs: null,
  
  beforeRender: {
    nextNode2Attr: (node, ancestors, realAnnoExpectedArgNames, nextNode) => {
        node.attributes[realAnnoExpectedArgNames[0]] = trim(nextNode.value)
        renderVoidElement(nextNode) // 取值结束不再需要渲染的情况
    }
  },

  // @advice node.args映射至node.attributes的工作 请在beforeRender的函数内完成
  render: (node, ancestors, realAnnoExpectedArgNames, realAnnoShortcutAttrs, loseAttrs)  => {
   
    const data = node.data || (node.data = {});
    const hast = h("iframe", {
      ...node.attributes,
      src: `https://player.bilibili.com/player.html?bvid=${node.attributes[realAnnoExpectedArgNames[0]]}`,
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
