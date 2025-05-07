const itemController = require("../../controllers/itemController");
const CustomError = require("../../utils/customError");
const Item = require("../../models/Item");
const CustomSuccess = require("../../utils/customSuccess");

jest.mock("../../utils/customError", () => ({
    unauthorized: jest.fn(),
    notFound: jest.fn()
}));
jest.mock("../../utils/customSuccess");
jest.mock("../../models/Item", () => ({
    find: jest.fn(),
    findById: jest.fn()
}))

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
        })
    })
})