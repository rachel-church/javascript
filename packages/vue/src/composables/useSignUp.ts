import { eventMethodCalled } from '@clerk/shared/telemetry';
import type { SetActive, SignUpResource } from '@clerk/types';
import { computed, watch } from 'vue';

import type { ToComputedRefs } from '../utils';
import { toComputedRefs } from '../utils';
import { useClerkContext } from './useClerkContext';

type UseSignUpReturn =
  | { isLoaded: false; signUp: undefined; setActive: undefined }
  | { isLoaded: true; signUp: SignUpResource; setActive: SetActive };

type UseSignUp = () => ToComputedRefs<UseSignUpReturn>;

/**
 * Returns the current [`SignUp`](https://clerk.com/docs/references/javascript/sign-up/sign-up) object which provides
 * methods and state for managing the sign-up flow.
 *
 * @example
 * A simple example:
 *
 * <script setup>
 * import { useSignUp } from '@clerk/vue'
 *
 * const { isLoaded, signUp } = useSignUp()
 * </script>
 *
 * <template>
 *   <template v-if="!isLoaded">
 *     <!-- Handle loading state -->
 *   </template>
 *
 *   <template v-else>
 *     <div>The current sign-up attempt status is {{ signUp.status }}.</div>
 *   </template>
 * </template>
 */
export const useSignUp: UseSignUp = () => {
  const { clerk, clientCtx } = useClerkContext();

  const unwatch = watch(clerk, value => {
    if (value) {
      value.telemetry?.record(eventMethodCalled('useSignUp'));
      unwatch();
    }
  });

  const result = computed<UseSignUpReturn>(() => {
    if (!clientCtx.value) {
      return { isLoaded: false, signUp: undefined, setActive: undefined };
    }

    return {
      isLoaded: true,
      signUp: clientCtx.value.signUp,
      setActive: clerk.value!.setActive,
    };
  });

  return toComputedRefs(result);
};
