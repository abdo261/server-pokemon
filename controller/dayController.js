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
      message: "Error retrieving days: " + error.message,
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
      return res.status(404).json({ message: "Day not found" });
    }
    res.status(200).json(day);
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving the day: " + error.message,
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
      message: `Day created successfully`,
      day,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating the day: " + error.message,
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
      return res.status(404).json({ message: "Day not found" });
    }

    const updatedDay = await prisma.day.update({
      where: { id: parseInt(id) },
      data: {
        startAt: new Date(startAt), // Ensure startAt is a Date object
        stopeAt: stopeAt ? new Date(stopeAt) : null, // Handle optional stopeAt
      },
    });

    res.status(200).json({
      message: "Day updated successfully",
      day: updatedDay,
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: "Error updating the day: " + error.message,
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
      return res.status(404).json({ message: "Day not found" });
    }

    await prisma.day.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({ message: "Day deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting the day: " + error.message,
    });
  }
}
async function getLatestDay(req, res) {
    try {
      const latestDay = await prisma.day.findFirst({
        orderBy: {
          startAt: "desc", 
        },
      });
      
      if (!latestDay) {
        return res.status(404).json({ message: "No days found" });
      }
      
      res.status(200).json(latestDay);
    } catch (error) {
        
      res.status(500).json({
        message: "Error retrieving the latest day: " + error.message,
      });
    }
  }
module.exports = {
  getAllDays,
  getDayById,
  createDay,
  updateDay,
  deleteDay,
  getLatestDay
};
