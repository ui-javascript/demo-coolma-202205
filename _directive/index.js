import Vue from "vue";
import VueCompositionApi, {
  onMounted,
  ref,
  watch,
  watchEffect
} from "@vue/composition-api";
import { watchDebounced, watchThrottled } from '@vueuse/core'



import { unified } from "unified";
import { visitParents } from "unist-util-visit-parents";

import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeFormat from "rehype-format";
import rehypeStringify from "rehype-stringify";
import remarkDirective from "./utils/remark-directive";

import registerAnnoMark from "./anno/@mark/@mark";
import registerAnnoAbbr from "./anno/@ref/@abbr";
import registerAnnoFetch from "./anno/@fetch/@fetch";

// import "@picocss/pico/css/pico.classless.min.css"
import "./style.less";

import { weatherApi } from "./anno/@fetch/@fetch";
import { initAliasMeta, registerAnno } from "./utils/utils";
import registerAliaWeather from "./anno/@fetch/alias/@weather"
import registerAliafetchAliasWeather from "./anno/@fetch/alias/@fetchAliasWeather"
import registerAnnoDel from "./anno/@mark/@del";
import registerAnnoImg, { emojiUrls} from "./anno/@doc/@img";
import registerAliaEmoji from "./anno/@doc/alias/@emoji";
import registerAnnoDoc from "./anno/@doc/@doc";
import registerAliaCode from "./anno/@doc/alias/@code";
import registerAliaDog from "./anno/@doc/alias/@dog";
import registerAliaCat from "./anno/@doc/alias/@cat";
import registerAliaTiger from "./anno/@doc/alias/@tiger";
import registerAliaNice from "./anno/@mark/alias/@nice";
import registerAliaBilibili from "./anno/@doc/alias/@bilibili";
import registerAliaBili from "./anno/@doc/alias/@bili";
import registerAnnoBvid from "./anno/@doc/@bvid";

const content = `# 世界很大, 而我又是靓仔 @nice 

虽然说了句正确的废话 @del 

@dog
@cat
@emoji{tiger}

@doc https://procomponents.ant.design/components/editable-table

@bvid BV1YT4y1Q7xx

@abbr(HTML, "Hyper Text Markup Language")

@weather
`

const content2 = `# 世界很大, 而我又是靓仔 @nice    

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

import alias from "./alias.json"

import aliasModules from "./anno/**/alias/@*js";
import annoModules from "./anno/@*/@*js";

function myRemarkPlugin() {
  const annoAlias = {}

  // 获取
  Object.keys(aliasModules).forEach((key) => {
    aliasModules[key].default(annoAlias)
  });

  // 获取JSON配置文件
  Object.keys(alias).forEach((key) => {
    initAliasMeta(annoAlias, alias[key].attachAnno, key, alias[key].properties)
  });


  return (tree) => {

    visitParents(tree, "textDirective", (node, ancestors) => {

      Object.keys(annoModules).forEach((key) => {
        registerAnno(annoModules[key].default.name, annoAlias, node, ancestors, annoModules[key].default)
      });
      
    });

  };
}


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
