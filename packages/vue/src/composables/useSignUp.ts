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
