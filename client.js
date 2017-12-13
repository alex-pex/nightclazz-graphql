import ApolloClient from 'apollo-client-preset';
import fetch from 'node-fetch';
import { createHttpLink } from 'apollo-link-http';
import gql from 'graphql-tag';

const client = new ApolloClient({
  link: createHttpLink({ uri: 'http://localhost:4000/graphql', fetch })
});

client
  .query({
    query: gql`
      {
        search(query: "Lille") {
          zipCode
          city
        }
      }
    `
  })
  .then(data => console.log(data))
  .catch(error => console.error(error));
