import { setClerkJsLoadingErrorPackageName } from '@clerk/shared/loadClerkJsScript';

setClerkJsLoadingErrorPackageName(PACKAGE_NAME);

export * from './components';
export * from './composables';

export { clerkPlugin } from './plugin';
