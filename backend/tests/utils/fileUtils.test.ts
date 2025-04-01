import fs from "fs";
import path from "path";
import { readJson } from "../../src/utils/fileUtils";

jest.mock("fs", () => ({
    promises: {
      readFile: jest.fn(),
    },
  }));

describe("fileUtils - readJson", () => {
  const mockData = { key: "value" };
  const mockFileName = "test";
  const mockFilePath = path.join(__dirname, "../../src/data", `${mockFileName}.json`);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("reads JSON file correctly", async () => {
    (fs.promises.readFile as jest.Mock).mockResolvedValueOnce(JSON.stringify(mockData));

    const result = await readJson(mockFileName);

    expect(fs.promises.readFile).toHaveBeenCalledWith(mockFilePath, "utf-8");
    expect(result).toEqual(mockData);
  });

  test("throws an error if file reading fails", async () => {
    (fs.promises.readFile as jest.Mock).mockRejectedValueOnce(new Error("File not found"));

    await expect(readJson("missing-file")).rejects.toThrow("Error reading file missing-file.json: File not found");
    expect(fs.promises.readFile).toHaveBeenCalledTimes(1);
  });

  test("throws an error if JSON is invalid", async () => {
    (fs.promises.readFile as jest.Mock).mockResolvedValueOnce("invalid JSON");

    await expect(readJson(mockFileName)).rejects.toThrow(`Error reading file ${mockFileName}.json`);
    expect(fs.promises.readFile).toHaveBeenCalledWith(mockFilePath, "utf-8");
  });
});
