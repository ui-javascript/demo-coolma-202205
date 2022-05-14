import { renderVoidElement } from "../../utils/utils";
import { h } from "hastscript";
import { trim } from "lodash";
import Vue from "vue";
import { nanoid } from "nanoid";
import { nextTick } from "@vue/composition-api";

export default {
  namespace: 'rate',

  realAnnoRequiredArgNames: ['star'],
  realAnnoExtArgNames: ['tip'], // 补充字段, 数组形式, 非必填
  autoConvertArg2Attr: true,
  
  realAnnoShortcutAttrs: null,
  
  beforeRender: {
    args2Attr: (node, ancestors) => {},

    nextNode2Attr: (node, ancestors, realAnnoRequiredArgNames, nextNode) => {
        node.attributes[realAnnoRequiredArgNames[0]] = trim(nextNode.value)
        renderVoidElement(nextNode) // 取值结束不再需要渲染后置节点
    }
  },

  // @advice node.args映射至node.attributes的工作 请在beforeRender的函数内完成
  render: (node, ancestors, realAnnoRequiredArgNames, realAnnoShortcutAttrs, loseAttrs)  => {
   
    const rateId = nanoid();
    const data = node.data || (node.data = {});
    const hast = h(`div`, {
      style: "display: inline-block"
    }, [
      h('span', {
        style: "color: #ff9900"
      }, node.attributes.tip ? node.attributes.tip : ''),    
      h(`span#${rateId}`, {...node.attributes}, '')
    ]);

    data.hName = hast.tagName;
    data.hProperties = hast.properties;
    data.hChildren = hast.children;

    var Rate = Vue.extend({
      template: `<el-rate
      v-model="value"
      disabled
      show-score
      text-color="#ff9900"
      score-template="{value}">
    </el-rate>`,
      data: function () {
        return {
          value: node.attributes[realAnnoRequiredArgNames[0]],
        }
      }
    })


    // @todo 待优化 div好像没有onload方法
    const timer = setTimeout(() => {
      const rate = document.getElementById(rateId)
      if (rate) {
        // 创建 Profile 实例，并挂载到一个元素上。
        new Rate().$mount(`#${rateId}`)
      } else {
        timer()
      }
    }, 100)

  }

};
