import Vue from "vue";
import VueCompositionApi, {
  onMounted,
  ref,
} from "@vue/composition-api";
import { watchDebounced, watchThrottled } from '@vueuse/core'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';


// import "@picocss/pico/css/pico.classless.min.css"
import "./style.less";


import unifiedParser from "./utils/unifiedParserUtil";

// const content = `@until('20220513')`

// const content1 = `

// @img(https://luo0412.oss-cn-hangzhou.aliyuncs.com/static/images/index/xiong.gif) @nice
// @img https://luo0412.oss-cn-hangzhou.aliyuncs.com/static/images/index/xiong.gif

// `;


const content = `#### 世界很大, 而我又是靓仔 @nice @rate(4.7) 

恭喜, 颜值认证成功! @success

虽然说了句正确的废话  @del 

@dog @cat @tiger

@doc https://procomponents.ant.design/components/editable-table @hot 20221223 

@until(22120309){tip: '📣新发布', createDate: '20211212'}

@bvid BV1YT4y1Q7xx

@abbr(HTML, "Hyper Text Markup Language") 

@weather

@emoji{help} @emoji{java}

\`\`\`
@emoji{safe} 
@emoji{ichange} 
\`\`\`


@divider{title: 我是一条分割线}

@backtop
`

const content3 = `# 世界很大, 而我又是靓仔 @nice    

---

说点正确的废话 @del    

---

- 相关链接 
  - @code{title = coolma演示} https://github.com/ui-javascript/demo-coolma-202205
  - @doc https://procomponents.ant.design/components/editable-table

---

A lovely language know as @abbr[namespace](HTML, "HTML的全称"){.red #id} @abbr(HTML, "HTML的全称"){.bg-blue.border-orange-lighter.border-solid}

---

@weather

@fetch{weather}

@fetch{weather: true}

数组属性没有引号包裹, 注解直接摆烂, 原地显示 --> @fetch{weather: true, includeKeys: ['date']}

@fetch{weather: true, includeKeys: "['date']"}

@fetch{weather: false}

---

hello @nice
  
@nice hello

hello hi @nice @nice

hello hi *暂时跳过这种标签* @abbr(HTML, "HTML的全称"){.bg-blue} @nice @nice

hello @nice @nice hi

hello @nice test *em* @nice ssss *em* sss @nice xxx
`


const App = {
  template: `

    <main class="container-fluid">

  
    <div class="grid">

      <textarea style="display: block;min-height: 350px" v-model="before"></textarea>

      <div v-html="after" />  
  
    </div>

   
    </main>

  `,
  // @tofix @todo 本来想采用这种方法渲染elementui组件
  // https://blog.csdn.net/weixin_40057800/article/details/90316624
  // 但是这里一旦console.log(this.html)的字符串值就会罢工
  // 不知道是不是chrome或者vue某个版本的bug, 换了个比较low的方法先渲染
  // components: {
  //   'coolma': {
  //     props: {
  //       html: String
  //     },
  //     render: (h, data) => {

  //       // window.$HTML = this.html

  //       // const component = Vue.extend({
  //       //   template: `<div>${this.html}</div>`,
  //       // })

  //       return h('div', {
  //         innerHTML: this.html
  //       })

  //     }
  //   }
  // },
  setup() {

    const before = ref("");
    const after = ref("");
  
    watchDebounced(before, async () => {
        const res = await unifiedParser(before.value);
        after.value = String(res);
    }, { 
      debounce: 500, 
      maxWait: 1000
    });

    onMounted(() => {
      before.value = content
    })

    return {
      before,
      after,
    };
  },
};

Vue.use(VueCompositionApi);
Vue.use(ElementUI); // 改用CDN

Vue.config.productionTip = false;

new Vue({
  el: "#app",
  render: (h) => h(App),
});
