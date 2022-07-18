import { getNextTextOrLinkNodeByLatestAncestor, getNextNodeByAncestor, renderVoidElement, getPrevTextOrLinkNodeByAncestors, getPrevTextOrLinkNodeByLatestAncestors, getNanoId } from "../../utils/utils";
import { h } from "hastscript";
import { trim } from "lodash";
import { customAlphabet, nanoid } from "nanoid";
import Vue from "vue";
// import ChatBubble from "../../components/ChatBubble"

// https://codepen.io/Luo0412/pen/gOegQgp
export default {
  namespace: "bubble",

  realAnnoRequiredArgNames: ['content'], // 不需要参数
  realAnnoExtArgNames: ['direction'], // 补充字段, 数组形式, 非必填
  realAnnoShortcutAttrs: ['d'],

  // 自动转换配置
  autoConvertArg2Attr: true,
  needConvertPrevNode2Attr: true, // 默认false, 配置true会优先向前读
  needConvertNextNode2Attr: true, 

  beforeRender: {
  
    prevNode2Attr: (node, ancestors, realAnnoRequiredArgNames, prevNode) => {
      node.attributes[realAnnoRequiredArgNames[0]] = trim(prevNode.value)
      renderVoidElement(prevNode) // 取值结束不再需要渲染后置节点
    },
    nextNode2Attr: (node, ancestors, realAnnoRequiredArgNames, nextNode) => {
      node.attributes[realAnnoRequiredArgNames[0]] = trim(nextNode.value)
      renderVoidElement(nextNode) // 取值结束不再需要渲染后置节点
    }
  },

  // @advice node.args映射至node.attributes的工作 请在beforeRender的函数内完成
  render: (node, ancestors, realAnnoRequiredArgNames, realAnnoShortcutAttrs, loseAttrs) => {

    if (!node.attributes['direction']) {
      node.attributes['direction'] = node.attributes['d']
    }
  
    var ChatBubble = Vue.extend({
      template: `<chat-bubble
      content="${node.attributes[realAnnoRequiredArgNames[0]]}"
      direction=${node.attributes['direction'] || 'left'}>
    </el-alert>`,
      // components: {
      //   ChatBubble
      // },
      data: function () {
        return {
          value: node.attributes[realAnnoRequiredArgNames[0]],
        }
      }
    })

    const chatBubbleId = getNanoId()
    const data = node.data || (node.data = {});
    const hast = h(`div#${chatBubbleId}`, { ...node.attributes })

    data.hName = hast.tagName;
    data.hProperties = hast.properties;
    data.hChildren = hast.children;
    // data.value = null

    //  div好像没有onload方法
    let retryTimes = 0 
    function renderTimer() {

      const chatBubble = document.getElementById(chatBubbleId)
      if (chatBubble) {

        new ChatBubble().$mount(`#${chatBubbleId}`)

      } else {
        retryTimes++
        console.log(node.name + "重试" + retryTimes + "次")
        setTimeout(() => {
           retryTimes < 3 && renderTimer()
        }, 200)
      }
    }

    renderTimer()


 

  },
};
