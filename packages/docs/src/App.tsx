import './App.css';

import {
  BceButton,
  BceCode,
  BceHeader,
  BceNavButton,
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
      <>
        <BceStatusBar />
        <BceHeader>
          <BceNavButton />
        </BceHeader>

        <BceSideBar />

        <main style={{ padding: 16 }}>
          <BceCode value={this.code} language="html" />
          <br />

          <BceButton>Hello World!</BceButton>
        </main>
      </>
    );
  }
}

export default App;
