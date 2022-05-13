import { h } from "hastscript";

export default {
  namespace: 'abbr',
  
  realAnnoRequiredArgNames: ['abbrName', 'fullName'],
  realAnnoExtArgNames: null, // 补充字段, 数组形式, 非必填
  autoConvertArg2Attr: true,
  realAnnoShortcutAttrs: null,

  
  beforeRender: {
    args2Attr: (node, ancestors) => {},
  },

  // @advice node.args映射至node.attributes的工作 请在beforeRender的函数内完成
  render: (node, ancestors, realAnnoRequiredArgNames, realAnnoShortcutAttrs, loseAttrs)  => {
        
    const data = node.data || (node.data = {});

    const hast = h(
      node.name,
      {
        ...node.attributes,
        title: null,
        "data-tooltip": node.attributes.fullName,
      },
      node.attributes.abbrName
    );

    data.hName = hast.tagName;
    data.hProperties = hast.properties;
    data.hChildren = hast.children;
  },
};
