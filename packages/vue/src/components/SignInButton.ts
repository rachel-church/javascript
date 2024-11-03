import type { SignInProps } from '@clerk/types';
import { defineComponent } from 'vue';

import { useClerk } from '../composables/useClerk';
import { createUnstyledButton } from './utils';

type SignInButtonProps = Pick<
  SignInProps,
  'fallbackRedirectUrl' | 'forceRedirectUrl' | 'signUpForceRedirectUrl' | 'signUpFallbackRedirectUrl'
>;

export const SignInButton = defineComponent(
  (
    props: SignInButtonProps & {
      mode?: 'modal' | 'redirect';
    },
    { slots, attrs },
  ) => {
    const clerk = useClerk();

    function clickHandler() {
      const { mode, ...opts } = props;

      if (mode === 'modal') {
        return clerk.value?.openSignIn(opts);
      }

      void clerk.value?.redirectToSignIn({
        ...opts,
        signInFallbackRedirectUrl: props.fallbackRedirectUrl,
        signInForceRedirectUrl: props.forceRedirectUrl,
      });
    }

    return () =>
      createUnstyledButton(slots, {
        name: 'SignInButton',
        attrs,
        defaultText: 'Sign in',
        onClick: clickHandler,
      });
  },
  {
    props: ['signUpForceRedirectUrl', 'signUpFallbackRedirectUrl', 'fallbackRedirectUrl', 'forceRedirectUrl', 'mode'],
  },
);
