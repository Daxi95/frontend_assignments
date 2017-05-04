// import choo's template helper
import html from 'choo/html'

import emoji from 'node-emoji'

import $ from 'jquery'

// import template
import characterTpl from './character.js'

//export module
module.exports = function (state, emit) {
  // create html template
  return html`
  <div class="container">
    <button onclick=${addAtRandPosition}>Add Random Character</button>
    <button onclick=${fightOrks}>Fight</button>
    <p>You can also click on the field to add/remove characters ${emoji.get('beers')}</p>
    <div class="field">
      <div class="grass" onclick=${add}></div>
      ${state.characters.map(characterMap)}
    </div>
    <h2>Ork Graveyard</h2>
    <div class="graveyard">
      ${state.deadcharacters.map((char) => characterTpl({type: char.type}))}
    </div>
  </div>
  `

  // map function
  function characterMap (obj, i) {
    return characterTpl(obj, i, remove)
  }

  // add new character to state
  function add (e) {
    var x = e.offsetX
    var y = e.offsetY
    var obj = {x: x, y: y}
    emit('addCharacter', obj)
  }

  // add new character by button click
  function addAtRandPosition () {
    var x = Math.floor(Math.random() * ($('.field').width()-40))
    var y = Math.floor(Math.random() * ($('.field').height()-40))
    var obj = {x: x, y: y}
    emit('addCharacter', obj)
  }

  // remove character from state
  function remove (e) {
    var i = e.target.id
    var type = e.target.attributes.getNamedItem("data-type").nodeValue
    emit('removeCharacter', {i, type})
  }

  function fightOrks() {
    emit('removeAllOrks')
  }
}
