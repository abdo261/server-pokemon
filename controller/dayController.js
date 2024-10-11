const prisma = require("../utils/db");

// Get All Days
async function getAllDays(req, res) {
  try {
    const days = await prisma.day.findMany({
      orderBy: {
        startAt: "desc",
      },
    });
    res.status(200).json(days);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération des journées : " + error.message,
    });
  }
}

// Get Day by ID
async function getDayById(req, res) {
  const { id } = req.params;
  try {
    // Step 1: Retrieve the Day record
    const day = await prisma.day.findUnique({
      where: { id: parseInt(id) },
    });

    if (!day) {
      return res.status(404).json({ message: "Journée non trouvée" });
    }

    // Step 2: Prepare the date range for the query
    const dateRange = {
      createdAt: {
        gte: day.startAt, // Greater than or equal to startAt
        ...(day.stopeAt ? { lte: day.stopeAt } : {}), // Less than or equal to stopeAt only if it's not null
      },
    };

    // Step 3: Find payments and payment offers within the date range
    const payments = await prisma.payment.findMany({
      where: { ...dateRange, isPayed: true },
      include: { order: true },
    });

    const paymentOffers = await prisma.paymentOffer.findMany({
      where: { ...dateRange, isPayed: true },
      include: { order: true },
    });

    // Step 4: Prepare a list of unique delivery IDs from the payments
    const deliveryIds = Array.from(
      new Set([
        // Collect delivery IDs from payments (paymentProducts)
        ...payments
          .map((payment) => payment.delevryId)
          .filter((id) => id !== null),
        // Collect delivery IDs from paymentOffers
        ...paymentOffers
          .map((offer) => offer.delevryId)
          .filter((id) => id !== null),
      ])
    );

    // Step 5: Fetch the delivery users based on the collected delivery IDs
    const deliveries = await prisma.user.findMany({
      where: {
        id: { in: deliveryIds },
      },
      include: {
        orderProducts: {
          where: {
            createdAt: {
              gte: day.startAt,
              ...(day.stopeAt ? { lte: day.stopeAt } : {}),
            },isPayed: true,
          },
          include: {
            order: true,
          },
        },
        orderOffers: {
          where: {
            createdAt: {
              gte: day.startAt,
              ...(day.stopeAt ? { lte: day.stopeAt } : {}),
            },isPayed:true
          },
          include: {
            order: true, // Include delivery details in orders as well
          },
        },
      },
    });
    const modifiedDeliveries = deliveries.map((delivery) => {
      const { orderProducts, orderOffers, ...rest } = delivery; // Destructure to remove original fields
      return {
        ...rest,
        paymentProducts: orderProducts, // Rename
        paymentOffers: orderOffers, // Rename
      };
    });
    // Step 6: Return the day with payments, payment offers, and deliveries
    res.status(200).json({
      day,
      paymentProducts: payments,
      paymentOffers,
      deliveries: modifiedDeliveries,
    });
  } catch (error) {
    res.status(500).json({
      message:
        "Erreur lors de la récupération de la journée : " + error.message,
    });
  }
}

// Create a new Day
async function createDay(req, res) {
  const { startAt, stopeAt } = req.body;

  try {
    const day = await prisma.day.create({
      data: {
        startAt: new Date(startAt), // Ensure startAt is a Date object
        stopeAt: stopeAt ? new Date(stopeAt) : null, // Handle optional stopeAt
      },
    });
    res.status(201).json({
      message: "Journée créée avec succès",
      day,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la création de la journée : " + error.message,
    });
  }
}

// Update a Day
async function updateDay(req, res) {
  const { id } = req.params;
  const { startAt, stopeAt } = req.body;

  try {
    const existingDay = await prisma.day.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingDay) {
      return res.status(404).json({ message: "Journée non trouvée" });
    }

    const updatedDay = await prisma.day.update({
      where: { id: parseInt(id) },
      data: {
        startAt: new Date(startAt), // Ensure startAt is a Date object
        stopeAt: stopeAt ? new Date(stopeAt) : null, // Handle optional stopeAt
      },
    });

    res.status(200).json({
      message: "Journée mise à jour avec succès",
      day: updatedDay,
    });
  } catch (error) {
    
    res.status(500).json({
      message: "Erreur lors de la mise à jour de la journée : " + error.message,
    });
  }
}

// Delete a Day by ID
async function deleteDay(req, res) {
  const { id } = req.params;

  try {
    const existingDay = await prisma.day.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingDay) {
      return res.status(404).json({ message: "Journée non trouvée" });
    }

    await prisma.day.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({ message: "Journée supprimée avec succès" });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la suppression de la journée : " + error.message,
    });
  }
}

// Get Latest Day
async function getLatestDay(req, res) {
  try {
    const latestDay = await prisma.day.findFirst({
      orderBy: {
        startAt: "desc",
      },
    });

    res.status(200).json(latestDay);
  } catch (error) {
    res.status(500).json({
      message:
        "Erreur lors de la récupération de la dernière journée : " +
        error.message,
    });
  }
}
// Helper function to apply the date range filter
const getDateRangeFilter = (startAt, stopeAt) => {
  const filter = {
    gte: startAt, // Start of the range
  };
  if (stopeAt) {
    filter.lte = stopeAt; // End of the range, if provided
  }
  return filter;
};

const countAllPaymentsForDay = async (req, res) => {
  const { dayId } = req.params; // Get the day ID from the request parameters

  try {
    // Fetch the date range based on the provided dayId
    const day = await prisma.day.findUnique({
      where: { id: Number(dayId) }, // Ensure dayId is a number
      select: {
        startAt: true,
        stopeAt: true,
      },
    });

    // Check if the day was found
    if (!day) {
      return res.status(404).json({ error: "Day not found" });
    }

    const { startAt, stopeAt } = day;
   
    // Prepare the filter for createdAt based on the presence of stopeAt
    const dateFilter = {
      gte: startAt, // Start date filter
    };

    if (stopeAt) {
      dateFilter.lte = stopeAt; // Only add the lte filter if stopeAt is not null
    }

    // Fetch offline payments for products
    const offlinePaymentsProducts = await prisma.payment.findMany({
      where: {
        isPayed: true,
        order: null, // Offline payments are those without an associated order
        createdAt: dateFilter,
      },
      select: {
        details: true,
      },
    });

    // Calculate total quantities for offline payments
    const totalQuantityProductsOffline = offlinePaymentsProducts.reduce(
      (sum, payment) => {
        const details = JSON.parse(payment.details); // Parse details JSON
        const quantitySum = details.reduce((acc, item) => acc + item.q, 0);
        return sum + quantitySum;
      },
      0
    );

    // Fetch offline payments for offers
    const offlinePaymentsOffers = await prisma.paymentOffer.findMany({
      where: {
        isPayed: true,
        order: null, // Offline offers are those without an associated order
        createdAt: dateFilter,
      },
      select: {
        details: true,
      },
    });

    // Calculate total quantities for offline offers
    const totalQuantityOffersOffline = offlinePaymentsOffers.reduce(
      (sum, payment) => {
        const details = JSON.parse(payment.details);
        const quantitySum = details.reduce((acc, item) => acc + item.q, 0);
        return sum + quantitySum;
      },
      0
    );

    // Fetch online payments for products
    const onlinePaymentsProducts = await prisma.payment.findMany({
      where: {
        isPayed: true,
        order: { isNot: null }, // Online payments have an associated order
        createdAt: dateFilter,
      },
      select: {
        details: true,
      },
    });

    // Calculate total quantities for online payments
    const totalQuantityProductsOnline = onlinePaymentsProducts.reduce(
      (sum, payment) => {
        const details = JSON.parse(payment.details);
        const quantitySum = details.reduce((acc, item) => acc + item.q, 0);
        return sum + quantitySum;
      },
      0
    );

    // Fetch online payments for offers
    const onlinePaymentsOffers = await prisma.paymentOffer.findMany({
      where: {
        isPayed: true,
        order: { isNot: null }, // Online offers have an associated order
        createdAt: dateFilter,
      },
      select: {
        details: true,
      },
    });

    // Calculate total quantities for online offers
    const totalQuantityOffersOnline = onlinePaymentsOffers.reduce(
      (sum, payment) => {
        const details = JSON.parse(payment.details);
        const quantitySum = details.reduce((acc, item) => acc + item.q, 0);
        return sum + quantitySum;
      },
      0
    );

    // Count delivered orders
    const deliveredOrders = await prisma.order.count({
      where: {
        status: "LIVREE",
        createdAt: dateFilter,
      },
    });

    // Count returned (refused) orders
    const returnOrders = await prisma.order.count({
      where: {
        status: "REFUSE",
        createdAt: dateFilter,
      },
    });

    // Prepare the response structure
    const response = {
      offlinePayments: {
        products: offlinePaymentsProducts.length,
        offers: offlinePaymentsOffers.length,
        totalQuantityProducts: totalQuantityProductsOffline,
        totalQuantityOffers: totalQuantityOffersOffline,
      },
      onlinePayments: {
        products: onlinePaymentsProducts.length,
        offers: onlinePaymentsOffers.length,
        totalQuantityProducts: totalQuantityProductsOnline,
        totalQuantityOffers: totalQuantityOffersOnline,
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
      deliveredOrders: deliveredOrders,
      returnedOrders: returnOrders,
    };

    // Send the response
    res.status(200).json(response);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while counting payments for the day" });
  }
};
const countAllPaymentsWithDayRange = async (req, res) => {
  const { dayId } = req.params;
  try {
    const day = await prisma.day.findUnique({
      where: { id: parseInt(dayId) },
      select: {
        startAt: true,
        stopeAt: true,
      },
    });

    if (!day) {
      return res.status(404).json({ message: "Journée non trouvée" });
    }
    const { startAt, stopeAt } = day; // Get day range from query parameters

    const dateFilter = getDateRangeFilter(startAt, stopeAt); // Apply the date range filter
   
    // Count offline payments for products
    const countPaymentProductsOffline = await prisma.payment.count({
      where: {
        isPayed: true,
        order: null,
        createdAt: dateFilter,
      },
    });

    // Count offline payments for offers
    const countPaymentOffersOffline = await prisma.paymentOffer.count({
      where: {
        isPayed: true,
        order: null,
        createdAt: dateFilter,
      },
    });

    // Count online payments for products
    const countPaymentProductsOnline = await prisma.payment.count({
      where: {
        isPayed: true,
        order: { isNot: null },
        createdAt: dateFilter,
      },
    });

    // Count online payments for offers
    const countPaymentOffersOnline = await prisma.paymentOffer.count({
      where: {
        isPayed: true,
        order: { isNot: null },
        createdAt: dateFilter,
      },
    });

    // Count delivered orders
    const deliveredOrders = await prisma.order.count({
      where: {
        status: "LIVREE",
        createdAt: dateFilter,
      },
    });

    // Count returned (refused) orders
    const returnOrders = await prisma.order.count({
      where: {
        status: "REFUSE",
        createdAt: dateFilter,
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
      deliveredOrders: deliveredOrders,
      returnedOrders: returnOrders,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while counting payments" });
  }
};
const countAllPaymentsForDateRangeWithQ = async (req, res) => {
  const { dayId } = req.params; // Get the day ID from the request parameters

  try {
    // Fetch the date range based on the provided dayId
    const day = await prisma.day.findUnique({
      where: { id: Number(dayId) }, // Ensure dayId is a number
      select: {
        startAt: true,
        stopeAt: true,
      },
    });

    if (!day) {
      return res.status(404).json({ error: "Day not found" });
    }

    const { startAt, stopeAt } = day;
    const dateFilter = {
      gte: startAt, // Start date filter
    };

    if (stopeAt) {
      dateFilter.lte = stopeAt; // Add the lte filter if stopeAt is not null
    }

    // Fetch offline and online payments for products
    const paymentsProducts = await prisma.payment.findMany({
      where: {
        isPayed: true,
        createdAt: dateFilter,
      },
      select: {
        details: true,
      },
    });

    // Fetch offline and online payments for offers
    const paymentsOffers = await prisma.paymentOffer.findMany({
      where: {
        isPayed: true,
        createdAt: dateFilter,
      },
      select: {
        details: true,
      },
    });

    // Aggregating product payments
    const productAggregates = paymentsProducts.reduce((acc, payment) => {
      const details = JSON.parse(payment.details);
      details.forEach((item) => {
        const productName = item.name; // Get product name from details
        const categoryName = item.category; // Get category name from details
        const fullName = `${categoryName} ${productName}`; // Concatenate category and product names
    
        const capitalizedFullName = fullName.charAt(0).toUpperCase() + fullName.slice(1); // Capitalize first letter
    
        const quantity = item.q;
    
        if (!acc[capitalizedFullName]) {
          acc[capitalizedFullName] = {
            count: 0,
            totalQuantity: 0,
          };
        }
        acc[capitalizedFullName].count += 1;
        acc[capitalizedFullName].totalQuantity += quantity;
      });
      return acc;
    }, {});

    // Aggregating offer payments
    const offerAggregates = paymentsOffers.reduce((acc, payment) => {
      const details = JSON.parse(payment.details);
      details.forEach((item) => {
        const offerName = item.name.charAt(0).toUpperCase() +item.name.slice(1) ;
        const quantity = item.q;

        if (!acc[offerName]) {
          acc[offerName] = {
            count: 0,
            totalQuantity: 0,
          };
        }
        acc[offerName].count += 1;
        acc[offerName].totalQuantity += quantity;
      });
      return acc;
    }, {});
    const totalPaymentCountProducts = paymentsProducts.length; // Count of total payments for products

    // After aggregating offer payments
    const totalPaymentCountOffers = paymentsOffers.length; // Count of total payments for offers

    // Prepare the response structure
    const response = {
      offers: offerAggregates,
      products: productAggregates,
      totalPaymentCountProducts, // Add total payment count for products
      totalPaymentCountOffers,
    };

    // Send the response
    res.status(200).json(response);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while counting payments for the day" });
  }
};

// const countAllPaymentsWithQAndDayRange = async (req, res) => {
//   const { dayId } = req.params;
//   try {
//     const day = await prisma.day.findUnique({
//       where: { id: parseInt(dayId) },
//       select: {
//         startAt: true,
//         stopeAt: true,
//       },
//     });

//     if (!day) {
//       return res.status(404).json({ message: "Day not found" });
//     }
//     const { startAt, stopeAt } = day;

//     // Fetch offline payments for products
//     const offlinePaymentsProducts = await prisma.payment.findMany({
//       where: {
//         isPayed: true,
//         order: null,
//         createdAt: {
//           gte: new Date(startAt),
//           lte: new Date(stopeAt),
//         },
//       },
//       select: {
//         details: true,
//       },
//     });

//     // Sum product quantities for offline payments
//     const totalQuantityProductsOffline = offlinePaymentsProducts.reduce(
//       (sum, payment) => {
//         const details = JSON.parse(payment.details);
//         const quantitySum = details.reduce((acc, item) => acc + item.q, 0);
//         return sum + quantitySum;
//       },
//       0
//     );

//     // Fetch offline payments for offers
//     const offlinePaymentsOffers = await prisma.paymentOffer.findMany({
//       where: {
//         isPayed: true,
//         order: null,
//         createdAt: {
//           gte: new Date(startAt),
//           lte: new Date(stopeAt),
//         },
//       },
//       select: {
//         details: true,
//       },
//     });

//     // Sum offer quantities for offline payments
//     const totalQuantityOffersOffline = offlinePaymentsOffers.reduce(
//       (sum, payment) => {
//         const details = JSON.parse(payment.details);
//         const quantitySum = details.reduce((acc, item) => acc + item.q, 0);
//         return sum + quantitySum;
//       },
//       0
//     );

//     // Fetch online payments for products
//     const onlinePaymentsProducts = await prisma.payment.findMany({
//       where: {
//         isPayed: true,
//         order: { isNot: null },
//         createdAt: {
//           gte: new Date(startAt),
//           lte: new Date(stopeAt),
//         },
//       },
//       select: {
//         details: true,
//       },
//     });

//     // Sum product quantities for online payments
//     const totalQuantityProductsOnline = onlinePaymentsProducts.reduce(
//       (sum, payment) => {
//         const details = JSON.parse(payment.details);
//         const quantitySum = details.reduce((acc, item) => acc + item.q, 0);
//         return sum + quantitySum;
//       },
//       0
//     );

//     // Fetch online payments for offers
//     const onlinePaymentsOffers = await prisma.paymentOffer.findMany({
//       where: {
//         isPayed: true,
//         order: { isNot: null },
//         createdAt: {
//           gte: new Date(startAt),
//           lte: new Date(stopeAt),
//         },
//       },
//       select: {
//         details: true,
//       },
//     });

//     // Sum offer quantities for online payments
//     const totalQuantityOffersOnline = onlinePaymentsOffers.reduce(
//       (sum, payment) => {
//         const details = JSON.parse(payment.details);
//         const quantitySum = details.reduce((acc, item) => acc + item.q, 0);
//         return sum + quantitySum;
//       },
//       0
//     );

//     // Send all counts as a JSON response, including the sum of quantities
//     res.status(200).json({
//       offlinePayments: {
//         products: offlinePaymentsProducts.length,
//         offers: offlinePaymentsOffers.length,
//         totalQuantityProducts: totalQuantityProductsOffline,
//         totalQuantityOffers: totalQuantityOffersOffline,
//       },
//       onlinePayments: {
//         products: onlinePaymentsProducts.length,
//         offers: onlinePaymentsOffers.length,
//         totalQuantityProducts: totalQuantityProductsOnline,
//         totalQuantityOffers: totalQuantityOffersOnline,
//       },
//       totalPayments: {
//         offline: {
//           count: offlinePaymentsProducts.length + offlinePaymentsOffers.length,
//           totalQuantityProducts: totalQuantityProductsOffline,
//           totalQuantityOffers: totalQuantityOffersOffline,
//         },
//         online: {
//           count: onlinePaymentsProducts.length + onlinePaymentsOffers.length,
//           totalQuantityProducts: totalQuantityProductsOnline,
//           totalQuantityOffers: totalQuantityOffersOnline,
//         },
//         all: {
//           count:
//             offlinePaymentsProducts.length +
//             offlinePaymentsOffers.length +
//             onlinePaymentsProducts.length +
//             onlinePaymentsOffers.length,
//           totalQuantityProducts:
//             totalQuantityProductsOffline + totalQuantityProductsOnline,
//           totalQuantityOffers:
//             totalQuantityOffersOffline + totalQuantityOffersOnline,
//         },
//       },
//     });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ error: "An error occurred while counting payments" });
//   }
// };
// const countPaymentsByProductWithDayRange = async (req, res) => {
//   const { dayId } = req.params;
//   try {
//     const day = await prisma.day.findUnique({
//       where: { id: parseInt(dayId) },
//       select: {
//         startAt: true,
//         stopeAt: true,
//       },
//     });

//     if (!day) {
//       return res.status(404).json({ message: "Day not found" });
//     }
//     const { startAt, stopeAt } = day;

//     // Fetch each product and count how many payments it has within the day range
//     const productPaymentCounts = await prisma.product.findMany({
//       select: {
//         name: true, // Get product name
//         _count: {
//           select: {
//             payments: {
//               where: {
//                 isPayed: true,
//                 order: null,
//                 createdAt: {
//                   gte: new Date(startAt),
//                   lte: new Date(stopeAt),
//                 },
//               },
//             },
//           },
//         },
//       },
//     });

//     // Format the response as { productName: numberOfPayments }
//     const result = productPaymentCounts.reduce((acc, product) => {
//       acc[product.name] = product._count.payments;
//       return acc;
//     }, {});

//     // Return the result in the desired format
//     res.status(200).json(result);
//   } catch (error) {
//     console.error("Error counting payments by product:", error.message);
//     res
//       .status(500)
//       .json({ error: "An error occurred while counting payments by product" });
//   }
// };
// const countPaymentsByOfferWithDayRange = async (req, res) => {
//   const { dayId } = req.params;
//   try {
//     const day = await prisma.day.findUnique({
//       where: { id: parseInt(dayId) },
//       select: {
//         startAt: true,
//         stopeAt: true,
//       },
//     });

//     if (!day) {
//       return res.status(404).json({ message: "Day not found" });
//     }
//     const { startAt, stopeAt } = day;

//     // Fetch each offer and count how many payments it has within the day range
//     const offerPaymentCounts = await prisma.offer.findMany({
//       select: {
//         title: true, // Get offer title
//         _count: {
//           select: {
//             payments: {
//               where: {
//                 isPayed: true,
//                 order: null,
//                 createdAt: {
//                   gte: new Date(startAt),
//                   lte: new Date(stopeAt),
//                 },
//               },
//             },
//           },
//         },
//       },
//     });

//     // Format the response as { offerTitle: numberOfPayments }
//     const result = offerPaymentCounts.reduce((acc, offer) => {
//       acc[offer.title] = offer._count.payments;
//       return acc;
//     }, {});

//     // Return the result in the desired format
//     res.status(200).json(result);
//   } catch (error) {
//     console.error("Error counting payments by offer:", error.message);
//     res
//       .status(500)
//       .json({ error: "An error occurred while counting payments by offer" });
//   }
// };

module.exports = {
  getAllDays,
  getDayById,
  createDay,
  updateDay,
  deleteDay,
  getLatestDay,
  countAllPaymentsForDay,
  countAllPaymentsWithDayRange,
  countAllPaymentsForDateRangeWithQ,
};
