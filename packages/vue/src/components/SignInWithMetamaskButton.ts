import type { RedirectUrlProp } from '@clerk/types';
import { defineComponent } from 'vue';

import { useClerk } from '../composables/useClerk';
import { createUnstyledButton } from './utils';

export const SignInWithMetamaskButton = defineComponent(
  (
    props: RedirectUrlProp & {
      mode?: 'modal' | 'redirect';
    },
    { slots, attrs },
  ) => {
    const clerk = useClerk();

    function clickHandler() {
      void clerk.value?.authenticateWithMetamask({ redirectUrl: props.redirectUrl || undefined });
    }

    return () =>
      createUnstyledButton(slots, {
        name: 'SignInWithMetamaskButton',
        attrs,
        defaultText: 'Sign in with Metamask',
        onClick: clickHandler,
      });
  },
  {
    props: ['redirectUrl', 'mode'],
  },
);
