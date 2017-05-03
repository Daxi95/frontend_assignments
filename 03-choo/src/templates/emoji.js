// import choo's template helper
import html from 'choo/html'

import emoji from 'node-emoji'

//export module
module.exports = function (state, emit) {
  // create html template
  return html`
      <div class="container">
          <p>Dynamic Route ${emoji.get('coffee')} ${emoji.get('beer')} ${emoji.get('beers')}</p>
      </div>
    `
}
