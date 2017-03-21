import config from '../config'
import pluralize from 'pluralize'

export default Object.freeze({

  get:
    function(resource, id, opts) {

      if (typeof id === 'string') {
        return fetchData(resource, id, opts);
      } else if (typeof id === 'object') {
        return fetchData(resource, "", id);
      } else {
        throw new Error('Wrong API call!')
      }
    }
})

function fetchData(resource, id, opts) {
  let response;
  let {limit = 30, offset = 0} = opts;

  if(id)
    response =  fetch(`${config.api.url}/${resource + "/" + id}.json?limit=${limit}&offset=${offset}`);
  else
    response =  fetch(`${config.api.url}/${resource}.json?limit=${limit}&offset=${offset}`);

  return response
    .then(stream => stream.json())
    .then(data => {

      let rows = resourcePath(resource, data);

      if(opts.include) {    //bei include alle zugehörigen driver/constructor fetchen
        let includes = [];
        let resourceSingularId = pluralize.singular(resource) + "Id";
        rows.map(row => {
          includes.push(fetch(`${config.api.url}/${resource}/${row[resourceSingularId]}/${opts.include}.json`));
        })
        return Promise.all(includes)
          .then(streams => Promise.all(streams.map(s => s.json())))
          .then(responses => {

            for(var i = 0; i < responses.length; i++) {
              rows[i][opts.include] = resourcePath(opts.include,responses[i]);
            }
            return {
              resource: rows,
              total: data.MRData.total,
            }

          });
      }
      else {    //wenn kein include angegeben
        return {
          resource: rows,
          total: data.MRData.total
        }
      }
    })
}

function fetchSingle(resource, id, opts) {
  let response;
  let {limit = 30, offset = 0} = opts;

  response =  fetch(`${config.api.url}/${resource}.json?limit=${limit}&offset=${offset}`);

  //response =  fetch(`${config.api.url}/${resource}/${id}.json`);
  /*Promise.all(
   fetch(`${config.api.url}/drivers/${rows.driverId}/constructors.json`)
   .then()
   )*/
}

function resourcePath(resource, data) {
  let table = pluralize.singular(resource);
  table = table[0].toUpperCase() + table.slice(1) + "Table";
  let resourceUppercase = resource[0].toUpperCase() + resource.slice(1);
  return data.MRData[table][resourceUppercase]
}
