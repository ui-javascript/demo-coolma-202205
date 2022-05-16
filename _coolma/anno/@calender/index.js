import { getNanoId, getNextNodeByAncestorAndType, getNextTextOrLinkNodeByAncestors, renderVoidElement } from "../../utils/utils";
import { h } from "hastscript";
import { trim } from "lodash";
import Vue from "vue";
import { nanoid } from "nanoid";
import { nextTick } from "@vue/composition-api";

export default {
  namespace: 'calendar',

  realAnnoRequiredArgNames: null,
  realAnnoExtArgNames: null, // 补充字段, 数组形式, 非必填
  realAnnoShortcutAttrs: null,
  
  // 参数转换配置
  autoConvertArg2Attr: true,
  needConvertPrevNode2Attr: false, // 默认false, 配置true会优先向前读
  needConvertNextNode2Attr: false, 

  beforeRender: {

  },

  // @advice node.args映射至node.attributes的工作 请在beforeRender的函数内完成
  render: (node, ancestors, realAnnoRequiredArgNames, realAnnoShortcutAttrs, loseAttrs)  => {
   
    const nextNode = getNextNodeByAncestorAndType(node, ancestors, ["code"]);
    if (!nextNode) {
      return
    }

    debugger

    const dateContentArr = nextNode.value.split("\n").filter(item => item.indexOf(":") > -1 || item.indexOf(" "))
    if (!dateContentArr) {
      return
    }

    const calendarId = getNanoId()
    const data = node.data || (node.data = {});
    const hast = h(`div#${calendarId}`, {
      style: "display: inline-block"
    }, []);

    data.hName = hast.tagName;
    data.hProperties = hast.properties;
    data.hChildren = hast.children;


    // https://luo0412.oss-cn-hangzhou.aliyuncs.com/1652702732678-chFXTAdwZi6K.jpeg
    var Calendar = Vue.extend({
      template: `<el-calendar :range="['2019-03-04', '2019-04-07']">
      <template
        slot="dateCell"
        slot-scope="{date, data}">

        <img v-if="dateMap[data.day] && urlRegex.test(dateMap[data.day])" 
          style="max-width: 100%;max-height: 100%;" 
          :src="dateMap[data.day]" />

        <span v-else class="inline-block">
        {{ dateMap[data.day] || data.day }}
        </div>
        
          
      </template>
    </el-calendar>`,
      data: function () {
        return {
          urlRegex: /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\*\+,;=.]+$/,
          dateMap: {
            "2019-03-04": "https://luo0412.oss-cn-hangzhou.aliyuncs.com/1652701995280-d2mdQGB4HSYm.png",
            "2019-03-05": "https://luo0412.oss-cn-hangzhou.aliyuncs.com/1652702732678-chFXTAdwZi6K.jpeg",
            "2019-03-06": "团购买菜"
          },
        }
      }
    })


    //  div好像没有onload方法
    let retryTimes = 0 
    function renderTimer() {
      const rate = document.getElementById(calendarId)
      if (rate) {
        try {
          // 创建 Profile 实例，并挂载到一个元素上。
          new Calendar().$mount(`#${calendarId}`)
        } catch (error) {
          console.log(error)
        }
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
