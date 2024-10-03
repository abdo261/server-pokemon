const {
    getAllOffers,
    getOfferById,
    createOffer,
    updateOffer,
    deleteOffer,
  } = require('../controller/offerController');
  const { uploadOffer } = require('../middleware/upload');
  
  const offerRouter = require('express').Router();
  
  offerRouter.get('/', getAllOffers);
  offerRouter.get('/:id', getOfferById);
  offerRouter.post('/', uploadOffer.single('image'), createOffer);
  offerRouter.put('/:id', uploadOffer.single('image'), updateOffer);
  offerRouter.delete('/:id', deleteOffer);
  
  module.exports = offerRouter;
  