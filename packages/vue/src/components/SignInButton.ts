import type { SignInProps } from '@clerk/types';
import { defineComponent, h, Text } from 'vue';

import { useClerk } from '../composables/useClerk';

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

      return clerk.value?.redirectToSignIn({
        ...opts,
        signInFallbackRedirectUrl: props.fallbackRedirectUrl,
        signInForceRedirectUrl: props.forceRedirectUrl,
      });
    }

    return () => {
      const slotContent = slots.default?.();
      if (!slotContent) {
        return h(
          'button',
          {
            ...attrs,
            'data-testid': 'sign-in-btn',
            onClick: clickHandler,
          },
          'Sign in',
        );
      }

      const [firstChild] = slotContent;

      // If it's a text node, use it as button text
      if (firstChild.type === Text) {
        return h(
          'button',
          {
            ...attrs,
            'data-testid': 'sign-in-btn',
            onClick: clickHandler,
          },
          slotContent,
        );
      }

      // If it's an element, use it directly with our click handler
      return h(firstChild, {
        onClick: clickHandler,
      });
    };
  },
);
