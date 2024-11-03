import { h, type Slots, Text, type VNode } from 'vue';

import { errorThrower } from '../errors/errorThrower';
import { multipleChildrenInButtonComponent } from '../errors/messages';

type ButtonName = 'SignInButton' | 'SignUpButton' | 'SignOutButton' | 'SignInWithMetamaskButton';

interface CreateUnstyledButtonOptions {
  name: ButtonName;
  attrs?: Record<string, any>;
  onClick: (event: MouseEvent) => void;
  defaultText: string;
}

/**
 * Create a button element with flexible content handling.
 *
 * @returns A VNode that can be either:
 * - A button with default text if no slot content
 * - A button with the provided text if slot contains text
 * - The provided element (e.g. button, div) with click handler if slot contains an element
 */
export const createUnstyledButton = (slots: Slots, options: CreateUnstyledButtonOptions) => {
  const { onClick, attrs = {}, defaultText } = options;
  const slotContent = slots.default?.();

  // If no slot content, render a button with default text
  if (!slotContent) {
    return h(
      'button',
      {
        ...attrs,
        onClick,
      },
      defaultText,
    );
  }

  const child = assertSingleChild(slotContent, options.name);

  // If it's a text node, use it as button text
  if (child.type === Text) {
    return h(
      'button',
      {
        ...attrs,
        onClick,
      },
      slotContent,
    );
  }

  // If it's an element, use it directly with our click handler
  return h(child, {
    onClick,
  });
};

const assertSingleChild = (slotContent: VNode[], name: ButtonName): VNode => {
  if (slotContent.length > 1) {
    return errorThrower.throw(multipleChildrenInButtonComponent(name));
  }

  return slotContent[0];
};
