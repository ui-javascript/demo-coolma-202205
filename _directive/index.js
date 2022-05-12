import Vue from "vue";
import VueCompositionApi, {
  onMounted,
  ref,
} from "@vue/composition-api";
import { watchDebounced, watchThrottled } from '@vueuse/core'


import { unified } from "unified";

import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeFormat from "rehype-format";
import rehypeStringify from "rehype-stringify";
import remarkDirective from "./utils/remarkDirective";


// import "@picocss/pico/css/pico.classless.min.css"
import "./style.less";

import { weatherApi } from "./anno/@fetch";

import { emojiUrls } from "./anno/@img";
import myRemarkPlugin from "./utils/myRemarkPlugin";

const content = `@fetch https://proapi.azurewebsites.net/github/issues`;

const content2 = `# 世界很大, 而我又是靓仔 @nice 

虽然说了句正确的废话 @del 

@dog @cat @tiger

@emoji{help} @emoji{java}
@emoji{safe} @emoji{ichange} 

@doc https://procomponents.ant.design/components/editable-table

@bvid BV1YT4y1Q7xx

@abbr(HTML, "Hyper Text Markup Language")

@weather
`

const content3 = `# 世界很大, 而我又是靓仔 @nice    

---

说点正确的废话 @del    

---

- 相关链接 
  - @code{docName = coolma演示} https://github.com/ui-javascript/demo-coolma-202205
  - @doc https://procomponents.ant.design/components/editable-table

---

@emoji{xiong}
@img ${emojiUrls.dog}
@img("${emojiUrls.cat}"){style: "width: 150px;"}
@emoji("${emojiUrls.cool}")
@emoji{src: "${emojiUrls.tiger}"}

---

A lovely language know as @abbr[namespace](HTML, "HTML的全称"){.red #id} @abbr(HTML, "HTML的全称"){.bg-blue.border-orange-lighter.border-solid}

---

@weather

@fetch("${weatherApi}"){includeKeys: '[*]'}

@fetch{weather}

@fetch{weather: true}

数组属性没有引号包裹, 注解直接摆烂, 原地显示 --> @fetch{weather: true, includeKeys: ['date']}

@fetch{weather: true, includeKeys: "['date']"}

@fetch{weather: false}



@fetchAliasWeather

@fetchAliasWeather{weather}

---

hello @nice
  
@nice hello

hello hi @nice @nice

hello hi *暂时跳过这种标签* @abbr(HTML, "HTML的全称"){.bg-blue} @nice @nice

hello @nice @nice hi

`




const App = {
  template: `
    <main class="container-fluid">
  
    <div class="grid">

      <textarea style="display: block;min-height: 350px" v-model="before"></textarea>
      <div v-html="after"></div>

    </div>
   
    </main>

  `,
  setup() {

    const before = ref("");
    const after = ref("");

    watchDebounced(before, async () => {
        const res = await unified()
        .use(remarkParse)
        .use(remarkDirective)
        .use(myRemarkPlugin)
        .use(remarkRehype)
        .use(rehypeFormat)
        .use(rehypeStringify)
        .process(before.value);

        console.log(String(res));
        after.value = String(res);
    }, { 
      debounce: 200, 
      maxWait: 1000
    });

    onMounted(() => {
      before.value = content
    })


    return {
      before,
      after,
      weatherApi,
      emojiUrls
    };
  },
};

Vue.use(VueCompositionApi);

Vue.config.productionTip = false;

new Vue({
  el: "#app",
  render: (h) => h(App),
});
