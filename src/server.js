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

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Go to http://localhost:${port}/graphiql to run queries!`);
});
