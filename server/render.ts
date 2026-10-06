import { createElement, type ComponentType } from "react";
import { render } from "@react-email/render";

import type { EmailModel } from "../models/email";

/** Renders a template from its model, as HTML and as the plain-text part. */
export async function renderEmail<Content>(
  Component: ComponentType<EmailModel<Content>>,
  model: EmailModel<Content>,
): Promise<{ html: string; text: string }> {
  const element = createElement(Component, model);
  return {
    html: await render(element),
    text: await render(element, { plainText: true }),
  };
}
