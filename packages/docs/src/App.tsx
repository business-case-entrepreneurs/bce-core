import {
  BceButton,
  BceCode,
  BceHeader,
  BceNavButton,
  BceRoot,
  BceSideBar,
  BceStatusBar
} from '@bcase/core-react';
import React from 'react';

class App extends React.Component {
  private code = [
    `<bce-root>`,
    `  <bce-status-bar></bce-status-bar>`,
    `  <bce-header>`,
    `    <bce-nav-button></bce-nav-button>`,
    `  </bce-header>`,
    ``,
    `  <bce-side-bar open="false"></bce-side-bar>`,
    ``,
    `  <main>`,
    `    <section>`,
    `      <bce-code content="..." language="html"></bce-code>`,
    `    </section>`,
    `  </main>`,
    `</bce-root>`
  ];

  render() {
    return (
      <BceRoot className="app">
        <BceStatusBar slot="header" />
        <BceHeader slot="header">
          <BceNavButton />
        </BceHeader>

        <BceSideBar slot="left" open={false} />

        <main>
          <section style={{ padding: 16 }}>
            <BceCode value={this.code} language="html" />
            <br />

            <BceButton>Hello World!</BceButton>
          </section>
        </main>
      </BceRoot>
    );
  }
}

export default App;
