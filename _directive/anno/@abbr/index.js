import { h } from "hastscript";

export default {
  namespace: 'abbr',
  
  realAnnoExpectedArgNames: ['abbrName', 'fullName'],
  autoConvertArg2Attr: true,

  // @advice node.args映射至node.attributes的工作 请在beforeRender的函数内完成
  render: (node, ancestors, realAnnoExpectedArgNames, realAnnoShortcutAttrs, loseAttrs)  => {
    const data = node.data || (node.data = {});
    if (!("title" in node.attributes) && node.args && node.args.length > 1) {
      node.attributes.title = node.args[1];
    }

    const hast = h(
      node.name,
      {
        ...node.attributes,
        title: null,
        "data-tooltip": node.attributes.title,
      },
      node.args && node.args.length > 0 ? node.args[0] : ""
    );

    data.hName = hast.tagName;
    data.hProperties = hast.properties;
    data.hChildren = hast.children;
  },
};
