import $ from 'jquery';
import config from '../config';
import pagination from 'pagination';

import tplDrivers from '../templates/drivers.hbs';
import tplDriver from '../templates/driver.hbs';
import tplConstructors from '../templates/constructors.hbs';
import tplConstructor from '../templates/constructor.hbs';
import tplNotFound from '../templates/not-found.hbs';

const limit = 30;
var offset = 0;

const $app = $('#app');

export function notFound() {
  $app.html(tplNotFound());
}

export function drivers(ctx) {
  var pageNumber = getPageNumber(ctx);
  offset = (pageNumber-1) * limit;

  fetch(config.api.url + `/drivers.json?limit=${limit}&offset=${offset}`)
    .then(response => response.json())
    .then(drivers => {
      var totalDrivers = drivers.MRData.total;
      drivers = drivers.MRData.DriverTable.Drivers;

      var paginator = pagination.create('search', {prelink: '/drivers', current: pageNumber, rowsPerPage: limit, totalResult: totalDrivers});
      $app.html(paginator.render() + tplDrivers(drivers));
    })
}

export function driver(ctx) {
  var urls = [];

  urls.push(config.api.url + `/drivers/${ctx.params.driver}/constructors.json`);
  urls.push(config.api.url + `/drivers/${ctx.params.driver}.json`);

  Promise.all(urls.map(url => fetch(url).then(resp => resp.json())))
    .then(response => {
      var constructor = response[0].MRData.ConstructorTable.Constructors[0];
      var driver = response[1].MRData.DriverTable.Drivers[0];
      var content;

      content = tplDriver({
        driver:  driver,
        constructor:  constructor
      });

      $app.html(content);
    })
}

export function constructors(ctx) {
  var pageNumber = getPageNumber(ctx);
  offset = (pageNumber-1) * limit;

  fetch(config.api.url + `/constructors.json?limit=${limit}&offset=${offset}`)
    .then(response => response.json())
    .then(constructors => {
      var totalConstructors = constructors.MRData.total;
      constructors = constructors.MRData.ConstructorTable.Constructors;

      var paginator = pagination.create('search', {prelink: '/constructors', current: pageNumber, rowsPerPage: limit, totalResult: totalConstructors});
      $app.html(paginator.render() + tplConstructors(constructors));
    })
}

export function constructor(ctx) {
  var urls = [];

  urls.push(config.api.url + `/constructors/${ctx.params.constructor}/drivers.json`);
  urls.push(config.api.url + `/constructors/${ctx.params.constructor}.json`);

  Promise.all(urls.map(url => fetch(url).then(resp => resp.json())))
    .then(response => {
      var drivers = response[0].MRData.DriverTable.Drivers;
      var constructor = response[1].MRData.ConstructorTable.Constructors[0];
      var content;

      content = tplConstructor({
        drivers:  drivers,
        constructor:  constructor
      });

      $app.html(content);
    })
}

function getPageNumber(ctx) {
  var pageNumber = getQueryVariable(ctx.querystring,"page")
  if(!pageNumber)
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
