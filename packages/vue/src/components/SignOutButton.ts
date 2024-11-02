import type { SignOutOptions } from '@clerk/types';
import { defineComponent } from 'vue';

import { useClerk } from '../composables/useClerk';
import { createUnstyledButton } from './utils';

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
    void clerk.value?.signOut(signOutOptions);
  }

  return () =>
    createUnstyledButton(slots, {
      attrs,
      defaultText: 'Sign out',
      onClick: clickHandler,
    });
});
