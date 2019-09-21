import { h } from 'preact';

export const Home = () => (
  <main>
    <h3 id="switch">BCE Switch</h3>
    <div>
      <bce-switch value={true}></bce-switch>
      <bce-switch value={true} color="secondary"></bce-switch>
      <bce-switch value={true} color="tertiary"></bce-switch>
    </div>
    <div>
      <bce-switch value={true} color="success"></bce-switch>
      <bce-switch value={true} color="error"></bce-switch>
      <bce-switch value={true} color="warning"></bce-switch>
      <bce-switch value={true} color="info"></bce-switch>
    </div>
    <div>
      <bce-switch value={true} color="dark"></bce-switch>
      <bce-switch value={true} color="light"></bce-switch>
    </div>

    <h3 id="button">BCE Button</h3>
    <h4>Contained</h4>
    <div>
      <bce-button>Primary</bce-button>
      <bce-button color="secondary">Secondary</bce-button>
      <bce-button color="tertiary">Tertiary</bce-button>
      <bce-button icon="square">Icon</bce-button>
      <bce-button disabled>Disabled</bce-button>
      <bce-button icon="square" icon-only></bce-button>
    </div>
    <br />
    <h4>Outline</h4>
    <div>
      <bce-button type="outline">Primary</bce-button>
      <bce-button type="outline" color="secondary">
        Secondary
      </bce-button>
      <bce-button type="outline" color="tertiary">
        Tertiary
      </bce-button>
      <bce-button type="outline" icon="square">
        Icon
      </bce-button>
      <bce-button type="outline" disabled>
        Disabled
      </bce-button>
      <bce-button type="outline" icon="square" icon-only></bce-button>
    </div>
    <br />
    <h4>Text</h4>
    <div>
      <bce-button type="text">Primary</bce-button>
      <bce-button type="text" color="secondary">
        Secondary
      </bce-button>
      <bce-button type="text" color="tertiary">
        Tertiary
      </bce-button>
      <bce-button type="text" icon="square">
        Icon
      </bce-button>
      <bce-button type="text" disabled>
        Disabled
      </bce-button>
      <bce-button type="text" icon="square" icon-only></bce-button>
    </div>
    <h4>Block</h4>
    <div>
      <bce-button color="tertiary" block>
        Contained
      </bce-button>
      <bce-button icon="square" block>
        Contained + Icon
      </bce-button>
      <bce-button type="outline" color="tertiary" block>
        Outline
      </bce-button>
      <bce-button type="outline" icon="square" block>
        Outline + Icon
      </bce-button>
      <bce-button type="text" color="tertiary" block>
        Text
      </bce-button>
      <bce-button type="text" icon="square" block>
        Text + Icon
      </bce-button>
    </div>
  </main>
);

export default Home;
