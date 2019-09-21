import { h } from 'preact';

export const Switch = () => {
  return (
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
    </main>
  );
};
