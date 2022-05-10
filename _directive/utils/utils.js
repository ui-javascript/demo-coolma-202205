import { h } from "hastscript";

// @todo 暂时先伪装成块内元素
export function renderVoidElement(node) {
  const nodeData = node.data || (node.data = {});
  nodeData.hName = h("", {}).tagName;
}

export function initAliasMeta(annoAliasMeta, annoName, aliaName, config) {
  if (!annoAliasMeta[annoName]) {
    annoAliasMeta[annoName] = {};
  }
  annoAliasMeta[annoName][aliaName] = config;
}

export function registerAnno(annoName, annoAlias, node, ancestors, regFn) {
  let aliasAttributes = null;

  if (node.name !== annoName) {
    let isOk = false;
    for (let key in annoAlias[annoName]) {
      if (node.name === key) {
        isOk = true;
        aliasAttributes = annoAlias[annoName][key];
        break;
      }
    }

    if (!isOk) {
      return;
    }
  }

  if (aliasAttributes) {
    node.attributes = Object.assign(aliasAttributes, node.attributes || {});
  }

  regFn(node, ancestors);
}
