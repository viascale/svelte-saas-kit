import type { Month } from "./Month";
import { get } from "svelte/store";
import { _ } from "svelte-i18n";
const $t = get(_);

const months: Month[] = [];
for (let month = 1; month <= 12; month++) {
  months.push({
    value: month,
    title: $t("app.shared.months." + month).toString(),
    shortTitle: $t("app.shared.months." + month)
      .toString()
      .substr(0, 3),
  });
}

export default months;
