import type { UserResource } from '@clerk/types';
import { computed } from 'vue';

import { useClerkContext } from './useClerkContext';
import type { ToComputedRefs } from './utils';
import { toComputedRefs } from './utils';

type UseUserReturn =
  | { isLoaded: false; isSignedIn: undefined; user: undefined }
  | { isLoaded: true; isSignedIn: false; user: null }
  | { isLoaded: true; isSignedIn: true; user: UserResource };

type UseUser = () => ToComputedRefs<UseUserReturn>;

/**
 * Returns the current user's [`User`](https://clerk.com/docs/references/javascript/user/user) object along with loading states.
 *
 * @example
 * A simple example:
 *
 * <script setup>
 * import { useUser } from '@clerk/vue'
 *
 * const { isLoaded, isSignedIn, user } = useUser()
 * </script>
 *
 * <template>
 *   <template v-if="!isLoaded">
 *     <!-- Handle loading state -->
 *   </template>
 *
 *   <template v-else-if="isSignedIn">
 *     <div>Hello {{ user.fullName }}!</div>
 *   </template>
 *
 *   <template v-else>
 *     <div>Not signed in</div>
 *   </template>
 * </template>
 */
export const useUser: UseUser = () => {
  const { userCtx } = useClerkContext();

  const result = computed<UseUserReturn>(() => {
    if (userCtx.value === undefined) {
      return { isLoaded: false, isSignedIn: undefined, user: undefined };
    }

    if (userCtx.value === null) {
      return { isLoaded: true, isSignedIn: false, user: null };
    }

    return { isLoaded: true, isSignedIn: true, user: userCtx.value };
  });

  return toComputedRefs(result);
};
