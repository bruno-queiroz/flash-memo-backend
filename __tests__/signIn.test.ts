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

describe("Testing signIn controller", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("POST to /sign-in should be successful", async () => {
    const mocked = prismaMock.user.findUniqueOrThrow.mockResolvedValue(
      user as any
    );

    const bcryptMocked = jestMocked(bcrypt).compare.mockResolvedValue(
      true as never
    );

    const response = await request(app)
      .post("/sign-in")
      .set("Origin", allowedUrl)
      .send({ name: "jubi", password: "123" });

    expect(bcryptMocked.mock.calls).toHaveLength(1);
    expect(mocked.mock.calls).toHaveLength(1);
    expect(response.body?.data).toMatchObject({ name: user.name, id: user.id });
    expect(response.body?.isOk).toBe(true);
    expect(response.status).toBe(200);
  });
  it("POST to /sign-in should fail when password is incorrect", async () => {
    const mocked = prismaMock.user.findUniqueOrThrow.mockResolvedValue(
      user as any
    );

    const bcryptMocked = jestMocked(bcrypt).compare.mockResolvedValue(
      false as never
    );

    const response = await request(app)
      .post("/sign-in")
      .set("Origin", allowedUrl)
      .send({ name: "jubi", password: "123" });

    expect(bcryptMocked.mock.calls).toHaveLength(1);
    expect(mocked.mock.calls).toHaveLength(1);
    expect(response.body?.isOk).toBe(false);
    expect(response.status).toBe(400);
  });
  it("POST to /sign-in should fail and return fail response", async () => {
    const mocked = prismaMock.user.findUniqueOrThrow.mockRejectedValue("");

    const bcryptMocked = jestMocked(bcrypt).compare.mockResolvedValue(
      true as never
    );

    const response = await request(app)
      .post("/sign-in")
      .set("Origin", allowedUrl)
      .send({ name: "jubi", password: "123" });

    expect(bcryptMocked.mock.calls).toHaveLength(0);
    expect(mocked.mock.calls).toHaveLength(1);
    expect(response.body?.isOk).toBe(false);
    expect(response.status).toBe(400);
  });
});
