import { initAliasMeta } from "../utils/utils"

export default function registerAliafetchAliasWeather (annoAlias) {
    initAliasMeta(annoAlias, 'fetch', 'fetchAliasWeather', {
        includeKeys: ['day', 'week', 'wea']
      })
}