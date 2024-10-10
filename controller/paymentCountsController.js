const prisma = require("../utils/db");

const countAllPayments = async (req, res) => {
  try {
    // Count offline payments for products
    const countPaymentProductsOffline = await prisma.payment.count({
      where: {
        isPayed: true,
        order: null,
      },
    });

    // Count offline payments for offers
    const countPaymentOffersOffline = await prisma.paymentOffer.count({
      where: {
        isPayed: true,
        order: null,
      },
    });

    // Count online payments for products
    const countPaymentProductsOnline = await prisma.payment.count({
      where: {
        isPayed: true,
        order: { isNot: null },
      },
    });

    // Count online payments for offers
    const countPaymentOffersOnline = await prisma.paymentOffer.count({
      where: {
        isPayed: true,
        order: { isNot: null },
      },
    });

    // Count total categories
    const countCategories = await prisma.category.count();

    // Count total products
    const countProducts = await prisma.product.count();

    // Count delivered orders
    const delevredOrders = await prisma.order.count({
      where: {
        status: "LIVREE",
      },
    });

    // Count returned (refused) orders
    const ReturnOrders = await prisma.order.count({
      where: {
        status: "REFUSE",
      },
    });

    // Send all counts as a JSON response
    res.status(200).json({
      offlinePayments: {
        products: countPaymentProductsOffline,
        offers: countPaymentOffersOffline,
      },
      onlinePayments: {
        products: countPaymentProductsOnline,
        offers: countPaymentOffersOnline,
      },
      totalPayments: {
        offline: countPaymentProductsOffline + countPaymentOffersOffline,
        online: countPaymentProductsOnline + countPaymentOffersOnline,
        all:
          countPaymentProductsOffline +
          countPaymentOffersOffline +
          countPaymentProductsOnline +
          countPaymentOffersOnline,
      },
      categories: countCategories,
      products: countProducts,
      deliveredOrders: delevredOrders,
      returnedOrders: ReturnOrders,
    });
  } catch (error) {
    console.error("Error counting payments:", error.message);
    res
      .status(500)
      .json({ error: "An error occurred while counting payments" });
  }
};

const countAllPaymentsWithQ = async (req, res) => {
  try {
    // Fetch offline payments for products
    const offlinePaymentsProducts = await prisma.payment.findMany({
      where: {
        isPayed: true,
        order: null,
      },
      select: {
        details: true,
      },
    });

    // Sum product quantities for offline payments
    const totalQuantityProductsOffline = offlinePaymentsProducts.reduce(
      (sum, payment) => {
        const details = JSON.parse(payment.details); // Parse details JSON
        const quantitySum = details.reduce((acc, item) => acc + item.q, 0); // Sum `q` field in details
        console.log(
          `Product Payment ID: ${payment.id}, Quantity Sum: ${quantitySum}`
        );
        return sum + quantitySum;
      },
      0
    );

    // Fetch offline payments for offers
    const offlinePaymentsOffers = await prisma.paymentOffer.findMany({
      where: {
        isPayed: true,
        order: null,
      },
      select: {
        details: true,
      },
    });

    // Sum offer quantities for offline payments
    const totalQuantityOffersOffline = offlinePaymentsOffers.reduce(
      (sum, payment) => {
        const details = JSON.parse(payment.details); // Parse details JSON
        const quantitySum = details.reduce((acc, item) => acc + item.q, 0); // Sum `q` field in details
        console.log(
          `Offer Payment ID: ${payment.id}, Quantity Sum: ${quantitySum}`
        );
        return sum + quantitySum;
      },
      0
    );

    // Fetch online payments for products
    const onlinePaymentsProducts = await prisma.payment.findMany({
      where: {
        isPayed: true,
        order: { isNot: null },
      },
      select: {
        details: true,
      },
    });

    // Sum product quantities for online payments
    const totalQuantityProductsOnline = onlinePaymentsProducts.reduce(
      (sum, payment) => {
        const details = JSON.parse(payment.details); // Parse details JSON
        const quantitySum = details.reduce((acc, item) => acc + item.q, 0); // Sum `q` field in details
        console.log(
          `Online Product Payment ID: ${payment.id}, Quantity Sum: ${quantitySum}`
        );
        return sum + quantitySum;
      },
      0
    );

    // Fetch online payments for offers
    const onlinePaymentsOffers = await prisma.paymentOffer.findMany({
      where: {
        isPayed: true,
        order: { isNot: null },
      },
      select: {
        details: true,
      },
    });

    // Sum offer quantities for online payments
    const totalQuantityOffersOnline = onlinePaymentsOffers.reduce(
      (sum, payment) => {
        const details = JSON.parse(payment.details); // Parse details JSON
        const quantitySum = details.reduce((acc, item) => acc + item.q, 0); // Sum `q` field in details
        console.log(
          `Online Offer Payment ID: ${payment.id}, Quantity Sum: ${quantitySum}`
        );
        return sum + quantitySum;
      },
      0
    );

    // Count total categories
    const countCategories = await prisma.category.count();

    // Count total products
    const countProducts = await prisma.product.count();

    // Count delivered orders
    const deliveredOrders = await prisma.order.count({
      where: {
        status: "LIVREE",
      },
    });

    // Count returned (refused) orders
    const returnOrders = await prisma.order.count({
      where: {
        status: "REFUSE",
      },
    });

    // Send all counts as a JSON response, including the sum of quantities
    res.status(200).json({
      offlinePayments: {
        products: offlinePaymentsProducts.length,
        offers: offlinePaymentsOffers.length,
        totalQuantityProducts: totalQuantityProductsOffline, // Total quantity of products offline
        totalQuantityOffers: totalQuantityOffersOffline, // Total quantity of offers offline
      },
      onlinePayments: {
        products: onlinePaymentsProducts.length,
        offers: onlinePaymentsOffers.length,
        totalQuantityProducts: totalQuantityProductsOnline, // Total quantity of products online
        totalQuantityOffers: totalQuantityOffersOnline, // Total quantity of offers online
      },
      totalPayments: {
        offline: {
          count: offlinePaymentsProducts.length + offlinePaymentsOffers.length,
          totalQuantityProducts: totalQuantityProductsOffline,
          totalQuantityOffers: totalQuantityOffersOffline,
        },
        online: {
          count: onlinePaymentsProducts.length + onlinePaymentsOffers.length,
          totalQuantityProducts: totalQuantityProductsOnline,
          totalQuantityOffers: totalQuantityOffersOnline,
        },
        all: {
          count:
            offlinePaymentsProducts.length +
            offlinePaymentsOffers.length +
            onlinePaymentsProducts.length +
            onlinePaymentsOffers.length,
          totalQuantityProducts:
            totalQuantityProductsOffline + totalQuantityProductsOnline,
          totalQuantityOffers:
            totalQuantityOffersOffline + totalQuantityOffersOnline,
        },
      },
      categories: countCategories,
      products: countProducts,
      deliveredOrders: deliveredOrders,
      returnedOrders: returnOrders,
    });
  } catch (error) {
    console.error("Error counting payments:", error.message);
    res
      .status(500)
      .json({ error: "An error occurred while counting payments" });
  }
};

const countPaymentsByProduct = async (req, res) => {
  try {
    // Fetch each product and count how many payments it has
    const productPaymentCounts = await prisma.product.findMany({
      select: {
        name: true, // Get product name
        _count: {
          select: {
            payments: true, // Count the associated payments
          },
        }, category: {
          select: {
            name:true
          },
        },
      },
     
    });

    const result = productPaymentCounts.reduce((acc, product) => {
      const categoryName = product.category.name; // Get category name
      const productName = `${categoryName.charAt(0).toUpperCase() + categoryName.slice(1)} ${product.name.charAt(0).toUpperCase() + product.name.slice(1)}`;
    
      acc[productName] = product._count.payments;
      return acc;
    }, {});

    // Return the result in the desired format
    res.status(200).json(result);
  } catch (error) {
    console.log(error)
    console.error("Error counting payments by product:", error.message);
    res
      .status(500)
      .json({ error: "An error occurred while counting payments by product" });
  }
};

const countPaymentsByOffer = async (req, res) => {
  try {
    // Fetch each offer and count how many payments it has
    const offerPaymentCounts = await prisma.offer.findMany({
      select: {
        name: true, // Get offer name
        _count: {
          select: {
            PaymentOffer: true, // Count the associated payment offers
          },
        },
      },
    });

    // Format the response as { offerName: numberOfPayments }
    const result = offerPaymentCounts.reduce((acc, offer) => {
      acc[offer.name.charAt(0).toUpperCase() + offer.name.slice(1)] = offer._count.PaymentOffer; // Use the appropriate relation name for counting
      return acc;
    }, {});

    // Return the result in the desired format
    res.status(200).json(result);
  } catch (error) {
    console.error("Error counting payments by offer:", error.message);
    res
      .status(500)
      .json({ error: "An error occurred while counting payments by offer" });
  }
}; 
// Helper function to capitalize the first letter of a string
    const capitalizeFirstLetter = (string) => {
      return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    };
const countPaymentsByProductWithQuantity = async (req, res) => {
  try {
    // Fetch each product and count how many payments it has, including quantities
    const productPaymentCounts = await prisma.product.findMany({
      select: {
        name: true, // Get product name
        payments: {
          select: {
            details: true, // Get payment details to extract quantities
          },
        },
      },
    });

    // Initialize an object to store total quantities for each product
    const totalQuantities = {};

    const result = productPaymentCounts.reduce((acc, product) => {
      const paymentCount = product.payments.length;
      acc[capitalizeFirstLetter(product.name)] = { count: paymentCount, totalQuantity: 0 }; // Initialize without category first
    
      product.payments.forEach((payment) => {
        const details = JSON.parse(payment.details); // Extract the details for each payment
    
        details.forEach((item) => {
          // Concatenate the product name and category, and capitalize both
          const productCategoryName = `${capitalizeFirstLetter(item.category)} ${capitalizeFirstLetter(item.name) }`;
    
          if (!acc[productCategoryName]) {
            acc[productCategoryName] = { count: 0, totalQuantity: 0 }; // Initialize if not exists
          }
    
          // Ensure the item name matches the product name and increment
          if (item.name === product.name) {
            acc[productCategoryName].count += 1;
            acc[productCategoryName].totalQuantity += item.q; // Add the quantity to the product's total
          }
        });
      });
    
      return acc; // Return accumulator
    }, {});
   

    // Return the result in the desired format
    res.status(200).json(result);
  } catch (error) {
    console.log(error)
    console.error(
      "Error counting payments by product with quantity:",
      error.message
    );
    res
      .status(500)
      .json({
        error:
          "An error occurred while counting payments by product with quantity",
      });
  }
};

const countPaymentsByOfferWithQuantity = async (req, res) => {
  try {
    // Fetch each offer and count how many payments it has, including quantities
    const offerPaymentCounts = await prisma.offer.findMany({
      select: {
        name: true, // Get offer name
        PaymentOffer: {
          select: {
            details: true, // Get payment offer details to extract quantities
          },
        },
      },
    });

    // Initialize an object to store total quantities for each offer
    const totalQuantities = {};

    // Format the response as { offerName: { count: numberOfPayments, totalQuantity: totalQuantity } }
    const result = offerPaymentCounts.reduce((acc, offer) => {
      const paymentCount = offer.PaymentOffer.length;
      acc[capitalizeFirstLetter(offer.name)] = { count: paymentCount, totalQuantity: 0 }; // Capitalize the offer name here
    
      // Iterate through each payment offer to calculate total quantities
      offer.PaymentOffer.forEach((paymentOffer) => {
        const details = JSON.parse(paymentOffer.details); // Assuming details is a JSON string
    
        // Sum quantities for each offer in the payment details
        details.forEach((item) => {
          // Check if the item relates to the current offer
          if (item.name === offer.name) {
            acc[capitalizeFirstLetter(offer.name)].totalQuantity += item.q; // Capitalize the offer name here
          }
        });
      });
    
      return acc; // Return accumulator
    }, {});

    // Return the result in the desired format
    res.status(200).json(result);
  } catch (error) {
    console.error(
      "Error counting payments by offer with quantity:",
      error.message
    );
    res
      .status(500)
      .json({
        error:
          "An error occurred while counting payments by offer with quantity",
      });
  }
};

// countPaymentsByProduct();
module.exports = {
  countAllPayments,
  countPaymentsByProduct,
  countPaymentsByOffer,
  countAllPaymentsWithQ,
  countPaymentsByProductWithQuantity,
  countPaymentsByOfferWithQuantity,
};
