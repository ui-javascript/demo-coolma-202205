import { initAliasMeta } from "../../../utils/utils";

export default function registerAliaBili (annoAlias) {
  initAliasMeta(annoAlias, "doc", "bili", {
    srcName: 'src',
    tagName: 'iframe',
    scrolling: "no", 
    border: "0",
    frameborder: "no",
    framespacing: "0",
    allowfullscreen: "true"
  });
};
