import router from './router';
import { registerHelpers, registerPartials } from './hbs'

registerPartials();
registerHelpers();

router();
