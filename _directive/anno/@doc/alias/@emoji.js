import { initAliasMeta } from "../../../utils/utils";

export default function registerAliaEmoji (annoAlias) {
  initAliasMeta(annoAlias, "img", "emoji", {
    style: "width: 150px;"
  });
};
