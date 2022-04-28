<script lang="ts">
  import { Router, Route } from "svelte-routing";
  import "./locale/i18n";
  import Landing from "./views/front/Landing.svelte";
  import Pricing from "./views/front/Pricing.svelte";
  import Contact from "./views/front/Contact.svelte";
  import { Theme } from "./application/enums/shared/Theme";
  import { themeState } from "./store/modules/themeStore";
  import PrivacyPolicy from "./views/front/PrivacyPolicy.svelte";
  import TermsAndConditions from "./views/front/TermsAndConditions.svelte";
  import Components from "./views/front/Components.svelte";
  import Login from "./views/front/account/Login.svelte";
  import Register from "./views/front/account/Register.svelte";
  import Verify from "./views/front/account/Verify.svelte";
  import Forgot from "./views/front/account/Forgot.svelte";
  import Reset from "./views/front/account/Reset.svelte";
  import Invitation from "./views/front/account/Invitation.svelte";
  import JoinTenant from "./views/front/account/JoinTenant.svelte";
  import PrivateRoute from "./router/PrivateRoute.svelte";
  import AdminIndex from "./views/admin/AdminIndex.svelte";
  import TenantsIndex from "./views/admin/tenants/TenantsIndex.svelte";
  import Redirect from "./router/Redirect.svelte";
  import Users from "./views/admin/Users.svelte";
  import Tenant from "./views/admin/tenants/Tenant.svelte";
  import AdminPricing from "./views/admin/AdminPricing.svelte";
  import Navigation from "./views/admin/Navigation.svelte";
  import AdminComponents from "./views/admin/AdminComponents.svelte";
  import Emails from "./views/admin/Emails.svelte";
  import { UserType } from "./application/enums/core/users/UserType";
  import AppIndex from "./views/core/AppIndex.svelte";
  import { TenantUserRole } from "./application/enums/core/tenants/TenantUserRole";
  import Dashboard from "./views/core/Dashboard.svelte";
  import Settings from "./views/core/settings/Settings.svelte";
  import Profile from "./views/core/settings/Profile.svelte";
  import Workspaces from "./views/core/settings/Workspaces.svelte";
  import NewWorkspace from "./components/core/workspaces/NewWorkspace.svelte";
  import EditWorkspace from "./components/core/workspaces/EditWorkspace.svelte";
  import Members from "./views/core/settings/Members.svelte";
  import NewMember from "./components/core/settings/members/NewMember.svelte";
  import EditMember from "./components/core/settings/members/EditMember.svelte";
  import MySubscription from "./components/core/settings/subscription/MySubscription.svelte";
  import TenantSettings from "./views/core/settings/TenantSettings.svelte";
  import LinksIndex from "./views/core/links/LinksIndex.svelte";
  import AllLinksList from "./components/app/links/all/AllLinksList.svelte";
  import PendingLinksList from "./components/app/links/pending/PendingLinksList.svelte";
  import ProvidersList from "./components/app/links/providers/ProvidersList.svelte";
  import ClientsList from "./components/app/links/clients/ClientsList.svelte";
  import Link from "./views/core/links/Link.svelte";
  import Employees from "./views/app/employees/Employees.svelte";
  import NewEmployees from "./views/app/employees/NewEmployees.svelte";
  import Employee from "./views/app/employees/Employee.svelte";
  import Contracts from "./views/app/contracts/Contracts.svelte";
  import NewContract from "./views/app/contracts/NewContract.svelte";
  import Contract from "./views/app/contracts/Contract.svelte";
  import Unauthorized from "./views/core/Unauthorized.svelte";

  export let url = "";

  const htmlClasses = document.querySelector("html")?.classList;
  if ($themeState.value === Theme.DARK) htmlClasses?.add("dark");
  else htmlClasses?.remove("dark");
</script>

<main role="main">
  <Router {url}>
    <Route path="/">
      <Landing />
    </Route>
    <Route path="/pricing" component={Pricing} />
    <Route path="/contact" component={Contact} />
    <Route path="/privacy-policy" component={PrivacyPolicy} />
    <Route path="/terms-and-conditions" component={TermsAndConditions} />
    <Route path="/components" component={Components} />

    <Route path="/login" component={Login} />
    <Route path="/register" component={Register} />
    <Route path="/verify" component={Verify} />
    <Route path="/forgot-password" component={Forgot} />
    <Route path="/reset" component={Reset} />
    <Route path="/invitation" component={Invitation} />
    <Route path="/join/:tenantId" component={JoinTenant} />

    <Route path="/admin"><Redirect to="/admin/tenants" /></Route>
    <PrivateRoute path="admin/*" userTypes={[UserType.Admin]}>
      <AdminIndex>
        <Router>
          <Route path="tenants"><TenantsIndex /></Route>
          <Route path="tenant/:tenantId" let:params><Tenant {...params} /></Route>
          <Route path="users"><Users /></Route>
          <Route path="pricing"><AdminPricing /></Route>
          <Route path="emails"><Emails /></Route>
          <Route path="navigation"><Navigation /></Route>
          <Route path="components"><AdminComponents /></Route>
        </Router>
      </AdminIndex>
    </PrivateRoute>

    <Route path="/app"><Redirect to="/app/dashboard" /></Route>
    <PrivateRoute path="app/*" userTypes={[UserType.Tenant]}>
      <AppIndex>
        <Router>
          <PrivateRoute path="dashboard" roles={[TenantUserRole.OWNER, TenantUserRole.ADMIN, TenantUserRole.MEMBER]}><Dashboard /></PrivateRoute>
          <Route path="settings/*">
            <Router>
              <Settings>
                <Route path="profile"><Profile /></Route>
                <PrivateRoute path="workspaces/*" roles={[TenantUserRole.OWNER, TenantUserRole.ADMIN]}>
                  <Workspaces>
                    <Router>
                      <Route path="new">
                        <NewWorkspace />
                      </Route>
                      <Route path="edit/:id" let:params>
                        <EditWorkspace {...params} />
                      </Route>
                    </Router>
                  </Workspaces>
                </PrivateRoute>

                <PrivateRoute path="members/*" roles={[TenantUserRole.OWNER, TenantUserRole.ADMIN]}>
                  <Members>
                    <Router>
                      <Route path="new">
                        <NewMember />
                      </Route>
                      <Route path="edit/:id" let:params>
                        <EditMember {...params} />
                      </Route>
                    </Router>
                  </Members>
                </PrivateRoute>

                <PrivateRoute path="subscription" roles={[TenantUserRole.OWNER]}>
                  <MySubscription />
                </PrivateRoute>

                <PrivateRoute path="tenant" roles={[TenantUserRole.OWNER]}>
                  <TenantSettings />
                </PrivateRoute>
              </Settings>
            </Router>
          </Route>

          <Route path="links"><Redirect to="links/all" /></Route>
          <PrivateRoute path="links/*" roles={[TenantUserRole.OWNER, TenantUserRole.ADMIN]}>
            <LinksIndex>
              <Router>
                <Route path="all"><AllLinksList /></Route>
                <Route path="pending"><PendingLinksList /></Route>
                <Route path="providers"><ProvidersList /></Route>
                <Route path="clients"><ClientsList /></Route>
              </Router>
            </LinksIndex>
          </PrivateRoute>

          <PrivateRoute let:params path="link/:id" roles={[TenantUserRole.OWNER, TenantUserRole.ADMIN]}>
            <Link {...params} />
          </PrivateRoute>

          <Route path="employees"><Employees /></Route>
          <Route path="employees/new"><NewEmployees /></Route>
          <Route path="employee/:id" let:params><Employee {...params} /></Route>

          <Route path="contracts"><Redirect to="app/contracts/pending" /></Route>
          <Route path="contracts/:status" let:params><Contracts {...params} /></Route>

          <Route path="unauthorized"><Unauthorized /></Route>

          <PrivateRoute let:params path="contract/new" roles={[TenantUserRole.OWNER, TenantUserRole.ADMIN, TenantUserRole.MEMBER]}>
            <NewContract {...params} />
          </PrivateRoute>

          <PrivateRoute let:params path="contract/:id" roles={[TenantUserRole.OWNER, TenantUserRole.ADMIN, TenantUserRole.MEMBER]}>
            <Contract {...params} />
          </PrivateRoute>
        </Router>
      </AppIndex>
    </PrivateRoute>
  </Router>
</main>
