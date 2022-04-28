import { addMessages, init, _ } from "svelte-i18n";
import { get } from "svelte/store";

import en from "./en-US.json";
import es from "./es-MX.json";

addMessages("en-US", en);
addMessages("es-MX", es);

const locale = localStorage.getItem("locale") ?? import.meta.env.VITE_SVELTE_APP_LANGUAGE?.toString() ?? "en-US";
init({
  fallbackLocale: locale,
  initialLocale: locale,
});

export function t(message: any): string {
  return get(message);
}

export default {
  t,
};
