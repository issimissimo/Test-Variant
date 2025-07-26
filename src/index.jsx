import { loadConfig } from './config';
import { render } from 'solid-js/web'
import '@fortawesome/fontawesome-free/css/all.css';
import App from './app.jsx'


loadConfig().then(() => {
  render(() => <App />, document.getElementById('app'))
})