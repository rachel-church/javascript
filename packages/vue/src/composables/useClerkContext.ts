import { inject } from 'vue';

import { VueClerkInjectionKey, type VueClerkInjectionKeyType } from '../types';

export function useClerkContext() {
  const ctx = inject<VueClerkInjectionKeyType>(VueClerkInjectionKey);

  if (!ctx) {
    throw new Error(
      'This composable can only be used when the Vue Clerk plugin is installed. Learn more: https://vue-clerk.com/plugin',
    );
  }

  return ctx;
}
