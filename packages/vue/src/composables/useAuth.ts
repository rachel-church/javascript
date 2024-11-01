import type {
  ActJWTClaim,
  CheckAuthorizationWithCustomPermissions,
  Clerk,
  GetToken,
  OrganizationCustomRoleKey,
  SignOut,
} from '@clerk/types';
import { computed, type Ref, watch } from 'vue';

import { invalidStateError, useAuthHasRequiresRoleOrPermission } from '../errors/messages';
import type { ToComputedRefs } from '../utils';
import { toComputedRefs } from '../utils';
import { useClerkContext } from './useClerkContext';

type CheckAuthorizationSignedOut = undefined;
type CheckAuthorizationWithoutOrgOrUser = (params?: Parameters<CheckAuthorizationWithCustomPermissions>[0]) => false;

/**
 * @internal
 */
function clerkLoaded(clerk: Ref<Clerk | null>, loaded: Ref<boolean>) {
  return new Promise<Clerk>(resolve => {
    const unwatch = watch(loaded, value => {
      if (value) {
        unwatch();
        resolve(clerk.value!);
      }
    });
  });
}

/**
 * @internal
 */
function createGetToken(clerk: Ref<Clerk | null>, loaded: Ref<boolean>) {
  return async (options: any) => {
    const loadedClerk = await clerkLoaded(clerk, loaded);
    if (!loadedClerk.session) {
      return null;
    }

    return loadedClerk.session.getToken(options);
  };
}

/**
 * @internal
 */
function createSignOut(clerk: Ref<Clerk | null>, loaded: Ref<boolean>) {
  return async (...args: any) => {
    const loadedClerk = await clerkLoaded(clerk, loaded);
    return loadedClerk.signOut(...args);
  };
}

type UseAuthReturn =
  | {
      isLoaded: false;
      isSignedIn: undefined;
      userId: undefined;
      sessionId: undefined;
      actor: undefined;
      orgId: undefined;
      orgRole: undefined;
      orgSlug: undefined;
      has: CheckAuthorizationSignedOut;
      signOut: SignOut;
      getToken: GetToken;
    }
  | {
      isLoaded: true;
      isSignedIn: false;
      userId: null;
      sessionId: null;
      actor: null;
      orgId: null;
      orgRole: null;
      orgSlug: null;
      has: CheckAuthorizationWithoutOrgOrUser;
      signOut: SignOut;
      getToken: GetToken;
    }
  | {
      isLoaded: true;
      isSignedIn: true;
      userId: string;
      sessionId: string;
      actor: ActJWTClaim | null;
      orgId: null;
      orgRole: null;
      orgSlug: null;
      has: CheckAuthorizationWithoutOrgOrUser;
      signOut: SignOut;
      getToken: GetToken;
    }
  | {
      isLoaded: true;
      isSignedIn: true;
      userId: string;
      sessionId: string;
      actor: ActJWTClaim | null;
      orgId: string;
      orgRole: OrganizationCustomRoleKey;
      orgSlug: string | null;
      has: CheckAuthorizationWithCustomPermissions;
      signOut: SignOut;
      getToken: GetToken;
    };

export function useAuth(): ToComputedRefs<UseAuthReturn> {
  const { clerk, loaded, authCtx } = useClerkContext();

  const result = computed<UseAuthReturn>(() => {
    const { sessionId, userId, actor, orgId, orgRole, orgSlug, orgPermissions } = authCtx.value;

    const getToken: GetToken = createGetToken(clerk, loaded);
    const signOut: SignOut = createSignOut(clerk, loaded);

    const has = (params: Parameters<CheckAuthorizationWithCustomPermissions>[0]) => {
      if (!params?.permission && !params?.role) {
        throw new Error(useAuthHasRequiresRoleOrPermission);
      }
      if (!orgId || !userId || !orgRole || !orgPermissions) {
        return false;
      }

      if (params.permission) {
        return orgPermissions.includes(params.permission);
      }

      if (params.role) {
        return orgRole === params.role;
      }

      return false;
    };

    if (sessionId === undefined && userId === undefined) {
      return {
        isLoaded: false,
        isSignedIn: undefined,
        sessionId,
        userId,
        actor: undefined,
        orgId: undefined,
        orgRole: undefined,
        orgSlug: undefined,
        has: undefined,
        signOut,
        getToken,
      };
    }

    if (sessionId === null && userId === null) {
      return {
        isLoaded: true,
        isSignedIn: false,
        sessionId,
        userId,
        actor: null,
        orgId: null,
        orgRole: null,
        orgSlug: null,
        has: () => false,
        signOut,
        getToken,
      };
    }

    if (!!sessionId && !!userId && !!orgId && !!orgRole) {
      return {
        isLoaded: true,
        isSignedIn: true,
        sessionId,
        userId,
        actor: actor || null,
        orgId,
        orgRole,
        orgSlug: orgSlug || null,
        has,
        signOut,
        getToken,
      };
    }

    if (!!sessionId && !!userId && !orgId) {
      return {
        isLoaded: true,
        isSignedIn: true,
        sessionId,
        userId,
        actor: actor || null,
        orgId: null,
        orgRole: null,
        orgSlug: null,
        has: () => false,
        signOut,
        getToken,
      };
    }

    throw new Error(invalidStateError);
  });

  return toComputedRefs(result);
}
