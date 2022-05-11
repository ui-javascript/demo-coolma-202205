import { initAliasMeta } from "../../../utils/utils";

export default function registerAliaBilibili (annoAlias) {
  initAliasMeta(annoAlias, "doc", "bilibili", {
    srcName: 'src',
    tagName: 'iframe',
    scrolling: "no", 
    border: "0",
    frameborder: "no",
    framespacing: "0",
    allowfullscreen: "true"
  });
};
