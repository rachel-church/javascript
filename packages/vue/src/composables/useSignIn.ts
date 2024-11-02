import { eventMethodCalled } from '@clerk/shared/telemetry';
import type { SetActive, SignInResource } from '@clerk/types';
import { computed, watch } from 'vue';

import { useClerkContext } from './useClerkContext';
import type { ToComputedRefs } from './utils';
import { toComputedRefs } from './utils';

type UseSignInReturn =
  | { isLoaded: false; signIn: undefined; setActive: undefined }
  | { isLoaded: true; signIn: SignInResource; setActive: SetActive };

type UseSignIn = () => ToComputedRefs<UseSignInReturn>;

/**
 * Returns the current [`SignIn`](https://clerk.com/docs/references/javascript/sign-in/sign-in) object which provides
 * methods and state for managing the sign-in flow.
 *
 * @example
 * A simple example:
 *
 * <script setup>
 * import { useSignIn } from '@clerk/vue'
 *
 * const { isLoaded, signIn } = useSignIn()
 * </script>
 *
 * <template>
 *   <template v-if="!isLoaded">
 *     <!-- Handle loading state -->
 *   </template>
 *
 *   <template v-else>
 *     <div>The current sign in attempt status is {{ signIn.status }}.</div>
 *   </template>
 * </template>
 */
export const useSignIn: UseSignIn = () => {
  const { clerk, clientCtx } = useClerkContext();

  const unwatch = watch(clerk, value => {
    if (value) {
      value.telemetry?.record(eventMethodCalled('useSignIn'));
      unwatch();
    }
  });

  const result = computed<UseSignInReturn>(() => {
    if (!clientCtx.value) {
      return { isLoaded: false, signIn: undefined, setActive: undefined };
    }

    return {
      isLoaded: true,
      signIn: clientCtx.value.signIn,
      setActive: clerk.value!.setActive,
    };
  });

  return toComputedRefs(result);
};
