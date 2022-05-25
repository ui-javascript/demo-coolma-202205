import { getNanoId, renderVoidElement } from "../../utils/utils";
import { h } from "hastscript";
import { trim } from "lodash";
import Vue from "vue";
import { nanoid } from "nanoid";

export default {
  namespace: 'backtop',

  realAnnoRequiredArgNames: null,
  realAnnoExtArgNames: null, // 补充字段, 数组形式, 非必填  
  realAnnoShortcutAttrs: null,

  // 自动转换配置
  autoConvertArg2Attr: true,
  needConvertPrevNode2Attr: false,
  needConvertNextNode2Attr: false,
  
  beforeRender: {
    
  },

  // @advice node.args映射至node.attributes的工作 请在beforeRender的函数内完成
  render: (node, ancestors, realAnnoRequiredArgNames, realAnnoShortcutAttrs, loseAttrs)  => {
   
    const backtopId = getNanoId()
    const data = node.data || (node.data = {});
    const hast = h(`div#${backtopId}`, {})
    

    data.hName = hast.tagName;
    data.hProperties = hast.properties;
    data.hChildren = hast.children;

    var Backtop = Vue.extend({
      template: `<el-backtop target=".container-fluid" :bottom="200">
      <div
        style="{
          height: 100%;
          width: 100%;
          background-color: #f2f5f6;
          box-shadow: 0 0 6px rgba(0,0,0, .12);
          text-align: center;
          line-height: 40px;
          color: #1989fa;
        }"
      >
        返回顶部
      </div>
    </el-backtop>`,
      data: function () {
        return {
          // value: node.attributes[realAnnoRequiredArgNames[0]],
        }
      }
    })

    //  div好像没有onload方法
    let retryTimes = 0 
    function renderTimer() {

      const backtop = document.getElementById(backtopId)
      if (backtop) {
        console.log('backtop '+backtopId)
        
        new Backtop().$mount(`#${backtopId}`)
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
