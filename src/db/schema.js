const { buildSchema } = require('graphql');
const Firestore = require('@google-cloud/firestore');
const dataManager = require('./dbWrapper');

const db = new Firestore({
  projectId: 'shopapi-217123',
  keyFilename: './ShopAPI-685f124335fa.json',
});

const settings = { timestampsInSnapshots: true };
db.settings(settings);

module.exports = {
  schema: buildSchema(`

    ################
    # Objects type #
    ################
    type Shop {
      id: String!
      name: String
      description: String
      products: [String]
    }

    type User {
      id: String!
      first: String
      last: String,
      orders: [String]
    }

    type Product {
      id: String!
      description: String
      name: String
      price: Float
    }

    type Order {
      id: String!
      line_items: [LineItem]
    }

    type LineItem {
      product: String
      quantity: Int
    }

    ##############
    # Input Type #
    ############## 
    input ShopInput {
      name: String
      description: String
      products: [String]
    }

    input UserInput {
      first: String
      last: String
      orders: [String]
    }

    input ProductInput {
      description: String
      name: String
      price: Float
    }

    input OrderInput {
      line_items: [LineItemInput]
    }

    input LineItemInput {
      product: String
      quantity: Int
    }

    #############
    # Mutations #
    #############
    type Mutation {
      createShop(id: String!, input: ShopInput!): Shop
      updateShop(id: String!, input: ShopInput!): Shop
      deleteShop(id: String!): String

      createUser(id: String!, input: UserInput!): User
      updateUser(id: String!, input: UserInput!): User
      deleteUser(id: String!): String

      createProduct(id: String!, input: ProductInput!): Product
      updateProduct(id: String!, input: ProductInput!): Product
      deleteProduct(id: String!): String

      createOrder(id: String!, input: OrderInput!): Order
      updateOrder(id: String!, input: OrderInput!): Order
      deleteOrder(id: String!): String
    }


    ###########
    # Queries #
    ###########
    type Query {

      # Read
      getShop(id: String!): Shop
      getUser(id: String!): User
      getProduct(id: String!): Product
      getOrder(id: String!): Order

      # Misc
      calculateTotal(id: String!): Float
    }
  `),

  root: {

    // Mutations
    createShop: ({ id, input }) => dataManager.createShop(db, id, input),
    updateShop: ({ id, input }) => dataManager.updateShop(db, id, input),
    deleteShop: ({ id }) => dataManager.deleteShop(db, id),

    createUser: ({ id, input }) => dataManager.createUser(db, id, input),
    updateUser: ({ id, input }) => dataManager.updateUser(db, id, input),
    deleteUser: ({ id }) => dataManager.deleteUser(db, id),

    createProduct: ({ id, input }) => dataManager.createProduct(db, id, input),
    updateProduct: ({ id, input }) => dataManager.updateProduct(db, id, input),
    deleteProduct: ({ id }) => dataManager.deleteProduct(db, id),

    createOrder: ({ id, input }) => dataManager.createOrder(db, id, input),
    updateOrder: ({ id, input }) => dataManager.updateOrder(db, id, input),
    deleteOrder: ({ id }) => dataManager.deleteOrder(db, id),

    // Queries
    getShop: ({ id }) => dataManager.getShop(db, id),
    getUser: ({ id }) => dataManager.getUser(db, id),
    getProduct: ({ id }) => dataManager.getProduct(db, id),
    getOrder: ({ id }) => dataManager.getOrder(db, id),

    calculateTotal: ({ id }) => dataManager.calculateTotal(db, id),
  },
};
