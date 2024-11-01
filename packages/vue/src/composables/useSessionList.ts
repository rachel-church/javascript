import type { SessionResource, SetActive } from '@clerk/types';
import { computed } from 'vue';

import type { ToComputedRefs } from '../utils';
import { toComputedRefs } from '../utils';
import { useClerkContext } from './useClerkContext';

type UseSessionListReturn =
  | { isLoaded: false; sessions: undefined; setActive: undefined }
  | { isLoaded: true; sessions: SessionResource[]; setActive: SetActive };

type UseSessionList = () => ToComputedRefs<UseSessionListReturn>;

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
