import { get } from "svelte/store";
import { _ } from "svelte-i18n";
const $t = get(_);

export default [
  {
    lang: "en-US",
    name: $t("shared.locales.en-US").toString(),
    flag: "us",
    lang_short: "en",
  },
  {
    lang: "es-MX",
    name: $t("shared.locales.es-MX").toString(),
    flag: "mx",
    lang_short: "es",
  },
];
