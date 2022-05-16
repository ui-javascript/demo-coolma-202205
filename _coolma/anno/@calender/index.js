import { getMonthBetween, getNanoId, getNextLineCodeNode, getNextNodeByAncestorAndType, getNextTextOrLinkNodeByAncestors, renderVoidElement } from "../../utils/utils";
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
   

    if (ancestors.length < 2) {
      return 
    }

    const parentNode = ancestors[ancestors.length - 1];
    const grandNode = ancestors[ancestors.length - 2];
    const nextLineCodeNode = getNextLineCodeNode(parentNode, grandNode)

    if (!nextLineCodeNode) {
      return 
    }

    const dateContentArr = nextLineCodeNode.value.split("\n").filter(item => item.indexOf(":") > -1 || item.indexOf("：") > -1)
    if (!dateContentArr) {
      return
    }

    let dateMap = {}
    dateContentArr.forEach(item => {
      let sliceIndex = null 
      if (item.indexOf("：") > -1) {
        sliceIndex = item.indexOf("：") 
      } else {
        sliceIndex = item.indexOf(":") 
      }

      const date = trim(item.slice(0, sliceIndex))
      const content = trim(item.slice(sliceIndex+1, item.length))

      if (date.includes("~")) {
        const betweenDateArr = date.split("~")
        if (betweenDateArr.length === 2) {
          if (moment(betweenDateArr[0]).isValid() && moment(betweenDateArr[1]).isValid()) {
            const between = getMonthBetween(betweenDateArr[0], betweenDateArr[1])
            between.forEach(itemm => dateMap[itemm] = content)
          }
        }
   
      
      } else {
        if (moment(date).isValid()) {
          dateMap[moment(date).format("YYYY-MM-DD")] = content
        }
      }
      

    })


    const dateArr = Object.keys(dateMap).sort()
    if (!dateArr || dateArr.length === 0) {
      return
    }

    renderVoidElement(nextLineCodeNode)
    

    let dateStart = moment(dateArr[0]).startOf('week').add(1, "days").format('YYYY-MM-DD') // 周日+1, 该周中的第一天+1
    let dateEnd = moment(dateStart).add(7*4-1, 'days').format('YYYY-MM-DD')
    let dateRange = [dateStart, dateEnd]


    const calendarId = getNanoId()
    const data = node.data || (node.data = {});
    const hast = h(`div#${calendarId}`, {
      style: "display: inline-block"
    }, []);

    data.hName = hast.tagName;
    data.hProperties = hast.properties;
    data.hChildren = hast.children;

    dateMap = Object.assign({}, node.attributes, dateMap)


    var Calendar = Vue.extend({
      template: `<el-calendar :range='dateRange'>
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
