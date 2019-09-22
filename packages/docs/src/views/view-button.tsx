import { Component, Vue } from 'vue-property-decorator';

@Component
export default class ViewButton extends Vue {
  render() {
    return (
      <main>
        <h3>BCE Button</h3>

        <h4>Contained</h4>
        <bce-button>Primary</bce-button>
        <bce-button color="secondary">Secondary</bce-button>
        <bce-button color="tertiary">Tertiary</bce-button>
        <bce-button icon="square">Icon</bce-button>
        <bce-button disabled>Disabled</bce-button>
        <bce-button icon="square" icon-only />

        <h4>Outline</h4>
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
        <bce-button type="outline" icon="square" icon-only />

        <h4>Text</h4>
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
        <bce-button type="text" icon="square" icon-only />

        <h4>Block</h4>
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

        <bce-fab color="dark">
          <bce-button>TODO</bce-button>
          <bce-button>animate</bce-button>
          <bce-button>floating</bce-button>
          <bce-button>action</bce-button>
          <bce-button>button</bce-button>
          <bce-button>(de)activation</bce-button>
        </bce-fab>
      </main>
    );
  }
}
