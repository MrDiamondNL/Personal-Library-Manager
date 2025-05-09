const Basic = require("../../models/Basic");

jest.mock("../../models/Basic");

test("This jesus constructor test", () => {
    const testBasic = new Basic();

    expect(Basic).toHaveBeenCalled();
})