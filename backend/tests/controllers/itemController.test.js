const itemController = require("../../controllers/itemController");
const CustomError = require("../../utils/customError");

jest.mock("../../utils/customError", () => ({
    unauthorized: jest.fn()
}));

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
        })
    })
})