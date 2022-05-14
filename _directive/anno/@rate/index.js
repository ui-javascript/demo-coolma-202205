import { renderVoidElement } from "../../utils/utils";
import { h } from "hastscript";
import { trim } from "lodash";

export default {
  namespace: 'rate',

  realAnnoRequiredArgNames: ['star'],
  realAnnoExtArgNames: null, // 补充字段, 数组形式, 非必填
  autoConvertArg2Attr: true,
  
  realAnnoShortcutAttrs: null,
  
  beforeRender: {
    args2Attr: (node, ancestors) => {},

    nextNode2Attr: (node, ancestors, realAnnoRequiredArgNames, nextNode) => {
        node.attributes[realAnnoRequiredArgNames[0]] = trim(nextNode.value)
        renderVoidElement(nextNode) // 取值结束不再需要渲染后置节点
    }
  },

  // @advice node.args映射至node.attributes的工作 请在beforeRender的函数内完成
  render: (node, ancestors, realAnnoRequiredArgNames, realAnnoShortcutAttrs, loseAttrs)  => {
   
    const data = node.data || (node.data = {});
    const hast = h("el-rate", {
      ...node.attributes,
      disabled: true,
      'show-score': true,
      'text-color': "#ff9900",
      value: node.attributes.star,
      'score-template': "{value}",
      style: "display: inline-block"
    });

    data.hName = hast.tagName;
    data.hProperties = hast.properties;
    data.hChildren = hast.children;

  }

};
