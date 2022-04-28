import type { SideBarItem } from "./SidebarItem";
import { UserType } from "@/application/enums/core/users/UserType";
import { SvgIcon } from "../enums/shared/SvgIcon";
import { get } from "svelte/store";
import { _ } from "svelte-i18n";
const $t = get(_);

export const AdminSidebar: SideBarItem[] = [
  {
    title: $t("app.sidebar.admin"),
    path: "",
    items: [
      {
        title: $t("admin.tenants.title"),
        path: "/admin/tenants",
        icon: SvgIcon.TENANTS,
        items: [],
      },
      {
        title: $t("models.user.plural"),
        path: "/admin/users",
        icon: SvgIcon.USERS,
        items: [],
      },
      {
        title: $t("admin.pricing.title"),
        path: "/admin/pricing",
        icon: SvgIcon.PRICING,
        items: [],
      },
      {
        title: $t("admin.emails.title"),
        path: "/admin/emails",
        icon: SvgIcon.EMAILS,
        items: [],
      },
      {
        title: $t("admin.navigation.title"),
        path: "/admin/navigation",
        icon: SvgIcon.NAVIGATION,
        items: [],
      },
      {
        title: $t("admin.components.title"),
        path: "/admin/components",
        icon: SvgIcon.COMPONENTS,
        items: [],
      },
    ],
  },
  {
    title: "App",
    path: "",
    items: [
      {
        title: $t("admin.switchToApp"),
        path: "/app",
        icon: SvgIcon.APP,
        userTypes: [UserType.Admin],
        items: [],
      },
    ],
  },
];
