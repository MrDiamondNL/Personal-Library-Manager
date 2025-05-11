const itemController = require("../../controllers/itemController");
const CustomError = require("../../utils/customError");
const Item = require("../../models/Item");
const CustomSuccess = require("../../utils/customSuccess");

jest.mock("../../utils/customError", () => ({
    unauthorized: jest.fn(),
    notFound: jest.fn(),
    internalServer: jest.fn()
}));
jest.mock("../../utils/customSuccess");
jest.mock("../../models/Item");

describe("itemController", () => {
    describe("getAllItems", () => {
        beforeEach(() => {
            jest.clearAllMocks();
        });

        test("Should return user not authenticated when user not attached to req", () => {
            const req = "noUser";
            const res = {};
            const next = jest.fn();
            const mockError = {
                statusCode: 401,
                message: "User not authenticated"
            }
            CustomError.unauthorized.mockReturnValue(mockError);

            itemController.getAllItems(req, res, next);

            expect(next).toHaveBeenCalledWith(mockError);
            expect(CustomError.unauthorized).toHaveBeenCalledWith("User not authenticated");
        });

        test("Should return collection not found when user not found",  () => {
            const req = {
                user: {
                    id: "12345"
                }
            };
            const res = {};
            const next = jest.fn();
            const mockError = {
                statusCode: 404,
                message: "Could not fetch collection"
            }
            Item.find.mockReturnValue(Promise.reject(new Error()));
            CustomError.notFound.mockReturnValue(mockError);

            return itemController.getAllItems(req, res, next).then(() => {
                expect(next).toHaveBeenCalledWith(mockError);
                expect(CustomError.notFound).toHaveBeenCalledWith("Could not fetch collection");
            });
        });

        test("Should return library found if req.user.id exists and is found", () => {
            const req = {
                user: {
                    id: "12345"
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const next = jest.fn();
            const result = { result: "Found Book"};
            const mockSuccess = {
                statusCode: 200,
                message: "Library found",
                result: result
            }
            Item.find.mockReturnValue(Promise.resolve(result));
            CustomSuccess.mockReturnValue(mockSuccess);

            return itemController.getAllItems(req, res, next).then(() => {
                expect(Item.find).toHaveBeenCalledWith({ user: "12345" });
                expect(CustomSuccess).toHaveBeenCalledWith("Library found", 200, result);
                expect(res.status).toHaveBeenCalledWith(200);
                expect(res.json).toHaveBeenCalledWith(mockSuccess);
                expect(next).not.toHaveBeenCalled();
            });
        });
    });

    describe("getItemDetails", () => {
        beforeEach(() => {
            jest.clearAllMocks();
        });

        test("Should return could not find item if invalid item id provided", () => {
            const req = {
                params: {
                    id: "12345"
                }
            };
            const res = {};
            const next = jest.fn();
            const mockError = {
                statusCode: 404,
                message: "Could not find item"
            }
            CustomError.notFound.mockReturnValue(mockError);
            Item.findById.mockReturnValue(Promise.reject(new Error()));

            return itemController.getItemDetails(req, res, next).then(() => {
                expect(next).toHaveBeenCalledWith(mockError);
                expect(CustomError.notFound).toHaveBeenCalledWith("Could not find item");
            });    
        });

        test("Should return Item Found if item is found", () => {
            const req = {
                params: {
                    id: "12345"
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const next = jest.fn();
            const result = { result: "Found Book"};
            const mockSuccess = {
                statusCode: 200,
                message: "Item Details found",
                result: result
            }
            Item.findById.mockReturnValue(Promise.resolve(result));
            CustomSuccess.mockReturnValue(mockSuccess);

            return itemController.getItemDetails(req, res, next).then(() => {
                expect(Item.findById).toHaveBeenCalledWith("12345");
                expect(CustomSuccess).toHaveBeenCalledWith("Item Details found", 200, result);
                expect(res.status).toHaveBeenCalledWith(200);
                expect(res.json).toHaveBeenCalledWith(mockSuccess);
                expect(next).not.toHaveBeenCalled();
            });
        });
    });

    describe("saveItemToLibrary", () => {
        beforeEach(() => {
            jest.clearAllMocks();
        });

        test("Should return interanl server if something fails", async () => {
            const req = {
                body: { title: "Test Book" }
            }
            const res = {}
            const next = jest.fn();
            const mockError = {
                statusCode: 500,
                message: "Congrats, you broke it all"
            }
            CustomError.internalServer.mockReturnValue(mockError);
            Item.mockImplementationOnce(() => {
                throw CustomError.internalServer("Congrats, you broke it all");
            });

            await itemController.saveItemToLibrary(req, res, next);
            
            expect(next).toHaveBeenCalledWith(mockError);
            expect(CustomError.internalServer).toHaveBeenCalledWith("Congrats, you broke it all");
        });

        test("Should return item failed to save if save fails", async () => {
            const req = {
                body: { title: "Test Book" }
            }
            const res = {}
            const next = jest.fn();
            const mockError = {
                statusCode: 500,
                message: "Failed to save item"
            }
            CustomError.internalServer.mockReturnValue(mockError);
            Item.mockImplementationOnce(() => ({
                save: jest.fn().mockReturnValue(Promise.reject(new Error()))
            }));

            await itemController.saveItemToLibrary(req, res, next);

            expect(next).toHaveBeenCalledWith(mockError);
            expect(CustomError.internalServer).toHaveBeenCalledWith("Failed to save item");
        });

        test("Should return 201 when item successfully saved", async () => {
            const req = {
                body: { title: "Test Book" }
            }
            const res = {
                status: jest.fn().mockReturnThis(),
                message: "Item saved to library",
                json: jest.fn()
            }
            const next = jest.fn();
            const mockSuccess = {
                statusCode: 201,
                message: "Item saved to Library"
            }
            const book = { title: "New book" };
            CustomSuccess.mockImplementation(function(message, statusCode) {
                this.message = message;
                this.statusCode = statusCode;
                return this;
            });
            Item.mockImplementationOnce(() => ({
                save: jest.fn().mockResolvedValue(book)
            }));
            

            await itemController.saveItemToLibrary(req, res, next);

            expect(CustomSuccess).toHaveBeenCalledWith("Item saved to Library", 201);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(mockSuccess);
            expect(next).not.toHaveBeenCalled();
        });
    });

    describe("lendItem", () => {
        beforeEach(() => {
            jest.clearAllMocks();
        });

        test("Should return failed to update on failure to update", async () => {
            const req = {
                body: {
                    id: "12345",
                    email: "test@email.com"
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const next = jest.fn();
            const mockError = {
                statusCode: 500,
                message: "Failed to update"
            }
            Item.findByIdAndUpdate.mockReturnValue(new Error());
            CustomError.internalServer.mockReturnValue(mockError);

            await itemController.lendItem(req, res, next);

            expect(CustomError.internalServer).toHaveBeenCalledWith("Failed to update");
            expect(next).toHaveBeenCalledWith(mockError);
        });

        test("Should return could not find item if unable to find item", async () => {
            const req = {
                body: {
                    id: "507f1f77bcf86cd799439011",
                    email: "test@email.com"
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const next = jest.fn();
            const mockError = {
                statusCode: 404,
                message: "Could not find item"
            }
            Item.findByIdAndUpdate.mockResolvedValue(false);
            CustomError.notFound.mockReturnValue(mockError);

            await itemController.lendItem(req, res, next);

            expect(CustomError.notFound).toHaveBeenCalledWith("Could not find item");
            expect(next).toHaveBeenCalledWith(mockError);
        });

        test("Should return status 200 when item successfully updated", async () => {
            const req = {
                body: {
                    id: "507f1f77bcf86cd799439011",
                    email: "test@email.com"
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const next = jest.fn();
            const mockSuccess = {
                statusCode: 200,
                message: "Item Updated"
            }
            Item.findByIdAndUpdate.mockResolvedValue(true);
            CustomSuccess.mockReturnValue(mockSuccess);

            await itemController.lendItem(req, res, next);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockSuccess);
            expect(CustomSuccess).toHaveBeenCalled();
            expect(next).not.toHaveBeenCalled();
        });
    });

    describe("returnItem", () => {
        beforeEach(() => {
            jest.clearAllMocks();
        });

        test("Should return failed to update on failure to update", async () => {
            const req = {
                body: {
                    id: "12345"
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const next = jest.fn();
            const mockError = {
                statusCode: 500,
                message: "Failed to update"
            }
            Item.findByIdAndUpdate.mockReturnValue(new Error());
            CustomError.internalServer.mockReturnValue(mockError);

            await itemController.returnItem(req, res, next);

            expect(CustomError.internalServer).toHaveBeenCalledWith("Failed to update");
            expect(next).toHaveBeenCalledWith(mockError);
        });

        test("Should return could not find item if unable to find item", async () => {
            const req = {
                body: {
                    id: "507f1f77bcf86cd799439011"
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const next = jest.fn();
            const mockError = {
                statusCode: 404,
                message: "Could not find item"
            }
            Item.findByIdAndUpdate.mockResolvedValue(false);
            CustomError.notFound.mockReturnValue(mockError);

            await itemController.returnItem(req, res, next);

            expect(CustomError.notFound).toHaveBeenCalledWith("Could not find item");
            expect(next).toHaveBeenCalledWith(mockError);
        });

        test("Should return status 200 when item successfully updated", async () => {
            const req = {
                body: {
                    id: "507f1f77bcf86cd799439011"
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const next = jest.fn();
            const mockSuccess = {
                statusCode: 200,
                message: "Item Updated"
            }
            Item.findByIdAndUpdate.mockResolvedValue(true);
            CustomSuccess.mockReturnValue(mockSuccess);

            await itemController.returnItem(req, res, next);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockSuccess);
            expect(CustomSuccess).toHaveBeenCalled();
            expect(next).not.toHaveBeenCalled();
        });
    });

    describe("deleteItem", () => {
        beforeEach(() => {
            jest.clearAllMocks();
        });

        test("Should return failed to delete if failure to run function", async () => {
            const req = {
                body: {
                    id: "507f1f77bcf86cd799439011"
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const next = jest.fn();
            const mockError = {
                statusCode: 500,
                message: "Failed to Delete"
            }
            Item.findByIdAndDelete.mockRejectedValue(new Error());
            CustomError.internalServer.mockReturnValue(mockError);

            await itemController.deleteItem(req, res, next);

            expect(CustomError.internalServer).toHaveBeenCalledWith("Failed to Delete");
            expect(next).toHaveBeenCalledWith(mockError);
        });

        test("Should return could not find item if the item isn't foound", async () => {
            const req = {
                body: {
                    id: "507f1f77bcf86cd799439011"
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const next = jest.fn();
            const mockError = {
                statusCode: 404,
                message: "Could not find item"
            }
            Item.findByIdAndDelete.mockResolvedValue(false);
            CustomError.notFound.mockReturnValue(mockError);

            await itemController.deleteItem(req, res, next);

            expect(CustomError.notFound).toHaveBeenCalledWith("Could not find item");
            expect(next).toHaveBeenCalledWith(mockError);
        });

        test("Should return 200 if item is found and deleted", async () => {
            const req = {
                body: {
                    id: "507f1f77bcf86cd799439011"
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const next = jest.fn();
            const mockSuccess = {
                statusCode: 200,
                message: "Item Deleted"
            }
            Item.findByIdAndDelete.mockResolvedValue(true);
            CustomSuccess.mockReturnValue(mockSuccess);

            await itemController.deleteItem(req, res, next);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockSuccess);
            expect(CustomSuccess).toHaveBeenCalled();
            expect(next).not.toHaveBeenCalled();
        });
    });

    describe("updateComments", () => {
        beforeEach(() => {
            jest.clearAllMocks();
        });

        test("Should return failed to save if function fails", async () => {
            const req = {
                body: {
                    id: "507f1f77bcf86cd799439011",
                    comment: "Test Comment"
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const next = jest.fn();
            const mockError = {
                statusCode: 500,
                message: "Failed to save"
            }
            Item.findByIdAndUpdate.mockRejectedValue(new Error());
            CustomError.internalServer.mockReturnValue(mockError);

            await itemController.updateComments(req, res, next);

            expect(CustomError.internalServer).toHaveBeenCalledWith("Failed to save");
            expect(next).toHaveBeenCalledWith(mockError);
        });

        test("Should return could not find item if item not found", async () => {
            const req = {
                body: {
                    id: "507f1f77bcf86cd799439011",
                    comment: "Test Comment"
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const next = jest.fn();
            const mockError = {
                statusCode: 404,
                message: "Could not find item"
            }
            Item.findByIdAndUpdate.mockResolvedValue(false);
            CustomError.notFound.mockReturnValue(mockError);

            await itemController.updateComments(req, res, next);

            expect(CustomError.notFound).toHaveBeenCalledWith("Could not find item");
            expect(next).toHaveBeenCalledWith(mockError);
        });

        test("Should return 200 if Item found and comments updated", async () => {
            const req = {
                body: {
                    id: "507f1f77bcf86cd799439011",
                    comment: "Test Comment"
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const next = jest.fn();
            const mockSuccess = {
                statusCode: 200,
                message: "Comments Updated"
            }

            Item.findByIdAndUpdate.mockResolvedValue(true);
            CustomSuccess.mockReturnValue(mockSuccess);

            await itemController.updateComments(req, res, next);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockSuccess);
            expect(CustomSuccess).toHaveBeenCalled();
            expect(next).not.toHaveBeenCalled();
        })
    });
});