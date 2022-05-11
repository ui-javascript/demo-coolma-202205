import { initAliasMeta } from "../../../utils/utils";

export default function registerAliaTiger (annoAlias) {
  initAliasMeta(annoAlias, "img", "tiger", {
    style: "width: 150px;",
    tiger: true,
  });
};
