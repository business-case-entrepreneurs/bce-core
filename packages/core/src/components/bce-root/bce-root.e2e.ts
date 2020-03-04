import { newE2EPage, E2EPage } from '@stencil/core/testing';

describe('Diff test', () => {
  it('render something', async () => {
    const page: E2EPage = await newE2EPage();
    await page.setContent('<my-cmp></my-cmp');
    await page.compareScreenshot(
      'My Componment (...is beautiful. Look at it!)',
      { fullPage: false }
    );
  });
});
