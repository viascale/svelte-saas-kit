<script lang="ts">
  import { TenantUserRole } from "@/application/enums/core/tenants/TenantUserRole";

  import { UserType } from "@/application/enums/core/users/UserType";
  import { accountState } from "@/store/modules/accountStore";
  import { authState } from "@/store/modules/authStore";
  import { tenantState } from "@/store/modules/tenantStore";
  import { onMount } from "svelte";
  import { navigate } from "svelte-routing";

  export let userTypes: UserType[] = [];
  export let roles: TenantUserRole[] = [];

  let authenticated = false;

  $: authenticated = $authState.authenticated;
  $: currentType = $accountState.user?.type;
  $: currentRole = $tenantState.current?.currentUser.role;

  onMount(() => {
    if (!authenticated) {
      console.log("not authenticated");
      const redirect = "/login?redirect=" + location.pathname;
      navigate(redirect);
    }

    if (currentType && userTypes.length > 0 && !userTypes.some((f) => f === currentType)) {
      console.log(`User type ${UserType[currentType]} not unauthorized, allowed: ${userTypes.map((f) => UserType[f])}`);
      navigate("/app/unauthorized");
    }

    if (currentRole && roles.length > 0 && !roles.some((f) => f === currentRole)) {
      console.log(`User tenant role ${currentRole} not unauthorized, allowed: ${roles.map((f) => TenantUserRole[f])}`);
      navigate("/app/unauthorized");
    }
  });
</script>

<slot />
