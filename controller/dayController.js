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
    const day = await prisma.day.findUnique({
      where: { id: parseInt(id) },
    });
    if (!day) {
      return res.status(404).json({ message: "Journée non trouvée" });
    }
    res.status(200).json(day);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération de la journée : " + error.message,
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
    console.log(error);
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
      message: "Erreur lors de la récupération de la dernière journée : " + error.message,
    });
  }
}

module.exports = {
  getAllDays,
  getDayById,
  createDay,
  updateDay,
  deleteDay,
  getLatestDay,
};
