// import choo
import choo from 'choo'

import mainTpl from './templates/main.js'
import emojiTpl from './templates/emoji.js'

// initialize choo
var app = choo()

app.use(function (state, emitter) {
  // initialize state
  state.characters = [
    {type: 'ork', x: 200, y: 100},
    {type: 'hobbit', x: 100, y: 200}
  ]

  state.deadcharacters = []

  // add character
  emitter.on('addCharacter', function (data) {
    var characters = ['ork', 'hobbit']

    var type = Math.floor(Math.random() * 2)
    var x = data.x
    var y = data.y

    var obj = {type: characters[type], x: x, y: y}
    state.characters.push(obj)

    emitter.emit('render')
  })

  // remove character
  emitter.on('removeCharacter', function (character) {
    state.characters.splice(character.i, 1)
    if(character.type == 'ork')
      state.deadcharacters.push({type: 'ork'})
    emitter.emit('render')
  })

  emitter.on('removeAllOrks', function () {
    for(let i = state.characters.length - 1; i >= 0; i--) {
      if(state.characters[i].type == 'ork') {
        state.characters.splice(i, 1)
        state.deadcharacters.push({type: 'ork'})
      }
    }
    emitter.emit('render')
  })
})

app.route('/', mainTpl)
app.route('/emoji', emojiTpl)

// start app
app.mount('#app div')

