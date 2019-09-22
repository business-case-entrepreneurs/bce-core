<template>
  <main>
    <h3>BCE Input</h3>
    <bce-form>
      <bce-input
        label="Username"
        tooltip="bce-tooltip"
        info="What's your name?"
        v-input="data.username"
      />

      <bce-input
        type="password"
        label="Password"
        tooltip="bce-tooltip"
        placeholder="**********"
        info="This should be a value only you know..."
        v-input="data.password"
      />

      <bce-input
        type="number"
        label="OTP code"
        info="The One Time Password code."
        disabled
        v-input="data.otp"
      />

      <bce-input
        type="textarea"
        label="Description"
        placeholder="Placeholder textarea"
        info="Provide a description"
        :min="80"
        v-input="data.description"
      />

      <bce-input type="dropdown" label="Dropdown" v-input="data.dropdown">
        <bce-option v-for="option of dropdown" :key="option[0]" :value="option[0]">{{option[1]}}</bce-option>
      </bce-input>

      <bce-input type="checkbox" label="Checkbox" v-input="data.checkbox">
        <bce-option value="A">Option A</bce-option>
        <bce-option value="B">Option B</bce-option>
        <bce-option value="C">Option C</bce-option>
      </bce-input>

      <bce-input type="radio" label="Radio" v-input="data.radio">
        <bce-option value="A">Option A</bce-option>
        <bce-option value="B">Option B</bce-option>
        <bce-option value="C">Option C</bce-option>
      </bce-input>

      <bce-input type="switch" label="Switch" v-input="data.switch" />

      <bce-input type="container" label="Code">
        <bce-code-editor :value="data.code" v-input="data.code" />
      </bce-input>

      <pre><code>{{data}}</code></pre>
    </bce-form>

    <h3>BCE Slider</h3>
    <bce-slider :min="1" :max="200" />

    <h3>BCE Switch</h3>
    <bce-switch :value="true" />
    <bce-switch :value="true" color="secondary" />
    <bce-switch :value="true" color="tertiary" />

    <br />
    <bce-switch :value="true" color="success" />
    <bce-switch :value="true" color="error" />
    <bce-switch :value="true" color="warning" />
    <bce-switch :value="true" color="info" />

    <br />
    <bce-switch :value="true" color="dark" />
    <bce-switch :value="true" color="light" />
  </main>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";

@Component
export default class ViewInput extends Vue {
  private data = {
    username: "my-username",
    password: "",
    otp: 1234,
    description: "",
    dropdown: "washington",
    checkbox: ["A", "B"],
    radio: "A",
    switch: true,
    code: [
      "/**",
      " * Main function.",
      " */",
      "function main() {",
      "  console.log('Hello World!');",
      "}"
    ].join("\n")
  };

  private checkbox: string[] = ["A"];

  private dropdown: [string, string][] = [
    ["alabama", "Alabama"],
    ["alaska", "Alaska"],
    ["arizona", "Arizona"],
    ["arkansas", "Arkansas"],
    ["california", "California"],
    ["colorado", "Colorado"],
    ["connecticut", "Connecticut"],
    ["delaware", "Delaware"],
    ["florida", "Florida"],
    ["georgia", "Georgia"],
    ["hawaii", "Hawaii"],
    ["idaho", "Idaho"],
    ["illinois", "Illinois"],
    ["indiana", "Indiana"],
    ["iowa", "Iowa"],
    ["kansas", "Kansas"],
    ["kentucky", "Kentucky"],
    ["louisiana", "Louisiana"],
    ["maine", "Maine"],
    ["maryland", "Maryland"],
    ["massachusetts", "Massachusetts"],
    ["michigan", "Michigan"],
    ["minnesota", "Minnesota"],
    ["mississippi", "Mississippi"],
    ["missouri", "Missouri"],
    ["montana", "Montana"],
    ["nebraska", "Nebraska"],
    ["nevada", "Nevada"],
    ["new-hampshire", "New Hampshire"],
    ["new-jersey", "New Jersey"],
    ["new-mexico", "New Mexico"],
    ["new-york", "New York"],
    ["north-carolina", "North Carolina"],
    ["north-dakota", "North Dakota"],
    ["ohio", "Ohio"],
    ["oklahoma", "Oklahoma"],
    ["oregon", "Oregon"],
    ["pennsylvania", "Pennsylvania"],
    ["rhode-island", "Rhode Island"],
    ["south-carolina", "South Carolina"],
    ["south-dakota", "South Dakota"],
    ["tennessee", "Tennessee"],
    ["texas", "Texas"],
    ["utah", "Utah"],
    ["vermont", "Vermont"],
    ["virginia", "Virginia"],
    ["washington", "Washington"],
    ["west-virginia", "West Virginia"],
    ["wisconsin", "Wisconsin"],
    ["wyoming", "Wyoming"]
  ];
}
</script>
