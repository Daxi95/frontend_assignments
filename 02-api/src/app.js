import $ from 'jquery'
import router from './router'
import homeTpl from './templates/home.hbs'
import magnusTpl from './templates/magnus.hbs'
import sergeyTpl from './templates/sergey.hbs'
import contactTpl from './templates/contact.hbs'
import notFoundTpl from './templates/not-found.hbs'

const $app = $('#app')

function index() {
  $app.html(homeTpl())
}

function contact() {
  $app.html(contactTpl())
}

function players(ctx) {
  let tpl = () => {}
  switch (ctx.params.player) {
    case 'magnus':
      tpl = magnusTpl
      break;
    case 'sergey':
      tpl = sergeyTpl
      break;
  }
  $app.html(tpl())
}

function notFound() {
  $app.html(notFoundTpl())
}

router('/', index)
router('/players/:player', players)
router('/contact', contact)
router('*', notFound)
router()
