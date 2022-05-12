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

export function registerAnno(realAnno, annoAlias, node, ancestors) {
 
  // 判断当前注解是否合法
  // 这个节点是否有注册别名
  let hasRegisterAlias = false
  if (node.name !== realAnno.namespace) {
    hasRegisterAlias = Object.keys(annoAlias).includes(node.name) && annoAlias[node.name].attachAnno === realAnno.namespace
    if (!hasRegisterAlias) {
      return;
    }
  }

  if (realAnno.beforeRender && realAnno.beforeRender.prevNode2Attr) {
    realAnno.beforeRender.prevNode2Attr(node, ancestors)
  }

  if (realAnno.beforeRender && realAnno.beforeRender.nextNode2Attr) {
    realAnno.beforeRender.nextNode2Attr(node, ancestors)
  }

  if (realAnno.beforeRender && realAnno.beforeRender.args2Attr) {
    realAnno.beforeRender.args2Attr(node, ancestors)
  }

  if (hasRegisterAlias && annoAlias[node.name]['properties']) {
    // @fix 按优先级覆盖配置
    // 配置属性优先级: (args2Attr > nextNode2Attr > prevNode2Attr) > node.attributes > aliasAttributes > 默认属性    
    node.attributes = Object.assign({}, annoAlias[node.name]['properties'], node.attributes);
  }

  // 开始渲染合法的标签, 渲染仅根据属性attributes来
  realAnno.render(node, ancestors);
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

