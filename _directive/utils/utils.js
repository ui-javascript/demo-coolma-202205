import { h } from "hastscript";
import { trim, intersection, difference } from "lodash";

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
  let isRegisteredAliasAnno = false
  if (node.name !== realAnno.namespace) {
    isRegisteredAliasAnno = Object.keys(annoAlias).includes(node.name) && annoAlias[node.name].attachAnno === realAnno.namespace
    if (!isRegisteredAliasAnno) {
      return;
    }
  }

  if (realAnno.beforeRender && realAnno.beforeRender.prevNode2Attr) {
    realAnno.beforeRender.prevNode2Attr(node, ancestors)
  }

  if (node.name === "fetch") {
    debugger
  }

  if (realAnno.beforeRender && realAnno.beforeRender.nextNode2Attr) {
    const nextNode = getNextNodeByAncestors(node, ancestors)
    if (nextNode) {
      realAnno.beforeRender.nextNode2Attr(node, ancestors, nextNode)
    }
  }

  if (realAnno.beforeRender && realAnno.beforeRender.args2Attr) {
    if (!isRegisteredAliasAnno && !realAnno.expectedArgNames && realAnno.expectedArgNames.length > 0 && this.autoArg2Attr != false) { // 默认自动转换参数

    }
    realAnno.beforeRender.args2Attr(node, ancestors)
  }

  if (isRegisteredAliasAnno && annoAlias[node.name]['properties']) {
    // @fix 按优先级覆盖配置
    // 配置属性优先级: (args2Attr > nextNode2Attr > prevNode2Attr) > node.attributes > aliasAttributes > 默认属性    
    node.attributes = Object.assign({}, annoAlias[node.name]['properties'], node.attributes);
  }

  // 检测属性是否有缺失
  const expectedArgNames = node.expectedArgNames || realAnno.expectedArgNames
  if (expectedArgNames && expectedArgNames.length > 0) {
    const diffAttrs = difference(expectedArgNames, Object.keys(node.attributes))
    if (diffAttrs && diffAttrs.length > 0) {
      console.log(`${node.name} 存在属性 ${diffAttrs.join(",")} 缺失!!`)
      // return
    }
  }

  // 开始渲染合法的标签, 渲染仅根据属性node.attributes来
  realAnno.render(node, ancestors);
}


export function getNextNodeByAncestors(node, ancestors) {
  let nextNode = null;

  const latestAncestors = ancestors[ancestors.length - 1];
  const hasEnoughChildren = latestAncestors.children && latestAncestors.children.length > 1; // 除指令至少还有一个元素

  if (!hasEnoughChildren) {
    return nextNode;
  }

  nextNode = getNextNodeByLatestAncestor(node, latestAncestors)
  return nextNode;
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

