import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/vue';
import { defineComponent, h, ref } from 'vue';

import { SignInButton } from '../SignInButton';

const mockRedirectToSignIn = jest.fn();
const originalError = console.error;

jest.mock('../../composables/useClerk', () => ({
  useClerk: () =>
    ref({
      redirectToSignIn: mockRedirectToSignIn,
    }),
}));

const url = 'https://www.clerk.com';

describe('<SignInButton />', () => {
  beforeAll(() => {
    console.error = jest.fn();
  });

  beforeEach(() => {
    mockRedirectToSignIn.mockReset();
  });

  afterAll(() => {
    console.error = originalError;
  });

  it('calls clerk.redirectToSignIn when clicked', async () => {
    render(SignInButton);
    const btn = screen.getByText('Sign in');
    await userEvent.click(btn);
    expect(mockRedirectToSignIn).toHaveBeenCalled();
  });

  it('handles forceRedirectUrl prop', async () => {
    render(SignInButton, {
      props: {
        forceRedirectUrl: url,
      },
    });
    const btn = screen.getByText('Sign in');
    await userEvent.click(btn);

    expect(mockRedirectToSignIn).toHaveBeenCalledWith({ forceRedirectUrl: url, signInForceRedirectUrl: url });
  });

  it('handles fallbackRedirectUrl prop', async () => {
    render(SignInButton, {
      props: {
        fallbackRedirectUrl: url,
      },
    });
    const btn = screen.getByText('Sign in');
    await userEvent.click(btn);

    expect(mockRedirectToSignIn).toHaveBeenCalledWith({
      fallbackRedirectUrl: url,
      signInFallbackRedirectUrl: url,
    });
  });

  it('renders passed button and calls both click handlers', async () => {
    const handler = jest.fn();

    const Button = defineComponent(() => {
      return () => h(SignInButton, {}, () => h('button', { onClick: handler, type: 'button' }, 'custom button'));
    });

    render(Button);

    const btn = screen.getByText('custom button');
    await userEvent.click(btn);

    expect(handler).toHaveBeenCalled();
    expect(mockRedirectToSignIn).toHaveBeenCalled();
  });

  it('uses text passed as children', async () => {
    const Button = defineComponent(() => {
      return () => h(SignInButton, () => 'text');
    });
    render(Button);
    screen.getByText('text');
  });
});
