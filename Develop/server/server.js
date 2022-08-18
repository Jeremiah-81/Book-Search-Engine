const express = require('express');
const path = require('path');
// const db = require('./config/connection');
const routes = require('./routes');

//Added in this line.
const { ApolloServer } = require('apollo-server-express');
const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');

const {authMiddleware} = require('./utils/auth');

//

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());



// Adding server the file path.
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context:authMiddleware
});

// added the middleware
server.applyMiddleware({ app });


// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/'));
})

app.use(routes);

db.once('open', () => {
  app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
  console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
});
