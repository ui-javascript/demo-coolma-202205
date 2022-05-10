import Vue from "vue";
import VueCompositionApi, {
  ref,
  watchEffect,
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

import "./style.less";


function myRemarkPlugin() {
  return (tree) => {
    visitParents(tree, "textDirective", (node, ancestors) => {
      // 注册@abbr
      registerAnnoAbbr(node);

      // 判断祖先元素
      if (!ancestors || ancestors.length === 0) {
        return;
      }

      // 注册@nice
      registerAnnoNice(node, ancestors);

      // 注册@fetch
      registerAnnoFetch(node, ancestors);
      
    });
  };
}

const App = {
  template: `
    <div>

    <p>演示注解:  @abbr + @nice + @fetch</p>
  
    <textarea style="width:100%;height: 300px;" v-model="before"></textarea>

    <div v-html="after"></div>
   
    </div>
    
  `,
  setup() {
    const before = ref(`# A lovely language know as @abbr[namespace](HTML, "HTML的全称"){.red.blue #id} @nice

@abbr(HTML, "HTML的全称"){.bg-blue}

hello @nice
  
@nice hello

hello hi @nice @nice

hello hi *em* @abbr(HTML, "HTML的全称"){.bg-blue} @nice @nice

hello @nice @nice hi

@fetch("https://v0.yiketianqi.com/api?unescape=1&version=v91&appid=43656176&appsecret=I42og6Lm&ext=&cityid=&city=")

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
    };
  },
};

Vue.use(VueCompositionApi);

Vue.config.productionTip = false;

new Vue({
  el: "#app",
  render: (h) => h(App),
});
