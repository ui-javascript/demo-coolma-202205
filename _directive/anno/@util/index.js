import { h } from "hastscript";
import moment from "moment";

export default {
  namespace: 'util',
  
  realAnnoRequiredArgNames: ['deadline'], // 必填字段
  realAnnoExtArgNames: ['tipText', 'createDate'], // 补充字段, 非必填
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
        
    const date = moment(node.attributes.deadline)

    // 是否合法
    if (!date.isValid()) {
      renderVoidElement(node)
      return 
    }

    // 已过期
    if (date.isBefore(new Date())) {
      renderVoidElement(node)
      return
    }

    let timeTip = null
    if (node.attributes.createDate && moment(node.attributes.createDate).isValid()) {
      timeTip = moment(node.attributes.createDate).fromNow()
    }

    const data = node.data || (node.data = {});
    const hast = h(
      'span',
      {
        ...node.attributes,
      },
      (node.attributes.tipText ||  '📌新文章欸') + (timeTip ? `(${timeTip})`: '')
    );


    data.hName = hast.tagName;
    data.hProperties = hast.properties;
    data.hChildren = hast.children;
  },
};
