<template>
  <bce-root>
    <bce-status-bar color="dark" />
    <bce-header color="dark">
      <router-link to="/">BCE Core</router-link>
      <bce-menu>
        <router-link to="/">Home</router-link>
        <router-link to="/button">Button</router-link>
        <router-link to="/input">Input</router-link>
        <router-link to="/message">Message</router-link>
        <router-link to="/other">Other</router-link>
      </bce-menu>
      <bce-menu-button></bce-menu-button>
    </bce-header>

    <bce-menu vertical right toggle-desktop>
      <router-link to="/">Home</router-link>
      <router-link to="/button">Button</router-link>
      <router-link to="/input">Input</router-link>
      <router-link to="/message">Message</router-link>
      <router-link to="/other">Other</router-link>
    </bce-menu>

    <router-view />
  </bce-root>
</template>

<style lang="scss">
html,
body {
  height: 100%;
  width: 100%;
  padding: 0;
  margin: 0;
}

bce-root {
  display: grid;
  grid-template-columns: 1fr auto;
  grid-template-rows: auto auto 1fr;
  grid-template-areas:
    'stat stat'
    'head head'
    'main menu';
  height: 100vh;
  background-color: var(--bce-color-light-n);

  bce-status-bar {
    grid-area: stat;
  }

  bce-header {
    grid-area: head;
  }

  bce-menu {
    grid-area: menu;
  }

  main {
    grid-area: main;
    position: relative;
    padding: 1rem 1rem 82px;
    height: 100%;
    width: 100%;
    overflow-x: hidden;
  }
}

bce-header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  a {
    text-decoration: none;
    color: inherit;
    padding: 16px;
    font-size: 20px;
  }
}

bce-button {
  margin: 2.5px;
}
</style>
