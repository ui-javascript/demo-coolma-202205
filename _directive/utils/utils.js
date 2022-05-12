import { h } from "hastscript";
import { trim } from "lodash";

// @todo 暂时先伪装成块内元素
export function renderVoidElement(node) {
  const nodeData = node.data || (node.data = {});
  nodeData.hName = h("span", {}).tagName;
}

export function initAliasMeta(annoAliasMeta, annoName, aliaName, config) {
  if (!annoAliasMeta[aliaName]) {
    annoAliasMeta[aliaName] = {};
  }
  annoAliasMeta[aliaName].attachAnno = annoName;
  annoAliasMeta[aliaName].properties = config
}

export function registerAnno(anno, annoAlias, node, ancestors) {
  let aliasAttributes = null;

  // 判断当前注解是否合法
  if (node.name !== anno.namespace) {
    // 这个节点是否有注册别名
    if (Object.keys(annoAlias).includes(node.name) && annoAlias[node.name].attachAnno === anno.namespace) {
      aliasAttributes = annoAlias[node.name]['properties'];
    } else { // 都不符合要求
      renderVoidElement(node)
      return;
    }
  }

  if (anno.beforeRender && anno.beforeRender.prevNode2Attr) {
    anno.beforeRender.prevNode2Attr(node, ancestors)
  }

  if (anno.beforeRender && anno.beforeRender.nextNode2Attr) {
    anno.beforeRender.nextNode2Attr(node, ancestors)
  }

  if (anno.beforeRender && anno.beforeRender.args2Attr) {
    anno.beforeRender.args2Attr(node, ancestors)
  }

  if (aliasAttributes) {
    // @fix 小心aliasAttributes被覆盖
    // 配置属性优先级 args2Attr > nextNode2Attr > prevNode2Attr > node.attributes > aliasAttributes > 默认属性    
    node.attributes = Object.assign({}, aliasAttributes, node.attributes);
  }

  // 开始渲染合法标签
  anno.render(node, ancestors);
}


export function getNextNodeByLatestAncestor(node, latestAncestors) {
  let nextNode = null;

  for (let idx in latestAncestors.children) {
    const item = latestAncestors.children[idx];
    idx = parseInt(idx);

    // @todo 准确定位标签
    if (
      item.type === "textDirective" &&
      item.name === node.name 
    ) {
      let nextIdx = idx;

      while (++nextIdx < latestAncestors.children.length) {
        const tempNode = latestAncestors.children[nextIdx];

        if (tempNode && tempNode.type === "text" && trim(tempNode.value)) {
          nextNode = tempNode;
          break;
        }
      }
    }
  }
  
  return nextNode;
}

