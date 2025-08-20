import { loadConfig } from './js/config';
import { render } from 'solid-js/web'
import Main from './main.jsx'


loadConfig().then(() => {
  render(() => <Main />, document.getElementById('app'))
})