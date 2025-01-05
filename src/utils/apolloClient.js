// lib/apolloClient.js
import { ApolloClient, InMemoryCache, ApolloProvider, gql } from '@apollo/client';

const client = new ApolloClient({
    uri: 'https://api.studio.thegraph.com/query/84972/greenchainscoin/version/latest',
    cache: new InMemoryCache(),
  });

export default client;