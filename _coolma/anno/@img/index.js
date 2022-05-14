import { renderVoidElement } from "../../utils/utils";
import { h } from "hastscript";
import { trim } from "lodash";

export const emojiUrls = {
  xiong:
    "https://luo0412.oss-cn-hangzhou.aliyuncs.com/static/images/index/xiong.gif",
  cat:
    "https://luo0412.oss-cn-hangzhou.aliyuncs.com/1652243827370-DjxeEK7YYXXp.jpeg",
  dog:
    "https://luo0412.oss-cn-hangzhou.aliyuncs.com/1652249579841-Yty6cpQs34pj.jpeg",
  cool:
    "https://luo0412.oss-cn-hangzhou.aliyuncs.com/1652249708936-SYHxj43D8Ahf.jpeg",
  ichange:
    "https://luo0412.oss-cn-hangzhou.aliyuncs.com/1652249747826-TWzsbJWnaWZD.jpeg",
  tiger:
    "https://luo0412.oss-cn-hangzhou.aliyuncs.com/1652249821637-cT4N4NAhHzcX.jpeg",
  safe:
    "https://luo0412.oss-cn-hangzhou.aliyuncs.com/1652331256059-YZrGi3WX2BFS.jpeg",

  help:
    "https://luo0412.oss-cn-hangzhou.aliyuncs.com/1652332602412-By7AEtwwyKe4.jpeg",
  usejava:
    "https://luo0412.oss-cn-hangzhou.aliyuncs.com/1652332680187-rF5Xj86GGQTz.png",
};

export const urlRegex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\*\+,;=.]+$/

export default {
  namespace: "img",

  realAnnoRequiredArgNames: ["src"],
  realAnnoExtArgNames: null, // 补充字段, 数组形式, 非必填

  // 参数转换配置
  autoConvertArg2Attr: true,
  needConvertPrevNode2Attr: false, // 默认false, 配置true会优先向前读
  needConvertNextNode2Attr: true, 

  beforeRender: {
    
    nextNode2Attr: (node, ancestors, realAnnoRequiredArgNames, nextNode) => {
      let nextVal = trim(nextNode.value)

      // 判断后置节点内容是否为URL
      if (!urlRegex.test(nextVal)) {
          return
      }

      node.attributes[realAnnoRequiredArgNames[0]] = nextVal;
      renderVoidElement(nextNode); // 取值结束不再需要渲染后置节点
    },
  },

  realAnnoShortcutAttrs: Object.keys(emojiUrls),

  // @advice node.args映射至node.attributes的工作 请在beforeRender的函数内完成
  render: (
    node,
    ancestors,
    realAnnoRequiredArgNames,
    realAnnoShortcutAttrs,
    loseAttrs
  ) => {

    // 没有快捷属性匹配
    // const shortcutAttrMatch = intersection(realAnnoShortcutAttrs, node.attributes)
    if (
      loseAttrs &&
      loseAttrs.length > 0 &&
      realAnnoShortcutAttrs &&
      realAnnoShortcutAttrs.length > 0
    ) {
      // 需要补全缺失的属性

      for (let idx in realAnnoShortcutAttrs) {
        const shortcutAttr = realAnnoShortcutAttrs[idx];
        if (node.attributes[shortcutAttr] && emojiUrls[shortcutAttr]) {
          node.attributes[realAnnoRequiredArgNames[0]] =
            emojiUrls[shortcutAttr];
          break;
        }
      }

      // 仍然没有矫正属性则提前结束
      if (!node.attributes[realAnnoRequiredArgNames[0]]) {
        return;
      }
    }



    const imgSrc = node.attributes[realAnnoRequiredArgNames[0]]
    if (!imgSrc) {
      // renderVoidElement(node);
      return;
    }


    // 正常渲染
    const data = node.data || (node.data = {});
    const hast = h("img", {
      ...node.attributes,
      src: imgSrc,
    });

    data.hName = hast.tagName;
    data.hProperties = hast.properties;
    data.hChildren = hast.children;

  },


};
