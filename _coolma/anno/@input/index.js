import { getNanoId, renderVoidElement } from "../../utils/utils";
import { h } from "hastscript";
import { trim } from "lodash";
import Vue from "vue";
import { nanoid } from "nanoid";
import { nextTick } from "@vue/composition-api";

export default {
  namespace: 'input',

  realAnnoRequiredArgNames: ['name'],
  realAnnoExtArgNames: ['placeholder', 'defaultValue', 'prepend', 'append', 'icon'], // 补充字段, 数组形式, 非必填
  realAnnoShortcutAttrs: null,
  
  // 参数转换配置
  autoConvertArg2Attr: true,
  needConvertPrevNode2Attr: false, // 默认false, 配置true会优先向前读
  needConvertNextNode2Attr: false, 


  beforeRender: {
    // prevNode2Attr: (node, ancestors, realAnnoRequiredArgNames, prevNode) => {
    //   node.attributes.prepend = trim(prevNode.value)
    //   renderVoidElement(prevNode) // 取值结束不再需要渲染后置节点
    // },
    // nextNode2Attr: (node, ancestors, realAnnoRequiredArgNames, nextNode) => {
    //   node.attributes.append = trim(nextNode.value)
    //   renderVoidElement(nextNode) // 取值结束不再需要渲染后置节点
    // }
  },

  // @advice node.args映射至node.attributes的工作 请在beforeRender的函数内完成
  render: (node, ancestors, realAnnoRequiredArgNames, realAnnoShortcutAttrs, loseAttrs)  => {
   
    const inputId = getNanoId()
    const data = node.data || (node.data = {});
    const hast = h(`span`, {
      style: "display: inline-block",
      ...node.attributes
    }, [  
      h(`span#${inputId}`, {...node.attributes}, '')
    ]);

    data.hName = hast.tagName;
    data.hProperties = hast.properties;
    data.hChildren = hast.children;

    var Input = Vue.extend({
      template: `<el-input v-model="name" :placeholder="placeholder">
        <el-button v-if="icon" slot="append" :icon="'el-icon-' + icon" @click="$message.success('可交互脚本绑定数值: ' + JSON.stringify(window.__COOLMA__))"></el-button>
      </el-input>`,
      data: function () {
        return {
          icon: node.attributes.icon,
          // prepend: node.attributes.prepend,
          // append: node.attributes.append,
          placeholder: node.attributes.placeholder,
          name: node.attributes.value || node.attributes.defaultValue,
        }
      },
      mounted() {
        window.__COOLMA__ = window.__COOLMA__ || {}
        window.__COOLMA__[node.attributes.name] = this.name
      },
      watch: {
        name: (val) => {
          window.__COOLMA__ = window.__COOLMA__ || {}
          window.__COOLMA__[node.attributes.name] = val
          // console.log(window.__COOLMA__)
        } 
      }
    })


    //  div好像没有onload方法
    let retryTimes = 0 
    function renderTimer() {
      const input = document.getElementById(inputId)
      if (input) {
        
        new Input().$mount(`#${inputId}`)
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
