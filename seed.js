const Firestore = require('@google-cloud/firestore');
const dataManager = require('./src/db/dataManager');

// Connect to Firestore
const db = new Firestore({
  projectId: 'shopapi-217123',
  keyFilename: '..\\ShopAPI-685f124335fa.json',
});

const timestamp = new Date();

// Seed products
const products = [

  {
    _id: 'bread-1',
    data: {
      description: 'Just a loaf of bread',
      name: 'Bread',
      price: 1.69,
    },
  },

  {
    _id: 'milk-1',
    data: {
      description: "That's a lot of fat!",
      name: '2% Milk',
      price: 3.25,
    },
  },
];

// Drop product collection
dataManager.deleteCollection(db, 'products').then(() => {
  // Create products
  dataManager.setCollectionBatch(db, 'products', products);
});

// Seed Users
const users = [
  {
    _id: 'mgurgel',
    data:
    {
      first: 'Mateus',
      last: 'Gurgel',
      member_since: timestamp,
      orders: [
        'mybeauty_mgurgel_1',
      ],
    },
  },
];

// Drop users collection
dataManager.deleteCollection(db, 'users').then(() => {
// Create users
  dataManager.setCollectionBatch(db, 'users', users);
});

// Seed shops collection
const shops = [
  {
    _id: 'mybeauty',
    data: {
      description: 'we only have 2 products!',
      name: "mat's milk and bread store",
      products: [
        'bread-1',
        'milk-1',
      ],
    },
  },
];

// Drop shops collection
dataManager.deleteCollection(db, 'shops').then(() => {
  // Create shops
  dataManager.setCollectionBatch(db, 'shops', shops);
});

// Seed orders
const orders = [
  {
    _id: 'mybeauty_mgurgel_1',
    data: {
      datetime: timestamp,
      line_items: [
        {
          product: 'milk-1',
          quantity: 3,
        },
      ],
    },
  },
];

// Drop shops collection
dataManager.deleteCollection(db, `shops/${shops[0]._id}/orders`).then(() => {
  // Create shops
  dataManager.setCollectionBatch(db, `shops/${shops[0]._id}/orders`, orders);
});
