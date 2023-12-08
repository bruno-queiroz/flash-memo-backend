import request from "supertest";
import { createApp } from "../src/app";
import { jest } from "@jest/globals";
import { allowedUrl } from "./mocks/allowedUrl";
import { generateJwtToken } from "./mocks/generateJwtToken";
import { prismaMock } from "./mocks/singleton";
import { user } from "./mocks/user";
import { mocked as jestMocked } from "jest-mock";
import bcrypt from "bcrypt";

jest.mock("bcrypt");

const app = createApp();
const jwtToken = generateJwtToken();

describe("Testing signIn controller", () => {
  it("POST to /sign-in should be successful", async () => {
    const mocked = prismaMock.user.findUniqueOrThrow.mockResolvedValue(
      user as any
    );

    jestMocked(bcrypt).compare.mockResolvedValue(true as never);

    const response = await request(app)
      .post("/sign-in")
      .set("Origin", allowedUrl)
      .send({ name: "jubi", password: "123" });

    expect(mocked.mock.calls).toHaveLength(1);
    expect(response.body?.data).toMatchObject({ name: user.name, id: user.id });
    expect(response.body?.isOk).toBe(true);
    expect(response.status).toBe(200);
  });
});
