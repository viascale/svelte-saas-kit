import type { SubscriptionGetCurrentResponse } from "@/application/contracts/core/subscriptions/SubscriptionGetCurrentResponse";
import type { TenantDto } from "@/application/dtos/core/tenants/TenantDto";
import type { TenantUserDto } from "@/application/dtos/core/tenants/TenantUserDto";
import type { WorkspaceDto } from "@/application/dtos/core/workspaces/WorkspaceDto";
import { writable } from "svelte/store";
import type { TenantState } from "../types";

export const state: TenantState = {
  tenants: [],
  current: null,
  subscription: null,
  members: [],
  workspaces: [],
  currentWorkspace: null,
  features: null,
};
const initialState: TenantState = JSON.parse(localStorage.getItem("tenant") ?? "{}") ?? {
  tenants: [],
  current: null,
  subscription: null,
  members: [],
  workspaces: [],
  currentWorkspace: null,
  features: null,
};

export const tenantState = writable(initialState);

export const tenantStore = {
  resetTenantState: () =>
    tenantState.update((self) => {
      self.tenants = [];
      self.current = null;
      self.subscription = null;
      self.members = [];
      self.workspaces = [];
      self.currentWorkspace = null;
      self.features = null;
      return self;
    }),
  setMyTenants: (payload: TenantDto[]) =>
    tenantState.update((self) => {
      self.tenants = payload;
      return self;
    }),
  setCurrent: (payload: TenantDto) =>
    tenantState.update((self) => {
      self.current = payload;
      return self;
    }),
  setCurrentWorkspace: (payload: WorkspaceDto) =>
    tenantState.update((self) => {
      self.currentWorkspace = payload;
      return self;
    }),
  setCurrentImage: (payload: { imageType: string; image: string }) =>
    tenantState.update((self) => {
      if (self && self.current) {
        if (payload.imageType === "icon") {
          self.current.icon = payload.image;
        } else if (payload.imageType === "logo") {
          self.current.logo = payload.image;
        } else if (payload.imageType === "logoDarkmode") {
          self.current.logoDarkmode = payload.image;
        }
      }
      return self;
    }),
  setSubscription: (payload: SubscriptionGetCurrentResponse) =>
    tenantState.update((self) => {
      self.subscription = payload;
      if (payload) {
        if (self.tenants && payload.customer) {
          self.tenants.forEach((tenant) => {
            if (tenant.subscriptionCustomerId === payload.customer.id) {
              tenant.products = payload.myProducts;
            }
          });
        }
      }
      return self;
    }),
  setMembers: (payload: TenantUserDto[]) =>
    tenantState.update((self) => {
      self.members = payload;
      return self;
    }),
  setWorkspaces: (payload: WorkspaceDto[]) =>
    tenantState.update((self) => {
      self.workspaces = payload;
      if (self.currentWorkspace) {
        if (!payload.find((f) => f.id === self.currentWorkspace?.id)) {
          self.currentWorkspace = null;
        }
      }
      if (payload?.length > 0 && !self.currentWorkspace) {
        const defaultWorkspace = payload.find((f) => f.default);
        if (defaultWorkspace) {
          self.currentWorkspace = defaultWorkspace;
        } else {
          self.currentWorkspace = payload[0];
        }
      }
      return self;
    }),
  setSettings: (payload: TenantDto) =>
    tenantState.update((self) => {
      if (self?.current) {
        self.current.name = payload.name;
        self.current.subdomain = payload.subdomain;
      }
      return self;
    }),
};

tenantState.subscribe((val) => {
  localStorage.setItem("tenant", JSON.stringify(val));
});
