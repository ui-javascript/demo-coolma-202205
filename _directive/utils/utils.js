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
    let isOk = false;
    for (let key in annoAlias) {
      if (node.name === key && annoAlias[key].attachAnno === anno.namespace) {
        isOk = true;
        aliasAttributes = annoAlias[key]['properties'];
        break;
      }
    }

    if (!isOk) {
      return;
    }
  }

  if (aliasAttributes) {
    // @fix 小心aliasAttributes被覆盖
    node.attributes = Object.assign({}, aliasAttributes, node.attributes || {});
  }

  anno.render(node, ancestors);
}
