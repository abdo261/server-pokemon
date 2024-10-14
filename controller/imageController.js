const fs = require("fs");
const path = require("path");

const getImageCategoryByName = (req, res) => {
  const nameCategory = req.params.name;
  

  // Define the correct path to the images directory
  const imagePath = path.join(
    __dirname,
    "..", // Go up one directory level
    "images",
    "category",
    nameCategory // Use the full name with extension
  );


  // Check if the file exists
  fs.stat(imagePath, (err) => {
    if (err) {
      if (err.code === "ENOENT") {
        // File does not exist
        return res.status(404).json({ message: "Image not found" });
      }
      // Other errors
      return res.status(500).json({ message: "Internal server error" });
    }

    // File exists, send it to the client
    res.sendFile(imagePath, (err) => {
      if (err) {
        return res.status(500).json({ message: "Error sending the image" });
      }
    });
  });
};
const getImageProductByName = (req, res) => {
  const nameCategory = req.params.name;


  // Define the correct path to the images directory
  const imagePath = path.join(
    __dirname,
    "..", 
    "images",
    "product",
    nameCategory // Use the full name with extension
  );



  // Check if the file exists
  fs.stat(imagePath, (err) => {
    if (err) {
      if (err.code === "ENOENT") {
     
        return res.status(404).json({ message: "Image not found" });
      }
      // Other errors
      return res.status(500).json({ message: "Internal server error" });
    }

    // File exists, send it to the client
    res.sendFile(imagePath, (err) => {
      if (err) {
        return res.status(500).json({ message: "Error sending the image" });
      }
    });
  });
};
const getImageOfferByName = (req, res) => {
  const nameCategory = req.params.name;


  // Define the correct path to the images directory
  const imagePath = path.join(
    __dirname,
    "..", 
    "images",
    "offer",
    nameCategory // Use the full name with extension
  );

  // Log the full image path for debugging


  // Check if the file exists
  fs.stat(imagePath, (err) => {
    if (err) {
      if (err.code === "ENOENT") {
     
        return res.status(404).json({ message: "Image not found" });
      }
      // Other errors
      return res.status(500).json({ message: "Internal server error" });
    }

    // File exists, send it to the client
    res.sendFile(imagePath, (err) => {
      if (err) {
        return res.status(500).json({ message: "Error sending the image" });
      }
    });
  });
};

async function deleteImage(imagePath) {
  const fullImagePath = path.join(__dirname, '..', imagePath); 
  try {
    if (fs.existsSync(fullImagePath)) {
      fs.unlinkSync(fullImagePath); 
   
    }
  } catch (error) {
    console.error(`Error deleting image: ${error.message}`);
  }
}
async function renameImage(oldPath, newPath) {
  const oldFilePath = path.join(__dirname,'..', oldPath); 
  const newFilePath = path.join(__dirname,'..', newPath); 

  return new Promise((resolve, reject) => {
    fs.rename(oldFilePath, newFilePath, (err) => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
}


module.exports = { getImageCategoryByName,deleteImage,renameImage,getImageProductByName,getImageOfferByName };
