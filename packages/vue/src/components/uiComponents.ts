import type {
  CreateOrganizationProps,
  GoogleOneTapProps,
  OrganizationListProps,
  OrganizationProfileProps,
  OrganizationSwitcherProps,
  SignInProps,
  SignUpProps,
  UserButtonProps,
  UserProfileProps,
} from '@clerk/types';
import { defineComponent, h, ref, watchEffect } from 'vue';

import { useClerk } from '../composables/useClerk';
import { useClerkContext } from '../composables/useClerkContext';

type AnyObject = Record<string, any>;

interface MountProps {
  mount?: (node: HTMLDivElement, props: AnyObject) => void;
  unmount?: (node: HTMLDivElement) => void;
  props?: AnyObject;
}

const UIPortal = defineComponent((props: MountProps) => {
  const el = ref<HTMLDivElement | null>(null);
  const { loaded } = useClerkContext();

  watchEffect(onInvalidate => {
    if (!loaded.value) {
      return;
    }

    if (el.value) {
      props.mount?.(el.value, props.props || {});
    }

    onInvalidate(() => {
      if (el.value) {
        props.unmount?.(el.value);
      }
    });
  });

  return () => h('div', { ref: el });
});

export const UserProfile = defineComponent((props: UserProfileProps) => {
  const clerk = useClerk();
  return () =>
    h(UIPortal, {
      mount: clerk.value?.mountUserProfile,
      unmount: clerk.value?.unmountUserProfile,
      props,
    });
});

export const UserButton = defineComponent((props: UserButtonProps) => {
  const clerk = useClerk();
  return () =>
    h(UIPortal, {
      mount: clerk.value?.mountUserButton,
      unmount: clerk.value?.mountUserProfile,
      props,
    });
});

export const GoogleOneTap = defineComponent((props: GoogleOneTapProps) => {
  const clerk = useClerk();
  return () =>
    h(UIPortal, {
      mount: () => clerk.value?.openGoogleOneTap(props),
      unmount: clerk.value?.closeGoogleOneTap,
    });
});

export const SignIn = defineComponent((props: SignInProps) => {
  const clerk = useClerk();
  return () =>
    h(UIPortal, {
      mount: clerk.value?.mountSignIn,
      unmount: clerk.value?.unmountSignIn,
      props,
    });
});

export const SignUp = defineComponent((props: SignUpProps) => {
  const clerk = useClerk();
  return () =>
    h(UIPortal, {
      mount: clerk.value?.mountSignUp,
      unmount: clerk.value?.unmountSignUp,
      props,
    });
});

export const CreateOrganization = defineComponent((props: CreateOrganizationProps) => {
  const clerk = useClerk();
  return () =>
    h(UIPortal, {
      mount: clerk.value?.mountCreateOrganization,
      unmount: clerk.value?.unmountCreateOrganization,
      props,
    });
});

export const OrganizationSwitcher = defineComponent((props: OrganizationSwitcherProps) => {
  const clerk = useClerk();
  return () =>
    h(UIPortal, {
      mount: clerk.value?.mountOrganizationSwitcher,
      unmount: clerk.value?.unmountOrganizationSwitcher,
      props,
    });
});

export const OrganizationList = defineComponent((props: OrganizationListProps) => {
  const clerk = useClerk();
  return () =>
    h(UIPortal, {
      mount: clerk.value?.mountOrganizationList,
      unmount: clerk.value?.unmountOrganizationList,
      props,
    });
});

export const OrganizationProfile = defineComponent((props: OrganizationProfileProps) => {
  const clerk = useClerk();
  return () =>
    h(UIPortal, {
      mount: clerk.value?.mountOrganizationProfile,
      unmount: clerk.value?.unmountOrganizationProfile,
      props,
    });
});
