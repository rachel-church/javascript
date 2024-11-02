import type { SignUpProps } from '@clerk/types';
import { defineComponent, h, Text } from 'vue';

import { useClerk } from '../composables/useClerk';

type SignUpButtonProps = {
  unsafeMetadata?: SignUpUnsafeMetadata;
} & Pick<
  SignUpProps,
  'fallbackRedirectUrl' | 'forceRedirectUrl' | 'signInForceRedirectUrl' | 'signInFallbackRedirectUrl'
>;

export const SignUpButton = defineComponent(
  (
    props: SignUpButtonProps & {
      mode?: 'modal' | 'redirect';
    },
    { slots, attrs },
  ) => {
    const clerk = useClerk();

    function clickHandler() {
      const { mode, ...opts } = props;

      if (mode === 'modal') {
        return clerk.value?.openSignUp(opts);
      }

      return clerk.value?.redirectToSignUp({
        ...opts,
        signUpFallbackRedirectUrl: props.fallbackRedirectUrl,
        signUpForceRedirectUrl: props.forceRedirectUrl,
      });
    }

    return () => {
      const slotContent = slots.default?.();
      if (!slotContent) {
        return h(
          'button',
          {
            ...attrs,
            'data-testid': 'sign-up-btn',
            onClick: clickHandler,
          },
          'Sign up',
        );
      }

      const [firstChild] = slotContent;

      // If it's a text node, use it as button text
      if (firstChild.type === Text) {
        return h(
          'button',
          {
            ...attrs,
            'data-testid': 'sign-up-btn',
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
