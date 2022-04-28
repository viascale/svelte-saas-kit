import type { TenantDto } from "@/application/dtos/core/tenants/TenantDto";
import type { WorkspaceDto } from "@/application/dtos/core/workspaces/WorkspaceDto";
import { authState, authStore } from "@/store/modules/authStore";
import { tenantState } from "@/store/modules/tenantStore";
import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { get } from "svelte/store";

const apiUrl = import.meta.env.VITE_SVELTE_APP_SERVER_URL?.toString() + "api";
const config: AxiosRequestConfig = {
  baseURL: apiUrl,
};
const server: AxiosInstance = axios.create(config);

server.defaults.headers.common["Access-Control-Allow-Origin"] = "*";

server.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.status === 401 || error?.toString().includes("status code 401")) {
      authStore.logout();
      window.location.replace("/login");
      return;
    }
    if (error.response?.data) {
      return Promise.reject(error.response.data);
    } else if (error.message) {
      return Promise.reject(error.message);
    } else {
      return Promise.reject(error);
    }
  }
);

server.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    if (!config.headers) {
      return config;
    }
    let token = get(authState).token;
    let currentTenant: TenantDto | null = get(tenantState).current;
    let currentWorkspace: WorkspaceDto | null = get(tenantState).currentWorkspace;

    if (currentTenant) {
      config.headers.common["X-Tenant-Key"] = currentTenant.uuid;
    }
    if (currentWorkspace) {
      config.headers.common["X-Workspace-Id"] = currentWorkspace.id;
    }
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
export default server;
