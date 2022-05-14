import { h } from "hastscript";
import { trim } from "lodash";
import moment from "moment";
import { renderVoidElement } from "../../utils/utils";

export default {
  namespace: 'until',
  
  realAnnoRequiredArgNames: ['deadline'], // 必填字段
  realAnnoExtArgNames: ['tip', 'createDate'], // 补充字段, 非必填
  realAnnoShortcutAttrs: null,

  // 参数转换配置
  autoConvertArg2Attr: true,
  needConvertPrevNode2Attr: false, // 默认false, 配置true会优先向前读
  needConvertNextNode2Attr: true, 


  beforeRender: {
  
    nextNode2Attr: (node, ancestors, realAnnoRequiredArgNames, nextNode) => {
      const nextVal = moment(trim(nextNode.value))
      if (nextVal.isValid()) {
        node.attributes[realAnnoRequiredArgNames[0]] = trim(nextNode.value)
        renderVoidElement(nextNode) // 取值结束不再需要渲染后置节点
      }
    
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
      (node.attributes.tip ||  '📌热门') + (timeTip ? `(${timeTip})`: '')
    );


    data.hName = hast.tagName;
    data.hProperties = hast.properties;
    data.hChildren = hast.children;
  },
};
