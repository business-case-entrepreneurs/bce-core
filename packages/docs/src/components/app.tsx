import { h, Component } from 'preact';
import { Router, Link } from 'preact-router';

import { AppHeader } from './app-header';

// Code-splitting is automated for routes
import { Home } from '../routes/home';
import { Switch } from '../routes/switch';
// import Profile from '../routes/profile';

export default class App extends Component {
  render() {
    return (
      <bce-root>
        <bce-status-bar color="dark" />
        <AppHeader />

        <bce-menu right toggle-desktop>
          <Link href="/">Home</Link>
          <Link href="/bce-button">Button</Link>
          <Link href="/bce-switch">Switch</Link>
        </bce-menu>

        <Router>
          <Home path="/" />
          <Switch path="/bce-switch" />
        </Router>
      </bce-root>
    );
  }
}
