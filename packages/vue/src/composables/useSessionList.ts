import type { SessionResource, SetActive } from '@clerk/types';
import { computed } from 'vue';

import { useClerkContext } from './useClerkContext';
import type { ToComputedRefs } from './utils';
import { toComputedRefs } from './utils';

type UseSessionListReturn =
  | { isLoaded: false; sessions: undefined; setActive: undefined }
  | { isLoaded: true; sessions: SessionResource[]; setActive: SetActive };

type UseSessionList = () => ToComputedRefs<UseSessionListReturn>;

/**
 * Returns an array of [`Session`](https://clerk.com/docs/references/javascript/session) objects that have been
 * registered on the client device.
 *
 * @example
 * A simple example:
 *
 * <script setup>
 * import { useSessionList } from '@clerk/vue'
 *
 * const { isLoaded, sessions } = useSessionList()
 * </script>
 *
 * <template>
 *   <template v-if="!isLoaded">
 *     <!-- Handle loading state -->
 *   </template>
 *
 *   <template v-else>
 *     <div>
 *       <p>
 *         Welcome back. You have been here
 *         {{ sessions.length }} times before.
 *       </p>
 *     </div>
 *   </template>
 * </template>
 */
export const useSessionList: UseSessionList = () => {
  const { clerk, clientCtx } = useClerkContext();

  const result = computed<UseSessionListReturn>(() => {
    if (!clientCtx.value) {
      return { isLoaded: false, sessions: undefined, setActive: undefined };
    }

    return {
      isLoaded: true,
      sessions: clientCtx.value.sessions,
      setActive: clerk.value!.setActive,
    };
  });

  return toComputedRefs(result);
};
