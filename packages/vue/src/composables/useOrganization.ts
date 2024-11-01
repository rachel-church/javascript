import type { OrganizationMembershipResource, OrganizationResource } from '@clerk/types';
import { computed } from 'vue';

import type { ToComputedRefs } from '../utils';
import { toComputedRefs } from '../utils';
import { useClerkContext } from './useClerkContext';
import { useSession } from './useSession';

type UseOrganizationReturn =
  | {
      isLoaded: false;
      organization: undefined;
      membership: undefined;
    }
  | {
      isLoaded: true;
      organization: OrganizationResource;
      membership: undefined;
    }
  | {
      isLoaded: boolean;
      organization: OrganizationResource | null;
      membership: OrganizationMembershipResource | null | undefined;
    };

type UseOrganization = () => ToComputedRefs<UseOrganizationReturn>;

export const useOrganization: UseOrganization = () => {
  const { loaded, organizationCtx } = useClerkContext();
  const { session } = useSession();

  const result = computed<UseOrganizationReturn>(() => {
    if (organizationCtx.value === undefined) {
      return { isLoaded: false, organization: undefined, membership: undefined };
    }

    if (organizationCtx.value === null) {
      return { isLoaded: true, organization: null, membership: null };
    }

    /** In SSR context we include only the organization object when loadOrg is set to true. */
    if (!loaded.value) {
      return {
        isLoaded: true,
        organization: organizationCtx.value,
        membership: undefined,
      };
    }

    return {
      isLoaded: loaded.value,
      organization: organizationCtx.value,
      membership: getCurrentOrganizationMembership(
        session.value!.user.organizationMemberships,
        organizationCtx.value.id,
      ),
    };
  });

  return toComputedRefs(result);
};

function getCurrentOrganizationMembership(
  organizationMemberships: OrganizationMembershipResource[],
  activeOrganizationId: string,
) {
  return organizationMemberships.find(
    organizationMembership => organizationMembership.organization.id === activeOrganizationId,
  );
}
