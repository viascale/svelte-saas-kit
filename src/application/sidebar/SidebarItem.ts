import type { TenantUserRole } from "../enums/core/tenants/TenantUserRole";
import type { UserType } from "../enums/core/users/UserType";
import type { SvgIcon } from "../enums/shared/SvgIcon";

export interface SideBarItem {
  title: string;
  path: string;
  icon?: SvgIcon;
  open?: boolean;
  userTypes?: UserType[];
  userRoles?: TenantUserRole[];
  items?: SideBarItem[];
}
