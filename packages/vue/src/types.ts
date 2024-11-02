import type {
  ActiveSessionResource,
  ActJWTClaim,
  Clerk,
  ClerkOptions,
  ClientResource,
  OrganizationCustomPermissionKey,
  OrganizationCustomRoleKey,
  OrganizationResource,
  UserResource,
  Without,
} from '@clerk/types';
import type { ComputedRef, ShallowRef } from 'vue';

// Copied from `@clerk/clerk-react`
export interface HeadlessBrowserClerk extends Clerk {
  load: (opts?: Without<ClerkOptions, 'isSatellite'>) => Promise<void>;
  updateClient: (client: ClientResource) => void;
}

// Copied from `@clerk/clerk-react`
export interface BrowserClerk extends HeadlessBrowserClerk {
  onComponentsReady: Promise<void>;
  components: any;
}

export interface VueClerkInjectionKeyType {
  clerk: ShallowRef<Clerk | null>;
  authCtx: ComputedRef<{
    userId: string | null | undefined;
    sessionId: string | null | undefined;
    actor: ActJWTClaim | null | undefined;
    orgId: string | null | undefined;
    orgRole: OrganizationCustomRoleKey | null | undefined;
    orgSlug: string | null | undefined;
    orgPermissions: OrganizationCustomPermissionKey[] | null | undefined;
  }>;
  clientCtx: ComputedRef<ClientResource | null | undefined>;
  sessionCtx: ComputedRef<ActiveSessionResource | null | undefined>;
  userCtx: ComputedRef<UserResource | null | undefined>;
  organizationCtx: ComputedRef<OrganizationResource | null | undefined>;
}

// Using Symbols causes issues in Nuxt. Investigate further.
// export const VueClerkInjectionKey = Symbol('VueClerk') as InjectionKey<VueClerkInjectionKeyType>
export const VueClerkInjectionKey = '$$_clerk';

declare global {
  interface Window {
    Clerk: BrowserClerk;
  }
}
