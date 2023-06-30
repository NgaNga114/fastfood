// The Cloud Functions for Firebase SDK to create Cloud Functions and set up triggers.
const functions = require("firebase-functions");

// The Firebase Admin SDK to access Firestore.
const admin = require("firebase-admin");

const StaffStatus = {
  BUSY: "busy",
  FREE: "free"
};

admin.initializeApp();

exports.addNotification = functions.https.onRequest(async (req, res) => {
  res.set("Access-Control-Allow-Headers", "authorization,content-type");
  res.set("Access-Control-Allow-Origin", "*");
  const { type, ...data } = req.body;
  try {
    if (type) {
      await admin
        .firestore()
        .collection("notifications")
        .add({ type, ...data });
    }
    res.status(200).send("ok");
  } catch (error) {
    console.log("error", error);
  }
});

exports.updateNotification = functions.https.onRequest(async (req, res) => {
  res.set("Access-Control-Allow-Headers", "authorization,content-type");
  res.set("Access-Control-Allow-Origin", "*");
  const { id, ...notification } = req.body;
  try {
    if (id) {
      await admin
        .firestore()
        .collection("notifications")
        .doc(id)
        .update(notification);
    }
    res.status(200).send("ok");
  } catch (error) {
    console.log("error", error);
  }
});

exports.getUserProfile = functions.https.onRequest(async (req, res) => {
  res.set("Access-Control-Allow-Headers", "authorization,content-type");
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Origin", "*");
  const userId = req.query.userId;
  const user = await admin
    .firestore()
    .collection("userProfile")
    .doc(userId)
    .get();
  res.send(200, user.data());
});

exports.setUserProfile = functions.https.onRequest(async (req, res) => {
  res.set("Access-Control-Allow-Headers", "authorization,content-type");
  res.set("Access-Control-Allow-Origin", "*");

  const { userId, ...data } = req.body;
  if (userId) {
    await admin
      .firestore()
      .collection("userProfile")
      .doc(userId)
      .set(data, {
        merge: true
      });
  }
  res.status(200).send("ok");
});

exports.getListOrder = functions.https.onRequest(async (req, res) => {
  res.set("Access-Control-Allow-Headers", "authorization,content-type");
  res.set("Access-Control-Allow-Origin", "*");
  const { data } = req.body;
  let listOrders = [];
  try {
    if (data) {
      // find user with uid
      listOrders = await Promise.all(
        data.map(async x => {
          const { userId, shipper, products, ...payload } = x.data;

          // find products with id
          const productDetail = await Promise.all(
            products?.products?.map(async (product, index) => {
              const { name, price, image } = await getProductNameWithId(
                product.id
              );
              return {
                name,
                price,
                image,
                quantity: products.products[index].quantity,
                id: product.id
              };
            })
          );

          // find user with user id
          user = await getUserProfile(userId);

          // find shipper with shipper id
          let isShipper = {};
          if (shipper) {
            isShipper = await getUserProfile(shipper?.id || shipper);
          }

          return {
            products: {
              products: productDetail,
              totalPrice: calculatorTotalPrice(productDetail)
            },
            id: x.id,
            ...payload,
            user: {
              ...user.data,
              id: user.id
            },
            shipper: isShipper.id
              ? {
                  id: isShipper.id,
                  ...isShipper.data
                }
              : null
          };
        })
      );
    }
  } catch (error) {
    console.log("error", error);
  }
  const listOrdersArranged = listOrders.sort((a, b) => {
    return new Date(b?.timestamp) - new Date(a?.timestamp);
  });

  res.status(200).send(listOrdersArranged);
});

exports.cancelOrder = functions.https.onRequest(async (req, res) => {
  res.set("Access-Control-Allow-Headers", "authorization,content-type");
  res.set("Access-Control-Allow-Origin", "*");
  const { shipperId, shipperStatus, orderId, orderStatus } = req.body;
  if (orderId) {
    updateOrder(orderId, { status: orderStatus });
  }
  if (shipperId) {
    await setStaffStatus(shipperId, shipperStatus);
  }
  res.status(200).send("ok");
});

exports.updateOrder = functions.https.onRequest(async (req, res) => {
  res.set("Access-Control-Allow-Headers", "authorization,content-type");
  res.set("Access-Control-Allow-Origin", "*");
  const { oldShipperId, orderId, shipper, purchasedId, ...data } = req.body;
  if (orderId) {
    await updateOrder(orderId, { shipper, ...data });

    if (oldShipperId) {
      await setStaffStatus(oldShipperId, StaffStatus.FREE);
    }
    if (shipper && data.status !== 3) {
      await setStaffStatus(shipper, StaffStatus.BUSY);
    }
    if (data.status === 3 && !!purchasedId) {
      console.log("data.userId", data.userId);
      await updatePurchasedList(data.userId, purchasedId);
    }
  }

  res.status(200).send("ok");
});
exports.ratingProduct = functions.https.onRequest(async (req, res) => {
  res.set("Access-Control-Allow-Headers", "authorization,content-type");
  res.set("Access-Control-Allow-Origin", "*");
  const { rate, ...payload } = req.body;
  try {
    if (rate) {
      await admin
        .firestore()
        .collection("reviews")
        .add({ rate, ...payload });
    }
    res.status(200).send("ok");
  } catch (error) {
    console.log("error rating product", error);
  }
});

exports.updateRatingProduct = functions.https.onRequest(async (req, res) => {
  res.set("Access-Control-Allow-Headers", "authorization,content-type");
  res.set("Access-Control-Allow-Origin", "*");
  const { id, ...payload } = req.body;
  try {
    if (id) {
      await admin
        .firestore()
        .collection("reviews")
        .doc(id)
        .update({
          ...payload,
          id
        });
    }
    res.status(200).send("ok");
  } catch (error) {
    console.log("error rating product", error);
  }
});
exports.rateDetail = functions.https.onRequest(async (req, res) => {
  res.set("Access-Control-Allow-Headers", "authorization,content-type");
  res.set("Access-Control-Allow-Origin", "*");
  const data = req.body;
  try {
    let rates = [];
    let listRateArranged = [];
    if (!!data.length) {
      rates = await Promise.all(
        data.map(async rate => {
          const user = await getUserProfile(rate.uid);
          return {
            ...rate,
            user: user.data
          };
        })
      );
      listRateArranged = rates.sort((a, b) => {
        return new Date(b?.date) - new Date(a?.date);
      });
    }
    res.status(200).send(listRateArranged);
  } catch (error) {
    console.log("error rating product", error);
  }
});
exports.favouriteProductAPI = functions.https.onRequest(async (req, res) => {
  res.set("Access-Control-Allow-Headers", "authorization,content-type");
  res.set("Access-Control-Allow-Origin", "*");
  try {
    const { type, idProduct, uid } = req.body;
    let result = []
    if (uid) {
      await favouriteProduct(type, uid, idProduct);
      const res = await favouriteProduct(null, uid, idProduct);
      console.log("res?.listFavourite", !!res?.listFavourite);
      if(res){
        result = [...res?.listFavourite]
      }
    }
    console.log("result", result);
    res.status(200).send(result);
  } catch (error) {
    console.log("error favourite: ", error);
  }
});

// ---------------------------------------------------------------

const updatePurchasedList = async (uid, listProductId) => {
  try {
    const ref = admin
      .firestore()
      .collection("purchasedList")
      .doc(uid);
    await ref.set(
      {
        purchasedList: admin.firestore.FieldValue.arrayUnion(...listProductId)
      },
      { merge: true }
    );
  } catch (error) {
    console.log("error update purchased list", error);
  }
};

const favouriteProduct = async (type, uid, idProduct) => {
  try {
    if (uid) {
      const ref = admin
        .firestore()
        .collection("favouriteProduct")
        .doc(uid);
      if (type == "plus") {
        await ref.set(
          {
            listFavourite: admin.firestore.FieldValue.arrayUnion(idProduct)
          },
          { merge: true }
        );
        return "Đã thêm vào yêu thích";
      } else if (type == "minus") {
        await ref.set({
          listFavourite: admin.firestore.FieldValue.arrayRemove(idProduct)
        }, {merge: true});
        return "Đã xoá khỏi yêu thích";
      } else {
        const res = await ref.get();
        return res.data();
      }
    }
  } catch (error) {
    console.log("error favourite: ", error);
  }
};

const getUserProfile = async id => {
  if (id) {
    const result = await admin
      .firestore()
      .collection("userProfile")
      .doc(id)
      .get();
    return {
      id: result.id,
      data: result.data()
    };
  }
};

const updateOrder = async (orderId, payload) => {
  if (orderId) {
    await admin
      .firestore()
      .collection("orders")
      .doc(orderId)
      .update(payload);
  }
};

const setStaffStatus = async (staffId, staffStatus) => {
  await admin
    .firestore()
    .collection("userProfile")
    .doc(staffId)
    .update({ status: staffStatus });
};

const getProductNameWithId = async productId => {
  const productRef = admin
    .firestore()
    .collection("products")
    .doc(productId);
  const productSnapShot = await productRef.get();
  return {
    name: productSnapShot.data()?.name || "",
    price: productSnapShot.data()?.price || null,
    image: productSnapShot.data()?.image || ""
  };
};

const calculatorTotalPrice = products => {
  return products.reduce((a, b) => a + Number(b.price) * b.quantity, 0);
};
