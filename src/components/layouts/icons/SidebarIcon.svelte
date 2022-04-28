<script lang="ts">
  import { SvgIcon } from "@/application/enums/shared/SvgIcon";

  import IconAdmin from "./IconAdmin.svelte";
  import IconTenants from "./IconTenants.svelte";
  import IconUsers from "./IconUsers.svelte";
  import IconPricing from "./IconPricing.svelte";
  import IconNavigation from "./IconNavigation.svelte";
  import IconComponents from "./IconComponents.svelte";

  import IconApp from "./IconApp.svelte";
  import IconDashboard from "./IconDashboard.svelte";
  import IconSettings from "./IconSettings.svelte";
  import IconLinks from "./IconLinks.svelte";
  import IconProviders from "./IconProviders.svelte";
  import IconClients from "./IconClients.svelte";
  import IconContracts from "./IconContracts.svelte";
  import IconEmployees from "./IconEmployees.svelte";
  import IconEmails from "./IconEmails.svelte";

  export let className: string;
  export let icon: SvgIcon;
</script>

<span>
  <!-- Core -->
  {#if icon === SvgIcon.ADMIN} <IconAdmin {className} />{/if}
  {#if icon === SvgIcon.TENANTS} <IconTenants {className} />{/if}
  {#if icon === SvgIcon.USERS} <IconUsers {className} />{/if}
  {#if icon === SvgIcon.PRICING} <IconPricing {className} />{/if}
  {#if icon === SvgIcon.EMAILS} <IconEmails {className} />{/if}
  {#if icon === SvgIcon.NAVIGATION} <IconNavigation {className} />{/if}
  {#if icon === SvgIcon.COMPONENTS} <IconComponents {className} />{/if}
  {#if icon === SvgIcon.APP} <IconApp {className} />{/if}
  {#if icon === SvgIcon.DASHBOARD} <IconDashboard {className} />{/if}
  {#if icon === SvgIcon.SETTINGS} <IconSettings {className} />{/if}

  <!-- App -->
  {#if icon === SvgIcon.LINKS} <IconLinks {className} />{/if}
  {#if icon === SvgIcon.PROVIDERS} <IconProviders {className} />{/if}
  {#if icon === SvgIcon.CLIENTS} <IconClients {className} />{/if}
  {#if icon === SvgIcon.CONTRACTS} <IconContracts {className} />{/if}
  {#if icon === SvgIcon.EMPLOYEES} <IconEmployees {className} />{/if}
</span>
