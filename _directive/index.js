import Vue from "vue";
import VueCompositionApi, {
  ref,
  watch,
  watchEffect
} from "@vue/composition-api";

import { unified } from "unified";
import { visitParents } from "unist-util-visit-parents";

import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeFormat from "rehype-format";
import rehypeStringify from "rehype-stringify";
import remarkDirective from "./utils/remark-directive";

import registerAnnoNice from "./anno/@nice";
import registerAnnoAbbr from "./anno/@abbr";
import registerAnnoFetch from "./anno/@fetch";

// import "@picocss/pico/css/pico.classless.min.css"
import "./style.less";

import { weatherApi } from "./anno/@fetch";
import { registerAnno } from "./utils/utils";
import registerAliaWeather from "./alias/@weather"
import registerAliafetchAliasWeather from "./alias/@fetchAliasWeather"
import registerAnnoDel from "./anno/@del";
import registerAnnoImg, { emojiUrls} from "./anno/@img";
import registerAliaEmoji from "./alias/@emoji";
import registerAnnoDoc from "./anno/@doc";
import registerAliaCode from "./alias/@code";

function myRemarkPlugin() {
  const annoAlias = {}

  registerAliaWeather(annoAlias)
  registerAliafetchAliasWeather(annoAlias)
  registerAliaEmoji(annoAlias)
  registerAliaCode(annoAlias)

  return (tree) => {

    visitParents(tree, "textDirective", (node, ancestors) => {
      // 注册@abbr
      registerAnno('abbr', annoAlias, node, ancestors, registerAnnoAbbr);

      // 判断祖先元素
      if (!ancestors || ancestors.length === 0) {
        return;
      }

      registerAnno('nice', annoAlias, node, ancestors, registerAnnoNice);
      registerAnno('img', annoAlias, node, ancestors, registerAnnoImg);
      registerAnno('doc', annoAlias, node, ancestors, registerAnnoDoc);
      registerAnno('del', annoAlias, node, ancestors, registerAnnoDel);
      registerAnno('fetch', annoAlias, node, ancestors, registerAnnoFetch)
      
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
    const before = ref(`# 世界很大, 而我又是靓仔 @nice    

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

`);

    const after = ref("");

    watchEffect(async () => {
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
    });

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
