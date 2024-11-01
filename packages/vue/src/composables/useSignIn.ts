import { eventMethodCalled } from '@clerk/shared/telemetry';
import type { SetActive, SignInResource } from '@clerk/types';
import { computed, watch } from 'vue';

import type { ToComputedRefs } from '../utils';
import { toComputedRefs } from '../utils';
import { useClerkContext } from './useClerkContext';

type UseSignInReturn =
  | { isLoaded: false; signIn: undefined; setActive: undefined }
  | { isLoaded: true; signIn: SignInResource; setActive: SetActive };

export function useSignIn(): ToComputedRefs<UseSignInReturn> {
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
}
