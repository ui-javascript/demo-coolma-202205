import { h } from "hastscript";
import { trim, intersection, difference, before } from "lodash";
import moment from "moment";
import { customAlphabet } from "nanoid";


// @todo 先伪装成块内元素
export function renderVoidElement(node) {
  const nodeData = node.data || (node.data = {});
  const hast = h("span", {})
  nodeData.hName = hast.tagName;
  nodeData.hProperties = hast.properties;
  nodeData.hChildren = hast.children;
  node.value = null
}

export function initAliasMeta(annoAliasMeta, annoName, aliaName, config) {
  if (!annoAliasMeta[aliaName]) {
    annoAliasMeta[aliaName] = {};
  }
  annoAliasMeta[aliaName].attachAnno = annoName;
  annoAliasMeta[aliaName].properties = config
}

export function registerAnno(realRenderAnno, annoAlias, node, ancestors) {
 

  // 判断当前注解是否合法
  // 这个节点是否有注册别名
  let isAliasAnno = false
  if (node.name !== realRenderAnno.namespace) {
    isAliasAnno = Object.keys(annoAlias).includes(node.name) && annoAlias[node.name].attachAnno === realRenderAnno.namespace
    if (!isAliasAnno) {
      return;
    }
  }

  if (node.name === "search") {
    debugger
  }

  // 参数自动转成属性
  const realAnnoRequiredArgNames = realRenderAnno.realAnnoRequiredArgNames  
  const autoConvertArg2Attr = getAutoConvertConfig(annoAlias[node.name], realRenderAnno, 'autoConvertArg2Attr')
  if (autoConvertArg2Attr != false 
    && realAnnoRequiredArgNames && realAnnoRequiredArgNames.length > 0
    && node.args && node.args.length > 0) { // 默认自动转换参数

    for (let idx in node.args) {
      if (idx < realAnnoRequiredArgNames.length && !(realAnnoRequiredArgNames[idx] in node.attributes)) { // 不能覆盖node.attributes的配置
        node.attributes[realAnnoRequiredArgNames[idx]] = node.args[idx]
      }
    }  
  } 


  // 前置节点转换成参数
  const autoPrevNode2Attr = getAutoConvertConfig(annoAlias[node.name], realRenderAnno, 'needConvertPrevNode2Attr')
  if (autoPrevNode2Attr == true // 必须显示配置成true
    && realAnnoRequiredArgNames && realAnnoRequiredArgNames.length > 0) {
    
    if (!(realAnnoRequiredArgNames[0] in node.attributes)) { // 不能覆盖node.attributes的配置

      const prevNode = getPrevTextOrLinkNodeByAncestors(node, ancestors)

      // 通过节点读取值暂时只处理一个参数
      const prevNode2AttrFunc = getObjConvertFunc(annoAlias[node.name], realRenderAnno, "beforeRender", "prevNode2Attr")
      if (prevNode && prevNode2AttrFunc) {
        prevNode2AttrFunc(node, ancestors, realAnnoRequiredArgNames, prevNode)
      }
    }
  }

  // 处理后节点的属性
  const autoNextNode2Attr = getAutoConvertConfig(annoAlias[node.name], realRenderAnno, 'needConvertNextNode2Attr')
  if (autoNextNode2Attr != false // 只有禁止才会不执行
    && realAnnoRequiredArgNames && realAnnoRequiredArgNames.length > 0) {
    
    if (!(realAnnoRequiredArgNames[0] in node.attributes)) { // 不能覆盖node.attributes的配置

      const nextNode = getNextTextOrLinkNodeByAncestors(node, ancestors)

      // 通过节点读取值暂时只处理一个参数
      const nextNode2AttrFunc = getObjConvertFunc(annoAlias[node.name], realRenderAnno, "beforeRender", "nextNode2Attr")
      if (nextNode && nextNode2AttrFunc) {
        nextNode2AttrFunc(node, ancestors, realAnnoRequiredArgNames, nextNode)
      }
    }
  }
 

  // @fix 按优先级覆盖配置
  // 配置属性优先级: node.attributes > (args > nextNode > prevNode) > annoAlias[node.name]['properties'] > 默认属性 
  node.attributes = node.attributes || {}
  if (isAliasAnno && annoAlias[node.name]['properties']) {   
    node.attributes = Object.assign({}, annoAlias[node.name]['properties'], node.attributes);
  }

  // 快捷键的属性进行矫正
  const realAnnoShortcutAttrs = realRenderAnno.realAnnoShortcutAttrs; // 真实注解专有, 别名注解使用无效
  if (realAnnoShortcutAttrs && realAnnoShortcutAttrs.length > 0) {
    realAnnoShortcutAttrs.forEach(shortcutAttr => {
      if (shortcutAttr in node.attributes && node.attributes[shortcutAttr] != 'false') {
        node.attributes[shortcutAttr] = true
      }       
    });
  }

  // 检测属性是否有缺失
  let loseAttrs = [] 
  if (realAnnoRequiredArgNames && realAnnoRequiredArgNames.length > 0) {
    loseAttrs = difference(realAnnoRequiredArgNames, Object.keys(node.attributes))
    if (loseAttrs && loseAttrs.length > 0) {
      if (!realAnnoShortcutAttrs || realAnnoShortcutAttrs.length === 0) { // 没有快捷属性的情况下存在属性缺失则不渲染
        console.log(`${node.name} 存在属性 ${loseAttrs.join(",")} 缺失!!`)
       
        return
      }
    }
  }

  // 开始渲染合法的标签, 实现已转换其他参数, 渲染仅根据属性node.attributes
  realRenderAnno.render(node, ancestors, realAnnoRequiredArgNames, realAnnoShortcutAttrs, loseAttrs);
}


















export function getNextTextOrLinkNodeByAncestors(node, ancestors) {
  return getNextNodeByAncestorsAndType(node, ancestors, ['text', 'link']);
}

export function getNextTextOrLinkNodeByLatestAncestors(node, latestAncestors) {
  return getNextNodeByLatestAncestorsAndType(node, latestAncestors, ['text', 'link']);
}

export function getNextNodeByAncestorsAndType(node, ancestors, typeArr) {
  let nextNode = null;

  const latestAncestors = ancestors[ancestors.length - 1];
  const hasEnoughChildren = latestAncestors.children && latestAncestors.children.length > 1; // 除指令外至少还有一个元素

  if (!hasEnoughChildren) {
    return nextNode;
  }

  nextNode = getNextNodeByLatestAncestorsAndType(node, latestAncestors, typeArr)
  return nextNode;
}


export function getNextNodeByLatestAncestorsAndType(node, latestAncestors, typeArr) {
  let nextNode = null;

  for (let idx in latestAncestors.children) {
    const item = latestAncestors.children[idx];
    idx = parseInt(idx);

    if (
      item.type === "textDirective" &&
      item === node 
    ) {
      let nextIdx = idx;

      while (++nextIdx < latestAncestors.children.length) {
        const tempNode = latestAncestors.children[nextIdx];


        if (tempNode 
          && (typeArr && typeArr.length > 0 ? typeArr : ['text', 'link']).includes(tempNode.type) 
          && trim(tempNode.value || tempNode.url) 
          && trim(tempNode.value || tempNode.url) != '->>') { // 空字符串不认为是后置结点
          nextNode = tempNode;
          break;
        }
      }
    }
  }
  
  return nextNode;
}



























export function getPrevTextOrLinkNodeByAncestors(node, ancestors) {
  return getPrevNodeByAncestorsAndType(node, ancestors, ['text', 'link']);
}


export function getPrevTextOrLinkNodeByLatestAncestors(node, latestAncestors) {
  return getPrevNodeByLatestAncestorsAndType(node, latestAncestors, ['text', 'link']);
}


export function getPrevNodeByAncestorsAndType(node, ancestors, typeArr) {
  let prevNode = null;

  const latestAncestors = ancestors[ancestors.length - 1];
  const hasEnoughChildren = latestAncestors.children && latestAncestors.children.length > 1; // 除指令外至少还有一个元素
  if (!hasEnoughChildren) {
    return prevNode;
  }

  prevNode = getPrevNodeByLatestAncestorsAndType(node, latestAncestors, typeArr)
  return prevNode;
}

export function getPrevNodeByLatestAncestorsAndType(node, latestAncestors, typeArr) {
  let prevNode = null;

  const hasEnoughChildren = latestAncestors.children && latestAncestors.children.length > 1; // 除指令外至少还有一个元素
  if (!hasEnoughChildren) {
    return prevNode;
  }
  
  for (let idx in latestAncestors.children) {
    const item = latestAncestors.children[idx];
    idx = parseInt(idx);

    if (
      item.type === "textDirective" &&
      item === node
    ) {
      let prevIdx = idx;
      
      while (--prevIdx > -1) {
        const tempNode = latestAncestors.children[prevIdx];

        
        if (tempNode 
          && (typeArr && typeArr.length > 0 ? typeArr : ['text', 'link']).includes(tempNode.type) 
          && trim(tempNode.value)
          && trim(tempNode.value || tempNode.url) != '->>') {
          prevNode = tempNode;
          break;
        }
      }

    }
  }

  return prevNode;
}



export function getObjConvertFunc(aliasAnno, realRenderAnno, convertKey, convertFuncKey) {
  if (aliasAnno && aliasAnno[convertKey] && aliasAnno[convertKey][convertFuncKey]) {
    return aliasAnno[convertKey][convertFuncKey]
  }

  if (realRenderAnno[convertKey] && realRenderAnno[convertKey][convertFuncKey]) {
    return realRenderAnno[convertKey][convertFuncKey]
  }

  return null
}

export function getAutoConvertConfig(aliasAnno, realRenderAnno, key) {
  if (aliasAnno && aliasAnno[key] != null) {
    return annoAlias[key]
  }

  if (realRenderAnno[key] != null) {
    return realRenderAnno[key]
  }

  return null
}


export function getNanoId() {
  return customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 8)()
}



export function containNextNode2Section(node, parentNode, grandNode) {
  let beginIdx = null
  let endIdx = null


  if (parentNode.type !== "heading") { // 只作用于heading类型
    return 
  }

  for (let idx in grandNode.children) {

    const item = grandNode.children[idx];
    idx = parseInt(idx);

    if (item === parentNode) {
      beginIdx = idx;
      break;
    }

  }


  if (beginIdx == null || beginIdx >= grandNode.children.length - 1) { // 没有后续元素, 直接结束
    return
  }

  for (let idx = beginIdx+1; idx < grandNode.children.length; idx++) {
    const item = grandNode.children[idx]

    if (item.type === "heading" || item.type === 'thematicBreak') {
      break
    }

    let isEnd = false
    if (item.type === "paragraph" && item.children && item.children.length > 0) {
      for(let key in item.children) {
        const itemm = item.children[key]
        if (itemm.type === "textDirective" && ['divider', 'hr'].includes(itemm.name)) {
          isEnd = true
          break
        }
      }
    }

    if (isEnd) {
      break
    }

    endIdx = idx
  }

  if (!endIdx || endIdx - beginIdx === 0) { // 后续元素也是heading类型, 直接结束
    return
  }

  console.log("begin: " + beginIdx)
  console.log("end: " + endIdx)

  return {
    beginIdx,
    endIdx
  }

}


export function getNextLineCodeNode(parentNode, grandNode) {
  let nodeLineCodeNodeIdx = null
  let nextLineCodeNode = null


  if (parentNode.type !== "list") { // 不要作用于heading类型
    return {}
  }

  for (let idx in grandNode.children) {

    const item = grandNode.children[idx];
    idx = parseInt(idx);

    if (item === parentNode) {
      nodeLineCodeNodeIdx = idx;
      break;
    }

  }


  if (nodeLineCodeNodeIdx == null || nodeLineCodeNodeIdx >= grandNode.children.length - 1) { // 没有后续元素, 直接结束
    return {}
  }


  const nextLineCodeIdx = nodeLineCodeNodeIdx+1
  if (!grandNode.children[nextLineCodeIdx] 
    || grandNode.children[nextLineCodeIdx].type !== 'code' 
    || !trim(grandNode.children[nextLineCodeIdx].value)) {
      return {}
  }

  nextLineCodeNode = grandNode.children[nextLineCodeIdx]

  return {nextLineCodeNode, nodeLineCodeNodeIdx}

}


// https://blog.csdn.net/JulyNight/article/details/119759694
export function getYearMonthDaysBetween(betweenStartDate, betweenEndDate) {
  let startDate = moment(betweenStartDate);
  let endDate = moment(betweenEndDate);
  
  let temp = null
  if (!startDate.isBefore(endDate)) {
    temp = startDate 
    startDate = endDate
    endDate = startDate
  }

  const allYearMonthDay = []; // 接收所有年份和月份的数组
  while (endDate.isSameOrAfter(startDate) && allYearMonthDay.length <= 31) {
    allYearMonthDay.push(startDate.format('YYYY-MM-DD'));
    startDate.add(1,'days');
  }


  return allYearMonthDay;
}
