const express = require('express');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');
const fs = require('fs');
const rp = require('request-promise');

// Construct a schema, using GraphQL schema language
const schema = buildSchema(fs.readFileSync('./schema.gql').toString());

// The root provides a resolver function for each API endpoint
const root = {
  search: async ({ query }) => {
    const uri = `https://api-adresse.data.gouv.fr/search/?q=${query}`;
    console.log('REQUEST', uri);

    const adresseResponse = await rp({
      uri,
      json: true // Automatically parses the JSON string in the response
    });
    const firstResult = adresseResponse.features[0] || {};
    const firstProperties = firstResult.properties || {};

    return {
      city: firstProperties.city,
      zipCode: firstProperties.postcode
    };
  }
};

const app = express();
app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    rootValue: root,
    graphiql: true
  })
);
app.listen(4000);
console.log('Running a GraphQL API server at localhost:4000/graphql');
