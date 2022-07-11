import { renderVoidElement } from "../../utils/utils";
import { h } from "hastscript";
import { trim } from "lodash";

export default {
  namespace: 'logo',

  realAnnoRequiredArgNames: ['domain'],
  realAnnoExtArgNames: null, // 补充字段, 数组形式, 非必填  
  realAnnoShortcutAttrs: null,

  // 自动转换配置
  autoConvertArg2Attr: true,
  needConvertPrevNode2Attr: false,
  needConvertNextNode2Attr: false,
  
  beforeRender: {

    // prevNode2Attr: (node, ancestors, realAnnoRequiredArgNames, prevNode) => {
    //   debugger
    //     node.attributes[realAnnoRequiredArgNames[0]] = trim(prevNode.value).replace(/^http(s)?:\/\//, "")
    //     renderVoidElement(prevNode) // 取值结束不再需要渲染后置节点
    // }

  },

  // @advice node.args映射至node.attributes的工作 请在beforeRender的函数内完成
  render: (node, ancestors, realAnnoRequiredArgNames, realAnnoShortcutAttrs, loseAttrs)  => {
   
    realAnnoRequiredArgNames[0] = trim(realAnnoRequiredArgNames[0]).replace(/^(http|https):\/\//, "")

    const data = node.data || (node.data = {});
    const hast = h("img", {
      ...node.attributes,
      style: "width: 64px; height: 64px",
      fit: 'fit',
      src: `https://www.google.com/s2/favicons?sz=64&domain=${node.attributes[realAnnoRequiredArgNames[0]]}`,
      // src: "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"
    });

    data.hName = hast.tagName;
    data.hProperties = hast.properties;
    data.hChildren = hast.children;

  }

};
