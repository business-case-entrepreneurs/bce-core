import { newE2EPage, E2EPage } from '@stencil/core/testing';
// import { Button } from './bce-button';

describe('Diff test', () => {
  it('render something', async () => {
    const page: E2EPage = await newE2EPage();
    await page.setContent('<bce-button>Test</bce-button>');

    // To start comparing the visual result, you first must run page.compareScreenshot; This will capture a screenshot, and save the file to "/screenshot/images". You'll be able to check that into your repo to provide those results to your team. You can only have one of these commands per test.
    const results = await page.compareScreenshot();

    // Finally, we can test against the previous screenshots.
    // Test against hard pixels
    expect(results).toMatchScreenshot({ allowableMismatchedPixels: 100 });

    // Test against the percentage of changes. if 'allowableMismatchedRatio' is above 20% changed,
    expect(results).toMatchScreenshot({ allowableMismatchedRatio: 1 });

    // await page.compareScreenshot(
    //   'My Componment (...is beautiful. Look at it!)',
    //   { fullPage: false }
    // );
  });
});
