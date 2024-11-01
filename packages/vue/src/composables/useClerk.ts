import { useClerkContext } from './useClerkContext';

export function useClerk() {
  const { clerk } = useClerkContext();

  return clerk;
}
