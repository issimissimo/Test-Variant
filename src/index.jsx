import { loadConfig } from './config';
import { render } from 'solid-js/web'
import App from './app.jsx'

// const root = document.getElementById('root')

// render(() => <App />, root)

loadConfig().then(() => {
  render(() => <App />, document.getElementById('root'))
})