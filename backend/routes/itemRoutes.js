const { Router } = require("express");
const itemController = require("../controllers/itemController");
const itemValidators = require("../middleware/validationMiddleware")


const router = Router();

router.get("/api/", itemController.getAllItems);
router.get("/api/details/:id", itemValidators.findItemValidator, itemController.getItemDetails);
router.post("/api/library", itemValidators.addingItemValidator, itemController.saveItemToLibrary);
router.put("/api/lend", itemValidators.lendItemValidator, itemController.lendItem);
router.put("/api/return", itemValidators.findItemValidator, itemController.returnItem);
router.put("/api/comment", itemValidators.addCommentValidator, itemController.updateComments);
router.delete("/api/delete", itemValidators.findItemValidator, itemController.deleteItem);


module.exports = router;