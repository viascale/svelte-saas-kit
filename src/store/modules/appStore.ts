import type { TenantFeaturesDto } from "@/application/contracts/core/tenants/TenantFeaturesDto";
import type { AppUsageSummaryDto } from "@/application/dtos/app/usage/AppUsageSummaryDto";
import { AppUsageType } from "@/application/enums/app/usages/AppUsageType";
import { ApplicationLayout } from "@/application/enums/shared/ApplicationLayout";
import { writable } from "svelte/store";
import type { AppState } from "../types";

const initialState: AppState = JSON.parse(localStorage.getItem("app") ?? "{}") ?? {
  usage: {
    type: 0,
    providers: 0,
    providersInCompliance: 0,
    clients: 0,
    contracts: 0,
    employees: 0,
    storage: 0,
    pendingInvitations: 0,
  },
  features: {
    maxUsers: 1,
    maxWorkspaces: 1,
    maxLinks: 1,
    maxStorage: 1,
    monthlyContracts: 1,
  },
  layout: ApplicationLayout.SIDEBAR,
};

export const appState = writable(initialState);

export const appStore = {
  resetAppState: () =>
    appState.update((self) => {
      self.usage = {
        type: 0,
        providers: 0,
        providersInCompliance: 0,
        clients: 0,
        contracts: 0,
        employees: 0,
        storage: 0,
        pendingInvitations: 0,
      };
      self.features = {
        maxUsers: 1,
        maxWorkspaces: 1,
        maxLinks: 1,
        maxStorage: 1,
        monthlyContracts: 1,
      };
      self.layout = ApplicationLayout.SIDEBAR;

      return self;
    }),
  setLayout: (payload: ApplicationLayout) =>
    appState.update((self) => {
      self.layout = payload;
      return self;
    }),
  setUsage: (payload: AppUsageSummaryDto) =>
    appState.update((self) => {
      if (self.usage) {
        if (payload.type === AppUsageType.ALL) {
          self.usage = payload;
        } else if (payload.type === AppUsageType.PROVIDERS) {
          self.usage.providers = payload.providers;
          self.usage.providersInCompliance = payload.providersInCompliance;
        } else if (payload.type === AppUsageType.CLIENTS) {
          self.usage.clients = payload.clients;
        } else if (payload.type === AppUsageType.EMPLOYEES) {
          self.usage.employees = payload.employees;
        } else if (payload.type === AppUsageType.CONTRACTS) {
          self.usage.contracts = payload.contracts;
        } else if (payload.type === AppUsageType.STORAGE) {
          self.usage.storage = payload.storage;
        } else if (payload.type === AppUsageType.PENDING_INVITATIONS) {
          self.usage.pendingInvitations = payload.pendingInvitations;
        }
      }
      return self;
    }),
  setFeatures: (payload: TenantFeaturesDto) =>
    appState.update((self) => {
      self.features = payload;
      return self;
    }),
};

appState.subscribe((val) => {
  localStorage.setItem("app", JSON.stringify(val));
});
