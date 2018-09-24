const model = require('./dataModel');
const helper = require('../helper');

module.exports = {

  // Create
  create(db, collectionPath, id, input) {
    const data = JSON.parse(JSON.stringify(input));
    db.collection(collectionPath).doc(id).set(data);
  },

  createShop(db, id, input) {
    this.create(db, 'shops', id, input);
    return new model.Shop(id, input);
  },

  createUser(db, id, input) {
    this.create(db, 'users', id, input);
    return new model.User(id, input);
  },

  createProduct(db, id, input) {
    this.create(db, 'products', id, input);
    return new model.Product(id, input);
  },

  createOrder(db, id, input) {
    const underscore = id.indexOf('_');
    const shopId = id.slice(0, underscore);

    return new Promise(
      (resolve, reject) => {
        this.getShop(db, shopId)
          .then(() => {
            this.create(db, `shops/${shopId}/orders`, id, input);
            resolve(new model.Order(id, input));
          })
          .catch(() => {
            reject(new Error(`Failed to create order. No shop exists with id "${input.shop_id}"`));
          });
      },
    );
  },


  // Read
  get(db, collectionPath, id) {
    return new Promise(
      ((resolve, reject) => {
        const docRef = db.collection(collectionPath).doc(id);
        docRef.get()
          .then((doc) => {
            if (!doc.exists) {
              reject();
            } else {
              resolve(doc.data());
            }
          });
      }),
    );
  },

  getShop(db, id) {
    return new Promise(
      (resolve, reject) => {
        this.get(db, 'shops', id)
          .then(data => resolve(new model.Shop(id, data)))
          .catch(() => reject(new Error(`No shop exists with id "${id}"`)));
      },
    );
  },

  getUser(db, id) {
    return new Promise(
      (resolve, reject) => {
        this.get(db, 'users', id)
          .then(data => resolve(new model.User(id, data)))
          .catch(() => reject(new Error(`No user exists with id "${id}"`)));
      },
    );
  },

  getProduct(db, id) {
    return new Promise(
      (resolve, reject) => {
        this.get(db, 'products', id)
          .then(data => resolve(new model.Product(id, data)))
          .catch(() => reject(new Error(`No products exists with id "${id}"`)));
      },
    );
  },

  getOrder(db, id) {
    const underscore = id.indexOf('_');
    const shopId = id.slice(0, underscore);

    return new Promise(
      (resolve, reject) => {
        this.get(db, `shops/${shopId}/orders`, id)
          .then((data) => {
            const newData = data;
            newData.shop_id = shopId;
            resolve(new model.Order(id, newData));
          })
          .catch(() => reject(new Error(`No orders exists with id "${id}" on shop "${shopId}"`)));
      },
    );
  },


  // Update
  update(db, collectionPath, id, input) {
    const data = JSON.parse(JSON.stringify(input));

    return new Promise(
      (resolve, reject) => {
        const shopRef = db.collection(collectionPath).doc(id);
        shopRef.update(data)
          .then(() => {
            this.get(db, collectionPath, id)
              .then(doc => resolve(doc))
              .catch(() => reject(new Error()));
          })
          .catch(() => reject());
      },
    );
  },

  updateShop(db, id, input) {
    return new Promise(
      (resolve, reject) => {
        this.update(db, 'shops', id, input)
          .then(data => resolve(new model.Shop(id, data)))
          .catch(() => reject(new Error(`Cannot update non-existent shop. id = "${id}"`)));
      },
    );
  },

  updateUser(db, id, input) {
    return new Promise(
      (resolve, reject) => {
        this.update(db, 'users', id, input)
          .then(data => resolve(new model.User(id, data)))
          .catch(() => reject(new Error(`Cannot update non-existent user. id = "${id}"`)));
      },
    );
  },

  updateProduct(db, id, input) {
    return new Promise(
      (resolve, reject) => {
        this.update(db, 'products', id, input)
          .then(data => resolve(new model.Product(id, data)))
          .catch(() => reject(new Error(`Cannot update non-existent product. id = "${id}"`)));
      },
    );
  },

  updateOrder(db, id, input) {
    const underscore = id.indexOf('_');
    const shopId = id.slice(0, underscore);

    return new Promise(
      (resolve, reject) => {
        this.update(db, `shops/${shopId}/orders`, id, input)
          .then(data => resolve(new model.Order(id, data)))
          .catch(() => reject(new Error(`Cannot update non-existent order. id = "${id}"`)));
      },
    );
  },


  // Delete
  delete(db, collectionPath, id) {
    return new Promise(
      (resolve, reject) => {
        const docRef = db.collection(collectionPath).doc(id);
        docRef.delete()
          .then(resolve())
          .catch(reject());
      },
    );
  },

  deleteShop(db, id) {
    return new Promise(
      (resolve, reject) => {
        this.delete(db, 'shops', id)
          .then(() => resolve(`Successfully deleted shop "${id}"`))
          .catch(() => reject(new Error(`Failed to delete shop "${id}"!`)));
      },
    );
  },

  deleteUser(db, id) {
    return new Promise(
      (resolve, reject) => {
        this.delete(db, 'users', id)
          .then(() => resolve(`Successfully deleted user "${id}"`))
          .catch(() => reject(new Error(`Failed to delete user "${id}"!`)));
      },
    );
  },

  deleteProduct(db, id) {
    return new Promise(
      (resolve, reject) => {
        this.delete(db, 'products', id)
          .then(() => resolve(`Successfully deleted product "${id}"`))
          .catch(() => reject(new Error(`Failed to delete product "${id}"!`)));
      },
    );
  },

  deleteOrder(db, id) {
    const underscore = id.indexOf('_');
    const shopId = id.slice(0, underscore);

    return new Promise(
      (resolve, reject) => {
        this.delete(db, `shops/${shopId}/orders`, id)
          .then(() => resolve(`Successfully deleted order "${id}"`))
          .catch(() => reject(new Error(`Failed to delete order "${id}"!`)));
      },
    );
  },


  // Miscellaneous
  calculateTotal(db, orderId) {
    return new Promise(
      (resolve, reject) => {
        this.getOrder(db, orderId)
          .then((order) => {
            let total = 0;
            helper.asynchForEach(order.line_items, async (lineItem) => {
              const product = await this.getProduct(db, lineItem.product);
              total += (product.price * lineItem.quantity);
            }).then(() => {
              // Finished calculating total
              resolve(total);
            });
          })
          .catch(() => reject(new Error(`Cannot calculate total. Order "${orderId}" does not exist.`)));
      },
    );
  },

  deleteCollection(db, collectionPath, batchSize = 100) {
    const collectionRef = db.collection(collectionPath);
    const query = collectionRef.orderBy('__name__').limit(batchSize);

    return new Promise((resolve, reject) => {
      this.deleteQueryBatch(db, query, batchSize, resolve, reject);
    });
  },

  deleteQueryBatch(db, query, batchSize, resolve, reject) {
    query.get()
      .then((snapshot) => {
      // When there are no documents left, we are done
        if (snapshot.size === 0) {
          return 0;
        }

        // Delete documents in a batch
        const batch = db.batch();
        snapshot.docs.forEach((doc) => {
          batch.delete(doc.ref);
        });

        return batch.commit().then(() => snapshot.size);
      }).then((numDeleted) => {
        if (numDeleted === 0) {
          resolve();
          return;
        }

        // Recurse on the next process tick, to avoid exploding the stack.
        process.nextTick(() => {
          this.deleteQueryBatch(db, query, batchSize, resolve, reject);
        });
      })
      .catch(reject);
  },

  setCollectionBatch(db, collectionPath, dataArray) {
    const batch = db.batch();

    dataArray.forEach((doc) => {
      const documentRef = db.collection(collectionPath).doc(doc._id);
      batch.create(documentRef, doc.data);
    });

    batch.commit().then(() => {
      console.log(`Sucessfully created "${collectionPath}" collection.`);
    }).catch(() => {
      console.log(`Unable to create "${collectionPath}" collection.`);
    });
  },
};
