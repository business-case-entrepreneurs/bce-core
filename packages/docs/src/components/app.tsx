import * as Preact from 'preact';
import { Route, Router, RouterOnChangeArgs } from 'preact-router';

import Button from '../routes/button';
import Chip from '../routes/chip';
import Home from '../routes/home';
import Input from '../routes/input';
import Select from '../routes/select';
import Switch from '../routes/switch';

export default class App extends Preact.Component {
  private currentURL = '';

  public render() {
    return (
      <bce-root id="app">
        <bce-status-bar></bce-status-bar>
        <bce-header></bce-header>

        <Router onChange={this.handleRoute}>
          <Route path="/" component={Home} />
          <Route path="/button" component={Button} />
          <Route path="/chip" component={Chip} />
          <Route path="/input" component={Input} />
          <Route path="/select" component={Select} />
          <Route path="/switch" component={Switch} />
        </Router>
      </bce-root>
    );
  }

  private handleRoute = (e: RouterOnChangeArgs) => {
    this.currentURL = e.url;
    e.router;
  };
}
