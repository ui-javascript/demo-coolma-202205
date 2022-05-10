import { renderVoidElement } from "../utils/utils";
import { h } from "hastscript";
import { trim } from "lodash";

export default function registerAnnoAbbr(node) {
    if (node.name != "abbr") {
      return;
    }
  
    // console.log("node ==>")
    // console.log(node)
    const data = node.data || (node.data = {});
    if (!("title" in node.attributes) && node.args && node.args.length > 1) {
      node.attributes.title = node.args[1];
    }
    const hast = h(node.name, node.attributes, [
      node.args && node.args.length > 0 ? node.args[0] : "",
    ]);
  
    data.hName = hast.tagName;
    data.hProperties = hast.properties;
    // console.log(hast);
  
    node.children = hast.children;
  }
  