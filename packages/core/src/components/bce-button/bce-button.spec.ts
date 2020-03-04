import { newSpecPage, SpecPage } from '@stencil/core/testing';
import { Button } from './bce-button';

describe('Testing bce-button', () => {
  let page: SpecPage;

  it('builds', () => {
    expect(new Button()).toBeTruthy();
  });

  beforeEach(async () => {
    page = await newSpecPage({
      components: [Button],
      html: `<bce-button></bce-button>`
    });
  });

  it('render bce-button', async () => {
    page = await newSpecPage({
      components: [Button],
      html: `<bce-button></bce-button>`
    });
    expect(page.root).toMatchSnapshot();
  });
});
