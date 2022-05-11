import { initAliasMeta } from "../../../utils/utils";

export default function registerAliaCat (annoAlias) {
  initAliasMeta(annoAlias, "img", "cat", {
    style: "width: 150px;",
    cat: true,
  });
};
