import { h } from "hastscript";

export default function registerAnnoAbbr(node, ancestors) {

  const data = node.data || (node.data = {});
  if (!("title" in node.attributes) && node.args && node.args.length > 1) {
    node.attributes.title = node.args[1];
  }

  const hast = h(node.name, node.attributes, 
    node.args && node.args.length > 0 ? node.args[0] : "",
  );

  data.hName = hast.tagName;
  data.hProperties = hast.properties;
  data.hChildren = hast.children;
}
