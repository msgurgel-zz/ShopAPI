const express = require('express');
const graphqlHTTP = require('express-graphql');
const db = require('./db/schema');

// Start server
const app = express();
app.use('/graphql', graphqlHTTP({
  schema: db.schema,
  rootValue: db.root,
  graphiql: true,
}));

app.listen(8080);
console.log('Running a GraphQL API server at localhost:8080/graphql');
