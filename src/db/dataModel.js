module.exports = {

  Shop: class Shop {
    constructor(id, input) {
      this.id = id;
      this.description = input.description;
      this.name = input.name;
      this.products = input.products;
    }
  },

  User: class User {
    constructor(id, data) {
      this.id = id;
      this.first = data.first;
      this.last = data.last;
      this.member_size = data.member_size;
      this.orders = data.orders;
    }
  },

  Product: class Product {
    constructor(id, data) {
      this.id = id;
      this.name = data.name;
      this.description = data.description;
      this.price = data.price;
    }
  },

  Order: class Order {
    constructor(id, data) {
      this.id = id;
      this.line_items = data.line_items;
    }
  },
};
