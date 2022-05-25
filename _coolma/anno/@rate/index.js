import { getNanoId, renderVoidElement } from "../../utils/utils";
import { h } from "hastscript";
import { trim } from "lodash";
import Vue from "vue";
import { nanoid } from "nanoid";
import { nextTick } from "@vue/composition-api";

export default {
  namespace: 'rate',

  realAnnoRequiredArgNames: ['star'],
  realAnnoExtArgNames: null, // 补充字段, 数组形式, 非必填
  realAnnoShortcutAttrs: null,
  
  // 参数转换配置
  autoConvertArg2Attr: true,
  needConvertPrevNode2Attr: false, // 默认false, 配置true会优先向前读
  needConvertNextNode2Attr: true, 


  beforeRender: {
    nextNode2Attr: (node, ancestors, realAnnoRequiredArgNames, nextNode) => {
        node.attributes[realAnnoRequiredArgNames[0]] = trim(nextNode.value)
        renderVoidElement(nextNode) // 取值结束不再需要渲染后置节点
    }
  },

  // @advice node.args映射至node.attributes的工作 请在beforeRender的函数内完成
  render: (node, ancestors, realAnnoRequiredArgNames, realAnnoShortcutAttrs, loseAttrs)  => {
   
    const rateId = getNanoId()
    const data = node.data || (node.data = {});
    const hast = h(`div`, {
      style: "display: inline-block"
    }, [  
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
          value: parseFloat(node.attributes[realAnnoRequiredArgNames[0]]),
        }
      }
    })


    //  div好像没有onload方法
    let retryTimes = 0 
    function renderTimer() {
      const rate = document.getElementById(rateId)
      if (rate) {
        
        new Rate().$mount(`#${rateId}`)
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
