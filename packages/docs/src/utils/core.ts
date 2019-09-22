import { PluginFunction } from 'vue';
import { Component, Vue } from 'vue-property-decorator';

@Component
export class CoreMixin extends Vue {
  public get $bce() {
    return this.$root.$el as HTMLBceRootElement;
  }
}

const install: PluginFunction<{}> = _Vue => {
  _Vue.mixin(CoreMixin);
};

export default { install, CoreMixin };
