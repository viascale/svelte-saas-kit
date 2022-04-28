<script lang="ts">
  import type { TenantUserRole } from "@/application/enums/core/tenants/TenantUserRole";
  import type { UserType } from "@/application/enums/core/users/UserType";
  import { Route } from "svelte-routing";
  import PrivateRouteGuard from "./PrivateRouteGuard.svelte";

  export let path: string;
  export let userTypes: UserType[] = [];
  export let roles: TenantUserRole[] = [];
</script>

<Route {path} let:params let:location>
  <PrivateRouteGuard {userTypes} {roles}>
    <slot {params} {location} />
  </PrivateRouteGuard>
</Route>
