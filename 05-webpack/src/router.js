import page from 'page';
import * as pages from './pages/index.js';

export default function() {
  page('/', '/drivers');
  page('/drivers', pages.drivers);
  page('/drivers/:driver', pages.driver);
  page('/constructors', pages.constructors);
  page('/constructors/:constructor', pages.constructor);
  page('/diagram', pages.diagram);
  page('*', pages.notFound);
  page();
}
