import type { UserLoggedResponse } from "@/application/contracts/core/users/UserLoggedResponse";
import type { UserDto } from "@/application/dtos/core/users/UserDto";
import { UserType } from "@/application/enums/core/users/UserType";
import { accountStore } from "@/store/modules/accountStore";
import { appStore } from "@/store/modules/appStore";
import { authStore } from "@/store/modules/authStore";
import { pricingStore } from "@/store/modules/pricingStore";
import { tenantStore } from "@/store/modules/tenantStore";
import { locale } from "svelte-i18n";
import { navigate } from "svelte-routing";

const avatarText = (user: UserDto | null): string => {
  if (user) {
    if (user.firstName && user.lastName) {
      if (user.firstName.length > 0 && user.lastName.length > 0) {
        return (user.firstName[0] + user.lastName[0]).toUpperCase();
      } else if (user.firstName.length > 1) {
        return user.firstName.substring(0, 2).toUpperCase();
      } else if (user.email.length > 1) {
        return user.email.substring(0, 2).toUpperCase();
      }
    } else if (user.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
  }
  return "--";
};

const profileName = (user: UserDto | null): string => {
  if (user) {
    if (user.firstName && user.lastName) {
      return user.firstName + " " + user.lastName;
    } else {
      return user.email;
    }
  }
  return "--";
};

const logged = (response: UserLoggedResponse) => {
  authStore.login(response);
  const tenants = response.user.tenants.map((f) => f.tenant);
  const currentTenant = response.user.currentTenant;
  accountStore.setLogged(response.user);
  tenantStore.setMyTenants(tenants);
  tenantStore.setCurrent(currentTenant);
  if (response.user.locale) {
    localStorage.setItem("locale", response.user.locale);
    locale.set(response.user.locale ?? "en");
  }

  const redirect = new URLSearchParams(location.search).get("redirect");
  if (redirect) {
    navigate(redirect);
  } else {
    if ((response.user as UserDto).type === UserType.Admin && import.meta.env.VITE_SVELTE_APP_SERVICE !== "sandbox") {
      navigate("/admin");
    } else {
      navigate("/app/dashboard");
    }
  }
};

const loggedOut = () => {
  authStore.logout();
  accountStore.resetAccountState();
  pricingStore.resetPricingState();
  tenantStore.resetTenantState();
  appStore.resetAppState();
  localStorage.clear();
  navigate("/");
};

export default {
  avatarText,
  profileName,
  logged,
  loggedOut,
};
