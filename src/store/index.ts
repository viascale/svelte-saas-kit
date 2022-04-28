import { accountStore } from "./modules/accountStore";
import { appStore } from "./modules/appStore";
import { authStore } from "./modules/authStore";
import { pricingStore } from "./modules/pricingStore";
import { tenantStore } from "./modules/tenantStore";
import { themeStore } from "./modules/themeStore";

const store = {
  account: accountStore,
  auth: authStore,
  tenant: tenantStore,
  pricing: pricingStore,
  theme: themeStore,
  app: appStore,
};

export default store;
