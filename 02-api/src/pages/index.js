import $ from 'jquery';
import pagination from 'pagination';
import api from '../api';

import tplDrivers from '../templates/drivers.hbs';
import tplDriver from '../templates/driver.hbs';
import tplConstructors from '../templates/constructors.hbs';
import tplConstructor from '../templates/constructor.hbs';
import tplNotFound from '../templates/not-found.hbs';

const $app = $('#app');
const limit = 10;
var offset = 0;

export function notFound() {
  $app.html(tplNotFound());
}

export function drivers(ctx) {
  var pageNumber = getPageNumber(ctx);
  offset = (pageNumber-1) * limit;

  api
    .get('drivers', {include: 'constructors', limit: limit, offset: offset})
    .then(({resource, total}) => {
      for(var i = 0; i < resource.length; i++)
        resource[i].lastConstructor = resource[i].constructors[0].name;
      renderData(tplDrivers(resource), {prelink: '/drivers', current: pageNumber, rowsPerPage: limit, totalResult: total});
    })

}

export function driver(ctx) {
  api
    .get('drivers', ctx.params.driver, {include: 'constructors'})
    .then(({resource, total}) => {
      driver = resource[0];
      var content = tplDriver({
        driver:  driver,
        constructor:  driver.constructors[0]
      });
      renderData(content);
    })
}

export function constructors(ctx) {
  var pageNumber = getPageNumber(ctx);
  offset = (pageNumber-1) * limit;

  //api.get('constructors', {include: 'drivers', limit: limit, offset: offset})   --> constructors with drivers

  api
    .get('constructors', {limit: limit, offset: offset})
    .then(({resource, total}) => {
      renderData(tplConstructors(resource), {prelink: '/constructors', current: pageNumber, rowsPerPage: limit, totalResult: total})
    })
}

export function constructor(ctx) {
  api
    .get('constructors', ctx.params.constructor, {include: 'drivers'})
    .then(({resource, total}) => {
      constructor = resource[0];
      var content = tplConstructor({
        drivers:  constructor.drivers,
        constructor:  constructor
      });
      renderData(content);
    })
}

function renderData(content, opts) {
  if(typeof opts === 'object') {
    var paginator = pagination.create('search', opts);
    $app.html(paginator.render() + content);
  }
  else {
    $app.html(content);
  }
}

function getPageNumber(ctx) {
  var pageNumber = getQueryVariable(ctx.querystring,"page")
  if(!pageNumber) //falls keine page angegeben wurde (default 1)
    pageNumber = 1;
  return pageNumber
}

function getQueryVariable(from,variable) {
  var query = from;
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
    if (pair[0] == variable) {
      return pair[1];
    }
  }
}
