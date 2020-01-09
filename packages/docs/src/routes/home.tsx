import * as Preact from 'preact';
import { Link } from 'preact-router';

import Preview from '../components/preview';

export default class Home extends Preact.Component {
  public render() {
    return (
      <main>
        <ul>
          <li>
            <Link href="/button">Button</Link>
          </li>
          <li>
            <Link href="/chip">Chip</Link>
          </li>
          <li>
            <Link href="/input">Input</Link>
          </li>
          <li>
            <Link href="/select">Select</Link>
          </li>
          <li>
            <Link href="/switch">Switch</Link>
          </li>
        </ul>

        <Preview src="/input" />
      </main>
    );
  }
}
