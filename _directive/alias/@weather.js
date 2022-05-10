import { initAliasMeta } from "../utils/utils";

export default function registerAliaWeather (annoAlias) {
  initAliasMeta(annoAlias, "fetch", "weather", {
    weather: true,
    includeKeys: ["day", "date", "week", "wea", "win"],
  });
};
