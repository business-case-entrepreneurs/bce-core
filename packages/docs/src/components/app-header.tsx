import { Component, h } from 'preact';
import { Link } from 'preact-router';

export class AppHeader extends Component {
  render() {
    return (
      <bce-header color="dark">
        <Link href="/">BCE Core</Link>
        <bce-menu-button></bce-menu-button>
      </bce-header>
    );
  }
}
