import * as Preact from 'preact';

import Title from '../components/title';

export default class Button extends Preact.Component {
  public render() {
    return (
      <main>
        <Title url="https://material.io/components/buttons/">BCE Button</Title>

        <h4>Contained</h4>
        <div>
          <bce-button>Primary</bce-button>
          <bce-button color="secondary">Secondary</bce-button>
          <bce-button color="tertiary">Tertiary</bce-button>
          <bce-button disabled={true}>Disabled</bce-button>
          <br />
          <bce-button icon="square"></bce-button>
          <bce-button icon="square" color="secondary">
            Icon
          </bce-button>
          <bce-button icon="square" disabled={true}>
            Disabled Icon
          </bce-button>
        </div>

        <h4>Outline</h4>
        <div>
          <bce-button design="outline">Primary</bce-button>
          <bce-button design="outline" color="secondary">
            Secondary
          </bce-button>
          <bce-button design="outline" color="tertiary">
            Tertiary
          </bce-button>
          <bce-button design="outline" disabled={true}>
            Disabled
          </bce-button>
          <br />
          <bce-button design="outline" icon="square"></bce-button>
          <bce-button design="outline" icon="square" color="secondary">
            Icon
          </bce-button>
          <bce-button design="outline" icon="square" disabled={true}>
            Disabled Icon
          </bce-button>
        </div>

        <h4>Text</h4>
        <div>
          <bce-button design="text">Primary</bce-button>
          <bce-button design="text" color="secondary">
            Secondary
          </bce-button>
          <bce-button design="text" color="tertiary">
            Tertiary
          </bce-button>
          <bce-button design="text" disabled={true}>
            Disabled
          </bce-button>
          <br />
          <bce-button design="text" icon="square"></bce-button>
          <bce-button design="text" icon="square" color="secondary">
            Icon
          </bce-button>
          <bce-button design="text" icon="square" disabled={true}>
            Disabled Icon
          </bce-button>
        </div>

        <h4>Block</h4>
        <div>
          <bce-button block={true} design="contained" color="primary">
            Contained
          </bce-button>
          <bce-button block={true} design="outline" color="tertiary">
            Outline
          </bce-button>
          <bce-button block={true} design="text" color="secondary">
            Text
          </bce-button>

          <bce-button block={true} design="contained" color="secondary" icon="square">
            Contained + Icon
          </bce-button>
          <bce-button block={true} design="outline" icon="square" color="primary">
            Outline + Icon
          </bce-button>
          <bce-button block={true} design="text" icon="square" color="tertiary">
            Text + Icon
          </bce-button>
        </div>

        <bce-fab info="bce-fab[info]" color="dark">
          <bce-button>Option A</bce-button>
          <bce-button>Option B</bce-button>
          <bce-button>Option C</bce-button>
        </bce-fab>
      </main>
    );
  }
}
