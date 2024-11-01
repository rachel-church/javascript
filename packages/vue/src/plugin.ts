import { deriveState } from '@clerk/shared/deriveState';
import { loadClerkJsScript, type LoadClerkJsScriptOptions } from '@clerk/shared/loadClerkJsScript';
import type { Clerk, ClientResource, Resources } from '@clerk/types';
import type { Plugin } from 'vue';
import { computed, ref, shallowRef } from 'vue';

import type { VueClerkInjectionKeyType } from './types';
import { VueClerkInjectionKey } from './types';

export type PluginOptions = LoadClerkJsScriptOptions;

export const clerkPlugin: Plugin = {
  install(app, options: PluginOptions) {
    // @ts-expect-error: Internal property for SSR frameworks like Nuxt
    const { __internal_clerk_initial_state } = options;

    const loaded = ref(false);
    const clerk = ref<Clerk | null>(null);

    const resources = shallowRef<Resources>({
      client: {} as ClientResource,
      session: undefined,
      user: undefined,
      organization: undefined,
    });

    // We need this check for Nuxt as it will try to run this code on the server
    // and loadClerkJsScript contains browser-specific code
    if (typeof window !== 'undefined') {
      void loadClerkJsScript(options).then(async () => {
        clerk.value = window.Clerk;
        await window.Clerk.load(options);
        loaded.value = true;

        clerk.value.addListener(payload => {
          resources.value = payload;
        });
      });
    }

    const derivedState = computed(() => deriveState(loaded.value, resources.value, __internal_clerk_initial_state));

    const authCtx = computed(() => {
      const { sessionId, userId, orgId, actor, orgRole, orgSlug, orgPermissions } = derivedState.value;
      return { sessionId, userId, actor, orgId, orgRole, orgSlug, orgPermissions };
    });
    const clientCtx = computed(() => resources.value.client);
    const userCtx = computed(() => derivedState.value.user);
    const sessionCtx = computed(() => derivedState.value.session);
    const organizationCtx = computed(() => derivedState.value.organization);

    app.provide<VueClerkInjectionKeyType>(VueClerkInjectionKey, {
      clerk,
      loaded,
      authCtx,
      clientCtx,
      sessionCtx,
      userCtx,
      organizationCtx,
    });
  },
};
