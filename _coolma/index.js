import Vue from "vue";
import VueCompositionApi, {
  onMounted,
  ref,
} from "@vue/composition-api";
import { useUrlSearchParams, watchDebounced, watchThrottled } from '@vueuse/core'

// import ElementUI from 'element-ui';
// import 'element-ui/lib/theme-chalk/index.css';


// import "@picocss/pico/css/pico.classless.min.css"
import "./style.less";


import unifiedParser from "./utils/unifiedParserUtil";

// const content = `@until('20220513')`

// const content = `
// # heading @section

// - test1

// \`\`\`
// sth
// \`\`\`

// - test2

// # asdasd


// `;


const params = useUrlSearchParams('hash')
const isVsCode = params.isVsCode 
console.log(isVsCode)



const content = `## 世界很大, 而我又是靓仔 @nice @rate 4.7

恭喜, 颜值认证成功! @success

虽然说了句正确的废话  @del 

@dog{.mask.mask-squircle} 
@cat{.mask.mask-heart}
@tiger{.mask.mask-circle} 

@doc https://procomponents.ant.design/components/editable-table  @hot 20221223 

@until(22120309){t: '📣新发布', c: '20211212'}

@bvid BV1YT4y1Q7xx

@abbr(HTML, "Hyper Text Markup Language") 

@weather


# 普通卡片 @card

@building 0.5

\`\`\`js
import rehype from 'rehype'
import rehypePrism from 'rehype-prism-plus'

rehype().use(rehypePrism).process(/* some html */)
\`\`\`

@hr{t: 我是一条分割线}

# 卡片折叠 @card @sub 

- 星辰大海改天再去 @todo
    - 仰望远古星空
    - 照顾历代星辰

# 折叠卡片 @sub @card 

@emoji{help} 

@emoji{usejava}


# 无关卡片(直接忽略)  @other

@emoji{safe} 
@emoji{ichange} 

---

# 参考 @ref

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
    <div class="grid p-2">
      <textarea v-if="isVsCode !== 'true'" class="textarea textarea-info inline-block" style="min-height: 500px" v-model="before"></textarea>
      <div class="pl-2 pr-2" v-html="after" />  
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
      console.log(String(res))
      after.value = String(res);
    }, { 
      debounce: 50, 
      maxWait: 300
    });


    onMounted(() => {
      before.value = (isVsCode === 'true') ? window.$CONTENT : content
    })

    return {
      before,
      after,
      isVsCode
    };
  },
};


Vue.use(VueCompositionApi);
// Vue.use(ElementUI); // 改用CDN

Vue.config.productionTip = false;


// 插件初始化
function init (event) {
  
  console.log(event)

  if (event.data.cmd === "mountApp") {
    window.$CONTENT = event.data.data; // MD内容
    window.$MDPATH = event.data.mdPath; // MD路径

    window.$VUE = new Vue({
        render: h => h(App),
    }).$mount('#app');
  
  }

  if (event.data.cmd === "mdSync") {
    window.$CONTENT = event.data.data; // MD内容
    window.$MDPATH = event.data.mdPath; // MD路径

    if (window.$VUE) {
      window.$VUE.$children[0].before = window.$CONTENT
    } 
  
  }
  
};



if (isVsCode !== 'true') {
  window.$VUE = new Vue({
    el: "#app",
    render: (h) => h(App),
  });

} else {  // 插件模式
  window.addEventListener("message", init, false);
}



