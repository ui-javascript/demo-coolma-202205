import { getNanoId, getNextLineCodeNode, getNextNodeByAncestorAndType, getNextTextOrLinkNodeByAncestors, renderVoidElement } from "../../utils/utils";
import { h } from "hastscript";
import { trim } from "lodash";
import Vue from "vue";
import { nanoid } from "nanoid";
import { nextTick } from "@vue/composition-api";
import moment from "moment";

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
   
    debugger

    if (ancestors.length < 2) {
      return 
    }

    const parentNode = ancestors[ancestors.length - 1];
    const grandNode = ancestors[ancestors.length - 2];
    const nextLineCodeNode = getNextLineCodeNode(parentNode, grandNode)

    debugger
    if (!nextLineCodeNode) {
      return 
    }

    const dateContentArr = nextLineCodeNode.value.split("\n").filter(item => item.indexOf(":") > -1 || item.indexOf("：") > -1 || item.indexOf(" ") > -1)
    if (!dateContentArr) {
      return
    }

    debugger
    let dateMap = {}
    dateContentArr.forEach(item => {
      let sliceIndex = null 
      if (item.indexOf(": ") > -1) {
        sliceIndex = item.indexOf(": ") 
      } else if(item.indexOf("： ") > -1) {
        sliceIndex = item.indexOf("： ") 
      } else if (item.indexOf(" ") > -1) {
        sliceIndex = item.indexOf(" ") 
      } else if (item.indexOf("：") > -1) {
        sliceIndex = item.indexOf("：") 
      } else {
        sliceIndex = item.indexOf(":") 
      }

      const date = trim(item.slice(0, sliceIndex))
      const content = trim(item.slice(sliceIndex+1, item.length))
      

      if (moment(date).isValid()) {
        dateMap[moment(date).format("YYYY-MM-DD")] = content
      }

    })

    debugger

    const dateArr = Object.keys(dateMap).sort()
    if (!dateArr || dateArr.length === 0) {
      return
    }

    renderVoidElement(nextLineCodeNode)
    

    let weekOfday = parseInt(moment(dateArr[0]).format('d')) // 计算今天是这周第几天 
    let dateStart = moment(dateArr[0]).subtract(weekOfday, 'days').format('YYYY-MM-DD') // 周日, 一周中的第一天
    let dateEnd = moment(dateArr[0]).add(1, 'months').format('YYYY-MM-DD') // 下个月的第一周
    let dateRange = [dateStart, dateEnd]

    debugger

    const calendarId = getNanoId()
    const data = node.data || (node.data = {});
    const hast = h(`div#${calendarId}`, {
      style: "display: inline-block"
    }, []);

    data.hName = hast.tagName;
    data.hProperties = hast.properties;
    data.hChildren = hast.children;

    dateMap = Object.assign({}, node.attributes, dateMap)


    debugger
    var Calendar = Vue.extend({
      template: `<el-calendar :range='["2019-03-04", "2019-04-07"]'>
      <template
        slot="dateCell"
        slot-scope="{date, data}">
        <img v-if="dateMap[data.day] && urlRegex.test(dateMap[data.day])" 
          style="max-width: 100%;max-height: 100%;" 
          :src="dateMap[data.day]" />
        <span v-else :data-tooltip="dateMap[data.day]" class="inline-block">
        {{ (dateMap[data.day] 
            ? (dateMap[data.day].length > 10 ? (dateMap[data.day].slice(0, 9) + "...") : dateMap[data.day])
            : data.day) }}
        </div>
        
          
      </template>
    </el-calendar>`,
      data: function () {
        return {
          urlRegex: /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\*\+,;=.]+$/,
          dateRange: dateRange,
          dateMap: dateMap,
        }
      }
    })

    //  div好像没有onload方法
    let retryTimes = 0 
    function renderTimer() {
      const canlendar = document.getElementById(calendarId)
      if (canlendar) {
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
