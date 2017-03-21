import moment from 'moment'

export default function(val, opts) {
  val = moment(val);

  if(!val.isValid())
    throw new Error('No valid Date!');

  return val.format('Do MMMM YYYY');
}
