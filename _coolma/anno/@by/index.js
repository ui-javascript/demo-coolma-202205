import { renderVoidElement } from "../../utils/utils";
import { h } from "hastscript";
import { trim } from "lodash";

export const urlRegex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\*\+,;=.]+$/

export default {
  namespace: 'by',

  realAnnoRequiredArgNames: ['name'],
  realAnnoExtArgNames: null, // 补充字段, 数组形式, 非必填  
  realAnnoShortcutAttrs: null,

  // 自动转换配置
  autoConvertArg2Attr: true,
  needConvertPrevNode2Attr: false,
  needConvertNextNode2Attr: true,
  
  beforeRender: {

    nextNode2Attr: (node, ancestors, realAnnoRequiredArgNames, nextNode) => {
        let nextVal = trim(nextNode.value || nextNode.url)
        node.attributes[realAnnoRequiredArgNames[0]] = trim(nextVal)
        // renderVoidElement(nextNode) // 取值结束不再需要渲染后置节点

        const data = nextNode.data || (nextNode.data = {});
        const hast = h("a", {
          href: !urlRegex.test(nextVal) ? `https://baike.baidu.com/item/${nextVal}` : nextVal,
          target: "_blank",
        }, node.attributes[realAnnoRequiredArgNames[0]]);
    
        data.hName = hast.tagName;
        data.hProperties = hast.properties;
        data.hChildren = hast.children;
    }
  },

  // @advice node.args映射至node.attributes的工作 请在beforeRender的函数内完成
  render: (node, ancestors, realAnnoRequiredArgNames, realAnnoShortcutAttrs, loseAttrs)  => {
   
    const isUrl = urlRegex.test(node.attributes[realAnnoRequiredArgNames[0]])
   

    const data = node.data || (node.data = {});
    const hast = h("span", {

    }, isUrl ? "@BY" : "-- ");

    data.hName = hast.tagName;
    data.hProperties = hast.properties;
    data.hChildren = hast.children;

  }

};
