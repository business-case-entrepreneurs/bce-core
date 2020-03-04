jest.mock('../../utils/uuid');

import { newSpecPage, SpecPage } from '@stencil/core/testing';
import { Root } from './bce-root';

describe('Testing bce-root', () => {
  let page: SpecPage;

  it('builds', () => {
    expect(new Root()).toBeTruthy();
  });

  beforeEach(async () => {
    page = await newSpecPage({
      components: [Root],
      html: `<bce-root id="bce-root"></bce-root>`
    });
  });

  it('render bce-root with bce-root as id', async () => {
    expect(page.root).toEqualHtml(`
      <bce-root id="bce-root">
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </bce-root>`);
  });

  it('render bce-root bce-root with unique id', async () => {
    expect(page.root).toMatchSnapshot();
    expect(page.root!.id).toBeTruthy();
  });

  it('bce-root should render message', async () => {
    const bceRoot = page.root!;
    await bceRoot.message('test', { duration: 5, color: 'dark' });

    await page.waitForChanges();

    expect(page.root).toMatchSnapshot();
  });

  it('bce-root method execute resolves', async () => {
    const bceRoot = page.root!;
    let component = page.doc.createElement('test');
    bceRoot.appendChild(component);

    const fnTrue = function(res: any) {
      return res();
    };

    await bceRoot.execute(component, fnTrue);
    expect(bceRoot).resolves;
  });

  ///  todo check with rick
  // it('bce-root method execute rejects', async () => {
  //   const bceRoot = page.root!;
  //   let component = page.doc.createElement('test');
  //   bceRoot.appendChild(component);

  //   const fnFalse = function(_: any, rej: any) {
  //     return rej();
  //   };

  //   await bceRoot.execute(component, fnFalse);
  //   expect(bceRoot).toBeUndefined;
  // });
});
