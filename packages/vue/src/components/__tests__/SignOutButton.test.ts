import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/vue';
import { defineComponent, h, ref } from 'vue';

import { SignOutButton } from '../SignOutButton';

const mockSignOut = jest.fn();
const originalError = console.error;

jest.mock('../../composables/useClerk', () => ({
  useClerk: () =>
    ref({
      signOut: mockSignOut,
    }),
}));

describe('<SignOutButton />', () => {
  beforeAll(() => {
    console.error = jest.fn();
  });

  beforeEach(() => {
    mockSignOut.mockReset();
  });

  afterAll(() => {
    console.error = originalError;
  });

  it('calls clerk.signOutOne when clicked', async () => {
    render(SignOutButton);
    const btn = screen.getByText('Sign out');
    await userEvent.click(btn);

    expect(mockSignOut).toHaveBeenCalled();
  });

  it('uses text passed as children', async () => {
    const Button = defineComponent(() => {
      return () => h(SignOutButton, () => 'text');
    });
    render(Button);
    screen.getByText('text');
  });
});
