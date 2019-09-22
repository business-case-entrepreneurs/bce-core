import { File } from '@bcase/core';
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class ViewOther extends Vue {
  private action1() {
    this.$bce.message('Action 1');
  }

  private action2() {
    this.$bce.message('Action 2');
  }

  private action3() {
    this.$bce.message('Action 3');
  }

  private action4() {
    this.$bce.message('Action 4');
  }

  private async scriptedFile() {
    const button = document.createElement('bce-upload-button');
    button.multiple = true;

    const event = await this.$bce.execute<CustomEvent<File[]>>(button, res => {
      button.addEventListener('file', e => res(e as CustomEvent<File[]>));
      button.upload();
    });

    this.handleFile(event);
  }

  private handleFile(event: CustomEvent<File[]>) {
    this.$bce.message('File data in developer console.');

    for (const file of event.detail) {
      console.groupCollapsed('file-upload: ' + file.name);
      console.log('id', file.id);
      console.log('type', file.type);
      console.log(file);
      console.groupEnd();
    }
  }

  render() {
    return (
      <main>
        <h3>BCE Dropdown Menu</h3>
        <bce-dropdown-menu color="dark">
          <bce-button icon="square" onClick={this.action1}>
            Action 1
          </bce-button>
          <bce-button icon="square" onClick={this.action2}>
            Action 2
          </bce-button>
          <bce-button icon="square" onClick={this.action3}>
            Action 3
          </bce-button>
          <bce-button icon="square" onClick={this.action4}>
            Action 4
          </bce-button>
        </bce-dropdown-menu>

        <h3>BCE upload</h3>
        <bce-button type="text" onClick={this.scriptedFile}>
          Scripted
        </bce-button>
        <bce-upload-button multiple onFile={this.handleFile}>
          Upload Button
        </bce-upload-button>
      </main>
    );
  }
}
