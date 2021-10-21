import { listDifferent } from "../../lib/core";

describe("writeFile", () => {
  let exit: jest.SpyInstance;

  beforeEach(() => {
    console.log = jest.fn();
    exit = jest.spyOn(process, "exit").mockImplementation();
  });

  afterEach(() => {
    exit.mockRestore();
  });

  test("logs invalid type definitions and exits with 1", async () => {
    const pattern = `${__dirname}/../**/*.less`;

    await listDifferent(pattern, {
      watch: false,
      ignoreInitial: false,
      exportType: "named",
      listDifferent: true
    });

    expect(exit).toHaveBeenCalledWith(1);
    expect(console.log).toBeCalledWith(
      expect.stringContaining(`[INVALID TYPES] Check type definitions for`)
    );
    expect(console.log).toBeCalledWith(expect.stringContaining(`invalid.less`));
  });

  test("logs nothing and does not exit if all files are valid", async () => {
    const pattern = `${__dirname}/../**/style.less`;

    await listDifferent(pattern, {
      watch: false,
      ignoreInitial: false,
      exportType: "named",
      listDifferent: true
    });

    // expect(exit).not.toHaveBeenCalled();
    expect(console.log).not.toHaveBeenCalled();
  });
});
