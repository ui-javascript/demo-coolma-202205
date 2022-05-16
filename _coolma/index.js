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

const params = useUrlSearchParams('hash')
const isVsCode = params.isVsCode 
console.log(isVsCode)

// const content = `@calendar`


const content = `# 世界很大, 而我又是靓仔 @nice @rate 4.7

@emoji{xiong}

> 真正被爱的时候不用多好看 @by 孟加拉巨蜥

恭喜, 颜值认证成功! @success

虽然说了句正确的废话  @del  

@dog{.mask.mask-squircle} 
@cat{.mask.mask-heart}
@tiger{.mask.mask-circle} 

@abbr(HTML, "Hyper Text Markup Language") 
@doc https://procomponents.ant.design/components/editable-table  @hot 20221223 
@until(22120309){t: '📣新发布', c: '20211212'}

@bvid BV1YT4y1Q7xx

@building 0.1

---

# 北京一周天气


@weather

---

# 上海核酸日记

@calendar

---

# 卡片被折叠 @card @sub 

- [ ] 星辰大海, 改日再去 @todo
    - [x] 仰望远古星空
    - [ ] 照顾历代星辰

---

# 可折叠卡片 @sub @card 

@emoji{help} 

@emoji{usejava}

\`\`\`js
import rehype from 'rehype'
import rehypePrism from 'rehype-prism-plus'

rehype().use(rehypePrism).process(/* some html */)
\`\`\`


# 无关内容(直接忽略)  @ignore

@emoji{safe} 
@emoji{ichange} 

---

# 参考 @ref

@backtop
`

const App = {
  template: `
  <main class="container-fluid">
    <nav>
      <button v-show="isVsCode !== 'true' && editable === true" @click="editable = false">隐藏编辑框</button>
      <button v-show="isVsCode !== 'true' && editable === false" @click="editable = true">显示编辑框</button>
    </nav>
    <div class="grid p-2">
      <textarea v-if="isVsCode !== 'true' && editable" class="textarea textarea-info inline-block" style="min-height: 500px" v-model="before"></textarea>
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

  //       return h(component, {
  //         innerHTML: this.html
  //       })

  //     }
  //   }
  // },
  setup() {

    const before = ref("");
    const after = ref("");
    const editable = ref(true);
 
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
      isVsCode,
      editable
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
