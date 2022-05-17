import { renderVoidElement, getPrevTextOrLinkNodeByLatestAncestors, getNextTextOrLinkNodeByLatestAncestors } from "../../utils/utils";
import { h } from "hastscript";
import { trim } from "lodash";

export default {
  namespace: "order",
  
  realAnnoRequiredArgNames: null, // 不需要参数
  realAnnoExtArgNames: null, // 补充字段, 数组形式, 非必填
  realAnnoShortcutAttrs: null,

  // 参数转换配置
  autoConvertArg2Attr: false,
  needConvertPrevNode2Attr: false, // 默认false, 配置true会优先向前读
  needConvertNextNode2Attr: false, 

  beforeRender: {
    
  },
  
  // @advice node.args映射至node.attributes的工作 请在beforeRender的函数内完成
  render: (node, ancestors, realAnnoRequiredArgNames, realAnnoShortcutAttrs, loseAttrs)  => {
    
    if (ancestors.length < 3) {
      return
    }

    const parentNode = ancestors[ancestors.length - 2]
    if (parentNode.children.length > 1) {
      parentNode.children[1].ordered = true
    }

    const grandNode = ancestors[ancestors.length - 3]
    grandNode.ordered = true
   
  },
};
