import { useClerkContext } from './useClerkContext';

export const useClerk = () => {
  const { clerk } = useClerkContext();

  return clerk;
};
