const { Router } = require("express");
const itemController = require("../controllers/itemController");

const router = Router();

router.get("/api/", itemController.getAllItems);
router.get("/api/details/:id", itemController.getItemDetails);
router.post("/api/library", itemController.saveItemToLibrary);
router.put("/api/lend", itemController.lendItem);
router.put("/api/return", itemController.returnItem);
router.put("/api/comment", itemController.updateComments);
router.delete("/api/delete", itemController.deleteITem);


module.exports = router;