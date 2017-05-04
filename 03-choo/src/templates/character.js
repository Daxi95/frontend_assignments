// import choo's template helper
import html from 'choo/html'

module.exports = function (character, index, onclick) {
  if(index != undefined) {
    var type = character.type
    var x = character.x
    var y = character.y

    // create html template
    return html`
        <img class="character" data-type="${type}" src="/assets/${type}.png" style="left: ${x}px; top: ${y}px;" id=${index} onclick=${onclick}>
      `
   }
   else {
    return html`<img src="/assets/${character.type}.png">`
  }
}
