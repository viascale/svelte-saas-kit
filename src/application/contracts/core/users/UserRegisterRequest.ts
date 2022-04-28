import type { UserLoginType } from "@/application/enums/core/users/UserLoginType";
import type { SelectedSubscriptionRequest } from "../subscriptions/SelectedSubscriptionRequest";

export interface UserRegisterRequest {
  email: string;
  selectedSubscription: SelectedSubscriptionRequest;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phone: string;
  loginType: UserLoginType;
  workspaceName: string;
  joinedByLinkInvitation: string;
}
