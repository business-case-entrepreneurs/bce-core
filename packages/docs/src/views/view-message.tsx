import { Component, Vue } from 'vue-property-decorator';

@Component
export default class ViewMessage extends Vue {
  private msgDefault() {
    this.$bce.message('Default Message!');
  }

  private msgPrimary() {
    this.$bce.message('Primary Message!', undefined, 'primary');
  }

  private msgSecondary() {
    this.$bce.message('Secondary Message!', undefined, 'secondary');
  }

  private msgTertiary() {
    this.$bce.message('Tertiary Message!', undefined, 'tertiary');
  }

  private msgSuccess() {
    this.$bce.message('Success Message!', undefined, 'success');
  }

  private msgError() {
    this.$bce.message('Error Message!', undefined, 'error');
  }

  private msgWarning() {
    this.$bce.message('Warning Message!', undefined, 'warning');
  }

  private msgInfo() {
    this.$bce.message('Info Message!', undefined, 'info');
  }

  private alert() {
    const title = 'Alert dialog';
    const message = 'Lorem ipsum dolor sit amet!';
    this.$bce.alert(title, message);
  }

  private async confirm() {
    const title = 'Confirm dialog';
    const message = 'Lorem ipsum dolor sit amet?';
    const options = { ok: 'Yes', cancel: 'Cancel' };

    const answer = await this.$bce.confirm(title, message, options);
    this.$bce.message('Answer: ' + answer);
  }

  render() {
    return (
      <main>
        <h3>BCE Message</h3>
        <bce-button type="text" color="dark" onClick={this.msgDefault}>
          Message
        </bce-button>

        <br />
        <bce-button type="text" color="primary" onClick={this.msgPrimary}>
          Primary
        </bce-button>
        <bce-button type="text" color="secondary" onClick={this.msgSecondary}>
          Secondary
        </bce-button>
        <bce-button type="text" color="tertiary" onClick={this.msgTertiary}>
          Tertiary
        </bce-button>

        <br />
        <bce-button type="text" color="success" onClick={this.msgSuccess}>
          Success
        </bce-button>
        <bce-button type="text" color="error" onClick={this.msgError}>
          Error
        </bce-button>
        <bce-button type="text" color="warning" onClick={this.msgWarning}>
          Warning
        </bce-button>
        <bce-button type="text" color="info" onClick={this.msgInfo}>
          Info
        </bce-button>

        <h3>BCE dialog</h3>
        <bce-button id="alert" onClick={this.alert}>
          Alert
        </bce-button>
        <bce-button id="confirm" color="secondary" onClick={this.confirm}>
          Confirm
        </bce-button>
      </main>
    );
  }
}
