import { h } from "hastscript";

export default {
  namespace: 'abbr',
  expectArgsName: ['abbrName', 'fullName'],
  render: (node, ancestors) => {
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
