const { createClient } = require('next-sanity');
const client = createClient({
  projectId: 'gfwqxrd2',
  dataset: 'production',
  useCdn: true,
  apiVersion: '2023-05-03',
  token: 'skEApoy50LRGFZnEmBULuOQLcHwrj81FOyVXfcTA86e3Q0WWLig4dg22zQSdVitqxi5BOhYI3HOkQ3peyuuktmwfsjVbFabVI2SGyGzgHhHX9hCJIFwqDuQrcKMs3LXblW5KBWdPo3nXbQwOqHAntc4DzQUTc9KMSZ3pKFGjofTJrlE8OrDb'
});
client.fetch('*[_type == "category"][0]').then(console.log).catch(console.error);
