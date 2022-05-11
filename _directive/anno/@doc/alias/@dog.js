import { initAliasMeta } from "../../../utils/utils";

export default function registerAliaDog (annoAlias) {
  initAliasMeta(annoAlias, "img", "dog", {
    style: "width: 150px;",
    dog: true,
  });
};
