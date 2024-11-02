import type { SignOutOptions } from '@clerk/types';
import { defineComponent, h, Text } from 'vue';

import { useClerk } from '../composables/useClerk';

interface SignOutButtonProps {
  signOutOptions?: SignOutOptions;
  sessionId?: string;
  redirectUrl?: string;
}

export const SignOutButton = defineComponent((props: SignOutButtonProps, { slots, attrs }) => {
  const clerk = useClerk();

  function clickHandler() {
    const signOutOptions: SignOutOptions = {
      redirectUrl: props.signOutOptions?.redirectUrl ?? props.redirectUrl,
      sessionId: props.signOutOptions?.sessionId ?? props.sessionId,
    };
    return clerk.value?.signOut(signOutOptions);
  }

  return () => {
    const slotContent = slots.default?.();
    if (!slotContent) {
      return h(
        'button',
        {
          ...attrs,
          'data-testid': 'sign-out-btn',
          onClick: clickHandler,
        },
        'Sign out',
      );
    }

    const [firstChild] = slotContent;

    // If it's a text node, use it as button text
    if (firstChild.type === Text) {
      return h(
        'button',
        {
          ...attrs,
          'data-testid': 'sign-out-btn',
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
});
