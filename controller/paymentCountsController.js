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
        offline:
          countPaymentProductsOffline + countPaymentOffersOffline,
        online:
          countPaymentProductsOnline + countPaymentOffersOnline,
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
          },
        },
      });
  
      // Format the response as { productName: numberOfPayments }
      const result = productPaymentCounts.reduce((acc, product) => {
        acc[product.name] = product._count.payments;
        return acc;
      }, {});
  
      // Return the result in the desired format
      res
      .status(200)
      .json(result);
    } catch (error) {
      console.error("Error counting payments by product:", error.message);
      res.status(500).json({ error: "An error occurred while counting payments by product" });
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
            acc[offer.name] = offer._count.PaymentOffer; // Use the appropriate relation name for counting
            return acc;
        }, {});

        // Return the result in the desired format
        res.status(200).json(result);
    } catch (error) {
        console.error("Error counting payments by offer:", error.message);
        res.status(500).json({ error: "An error occurred while counting payments by offer" });
    }
};

  // countPaymentsByProduct();
module.exports = {countAllPayments,countPaymentsByProduct,countPaymentsByOffer}