import {
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
        <BceStatusBar />
        <BceHeader>
          <BceNavButton />
        </BceHeader>

        <BceSideBar open={false} />

        <main>
          <section>
            <BceCode content={this.code} language="html" />
          </section>
        </main>
      </BceRoot>
    );
  }
}

export default App;
