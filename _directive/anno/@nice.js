import { renderVoidElement } from "../utils/utils";
import { h } from "hastscript";
import { trim } from "lodash";

export default function registerAnnoNice(annoAlias, node, ancestors) {
    if (node.name != "nice") {
      return;
    }
  
    
    console.log("父节点");
    console.log(ancestors);
  
    const latestAncestors = ancestors[ancestors.length - 1];
  
    if (!latestAncestors.children || latestAncestors.children.length === 0) {
      return;
    }
  
    for (let idx in latestAncestors.children) {
      // console.log("节点" + idx)
      // console.log(item)
      const item = latestAncestors.children[idx];
      idx = parseInt(idx);
  
      if (
        item.type === "textDirective" 
        && item.name === "nice"  // @todo 准确定位标签
      ) {
        let nextIdx = idx;
        let prevIdx = idx;
        let nextNode = null;
        let prevNode = null;
  
        while (++nextIdx < latestAncestors.children.length) {
          const tempNode = latestAncestors.children[nextIdx];
  
          if (tempNode && tempNode.type === "text" && trim(tempNode.value)) {
            nextNode = tempNode;
            break;
          }
        }
  
        if (!nextNode) {
          // debugger;
          while (--prevIdx > -1) {
            const tempNode = latestAncestors.children[prevIdx];
  
            if (tempNode && tempNode.type === "text" && trim(tempNode.value)) {
              // debugger;
              prevNode = tempNode;
              break;
            }
          }
        }
  
        if (nextNode) {
          console.log("修改后节点");
          console.log(nextNode);
  
          const data = nextNode.data || (nextNode.data = {});
          const hast = h("mark", nextNode.value);
          data.hName = hast.tagName;
          data.hProperties = hast.properties;
          data.hChildren = hast.children;
        } else if (prevNode) {
          console.log("修改前节点");
          console.log(prevNode);
  
          const data = prevNode.data || (prevNode.data = {});
          const hast = h("mark", prevNode.value);
          data.hName = hast.tagName;
          data.hProperties = hast.properties;
          data.hChildren = hast.children;
        }
  
        renderVoidElement(node)
  
        break;
      }
    }


  }
  