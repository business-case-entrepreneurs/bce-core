import { newSpecPage, SpecPage } from '@stencil/core/testing';
import { Button } from './bce-button';

describe('Testing bce-button', () => {
  let page: SpecPage;

  beforeEach(async () => {
    page = await newSpecPage({
      components: [Button],
      html: `<bce-button></bce-button>`
    });
  });

  it('render bce-button', async () => {
    expect(page.root).toMatchSnapshot();
  });
});
