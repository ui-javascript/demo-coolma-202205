import { getNanoId, renderVoidElement } from "../../utils/utils";
import { h } from "hastscript";
import { trim } from "lodash";
import Vue from "vue";
import { nanoid } from "nanoid";
import { nextTick } from "@vue/composition-api";

export default {
  namespace: 'tag',

  realAnnoRequiredArgNames: ['name'],
  realAnnoExtArgNames: ['type', 't'], // 补充字段, 数组形式, 非必填
  realAnnoShortcutAttrs: null,
  
  // 参数转换配置
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
  render: (node, ancestors, realAnnoRequiredArgNames, realAnnoShortcutAttrs, loseAttrs)  => {
   
    const tagId = getNanoId()
    const data = node.data || (node.data = {});
    const hast = h(`div`, {
      style: "display: inline-block"
    }, [  
      h(`span#${tagId}`, {...node.attributes}, '')
    ]);

    data.hName = hast.tagName;
    data.hProperties = hast.properties;
    data.hChildren = hast.children;

    var Tag = Vue.extend({
      template: `<el-tag :type="type">{{value}}</el-tag>`,
      data: function () {
        return {
          type: node.attributes.type || node.attributes.t || "",
          value: node.attributes[realAnnoRequiredArgNames[0]],
        }
      }
    })


    //  div好像没有onload方法
    let retryTimes = 0 
    function renderTimer() {
      const tag = document.getElementById(tagId)
      if (tag) {
        
        new Tag().$mount(`#${tagId}`)
      } else {
        retryTimes++
        console.log(node.name + "重试" + retryTimes + "次")
        setTimeout(() => {
           retryTimes < 3 && renderTimer()
        }, 200)
      }
    }

    renderTimer()

  }

};
