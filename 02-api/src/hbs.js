import Handlebars from 'hbsfy/runtime';
import dateHelper from './helpers/date';
import driverTablePartial from './partials/driverTable.hbs';

export function registerPartials() {
  Handlebars.registerPartial('table-driver', driverTablePartial);
}

export function registerHelpers() {
  Handlebars.registerHelper('date', dateHelper);
}
