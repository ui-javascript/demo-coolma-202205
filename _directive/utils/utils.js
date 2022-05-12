import { h } from "hastscript";

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

  if (node.name !== anno.namespace) {

    // 这个节点是否有注册别名
    if (Object.keys(annoAlias).includes(node.name) && annoAlias[node.name].attachAnno === anno.namespace) {
      aliasAttributes = annoAlias[node.name]['properties'];
    } else { // 都不符合要求
      renderVoidElement(node)
      return;
    }

  }

  if (aliasAttributes) {
    // @fix 小心aliasAttributes被覆盖
    // 当前节点的属性优先级最高
    node.attributes = Object.assign({}, aliasAttributes, node.attributes);
  }

  anno.render(node, ancestors);
}
