import type { SideBarItem } from "./SidebarItem";
import { TenantUserRole } from "@/application/enums/core/tenants/TenantUserRole";
import { UserType } from "@/application/enums/core/users/UserType";
import { SvgIcon } from "../enums/shared/SvgIcon";
import { get } from "svelte/store";
import { _ } from "svelte-i18n";
const $t = get(_);

export const AppSidebar: SideBarItem[] = [
  {
    title: $t("app.sidebar.app"),
    path: "",
    items: [
      {
        title: $t("app.sidebar.dashboard"),
        path: "/app/dashboard",
        icon: SvgIcon.DASHBOARD,
        userRoles: [TenantUserRole.OWNER, TenantUserRole.ADMIN, TenantUserRole.MEMBER, TenantUserRole.GUEST],
      },
      {
        title: $t("models.link.plural"),
        path: "/app/links/all",
        icon: SvgIcon.LINKS,
        userRoles: [TenantUserRole.OWNER, TenantUserRole.ADMIN],
        items: [
          {
            title: $t("shared.all"),
            path: "/app/links/all",
          },
          {
            title: $t("models.provider.plural"),
            path: "/app/links/providers",
          },
          {
            title: $t("models.client.plural"),
            path: "/app/links/clients",
          },
        ],
      },
      {
        title: $t("models.contract.plural"),
        path: "/app/contracts/pending",
        icon: SvgIcon.CONTRACTS,
        userRoles: [TenantUserRole.OWNER, TenantUserRole.ADMIN, TenantUserRole.MEMBER, TenantUserRole.GUEST],
      },
      {
        title: $t("models.employee.plural"),
        path: "/app/employees",
        icon: SvgIcon.EMPLOYEES,
        userRoles: [TenantUserRole.OWNER, TenantUserRole.ADMIN, TenantUserRole.MEMBER],
      },
      {
        title: $t("app.navbar.settings"),
        icon: SvgIcon.SETTINGS,
        userRoles: [TenantUserRole.OWNER, TenantUserRole.ADMIN],
        path: "/app/settings",
        items: [
          {
            title: $t("app.navbar.profile"),
            path: "/app/settings/profile",
          },
          {
            title: $t("models.workspace.plural"),
            path: "/app/settings/workspaces",
            userRoles: [TenantUserRole.OWNER, TenantUserRole.ADMIN],
          },
          {
            title: $t("settings.members.title"),
            path: "/app/settings/members",
            userRoles: [TenantUserRole.OWNER, TenantUserRole.ADMIN],
          },
          {
            title: $t("settings.subscription.title"),
            path: "/app/settings/subscription",
            userRoles: [TenantUserRole.OWNER],
          },
          {
            title: $t("app.navbar.tenant"),
            path: "/app/settings/tenant",
            userRoles: [TenantUserRole.OWNER],
          },
        ],
      },
    ],
  },
  {
    title: $t("admin.title"),
    path: "",
    items: [
      {
        title: $t("admin.switchToAdmin"),
        path: "/admin/tenants",
        icon: SvgIcon.ADMIN,
        userTypes: [UserType.Admin],
      },
    ],
  },
];
