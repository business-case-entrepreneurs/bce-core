import { newSpecPage } from '@stencil/core/testing';
import { Root } from './bce-root';

jest.mock('../../utils/uuid', () => {
  class UUID {
    public static v4(): string {
      return 'uidsgargrwthrt';
    }
  }
  return {
    UUID: UUID.v4()
  };
});

describe('testing bce-root', () => {
  it('builds', () => {
    expect(new Root()).toBeTruthy();
  });

  it('should render bce-root', async () => {
    const page = await newSpecPage({
      components: [Root],
      html: `<bce-root></bce-root>`
    });

    expect(page.root).toEqualHtml(`
    <bce-root id="agjkhgiureagerhgqh">
      <mock:shadow-root>
        <slot></slot>
      </mock:shadow-root>
    </bce-root>`);
  });
});
