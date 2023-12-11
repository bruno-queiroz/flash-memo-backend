import request from "supertest";
import { createApp } from "../src/app";
import { jest } from "@jest/globals";
import { allowedUrl } from "./mocks/allowedUrl";
import { prismaMock } from "./mocks/singleton";
import { user } from "./mocks/user";
import { mocked as jestMocked } from "jest-mock";
import bcrypt from "bcrypt";
import { Prisma } from "@prisma/client";

jest.mock("bcrypt");

const app = createApp();

describe("Testing signUp controller", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("POST to /sign-up should be successful", async () => {
    const mocked = prismaMock.user.create.mockResolvedValue(user as any);
    const bcryptMocked = jestMocked(bcrypt).hash.mockResolvedValue("" as never);

    const response = await request(app)
      .post("/sign-up")
      .set("Origin", allowedUrl)
      .send({ name: "jubi", password: "123" });

    expect(bcryptMocked.mock.calls).toHaveLength(1);
    expect(mocked.mock.calls).toHaveLength(1);
    expect(response.body?.data).toMatchObject({ name: user.name, id: user.id });
    expect(response.body?.isOk).toBe(true);
    expect(response.status).toBe(200);
  });
  it("POST to /sign-up should fail and return fail response", async () => {
    const mocked = prismaMock.user.create.mockResolvedValue("" as any);
    const bcryptMocked = jestMocked(bcrypt).hash.mockRejectedValue("" as never);

    const response = await request(app)
      .post("/sign-up")
      .set("Origin", allowedUrl)
      .send({ name: "jubi", password: "123" });

    expect(bcryptMocked.mock.calls).toHaveLength(1);
    expect(mocked.mock.calls).toHaveLength(0);
    expect(response.body?.isOk).toBe(false);
    expect(response.status).toBe(500);
  });
  it("POST to /sign-up with non unique name should fail", async () => {
    const bcryptMocked = jestMocked(bcrypt).hash.mockResolvedValue("" as never);
    const mocked = prismaMock.user.create.mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError("error", {
        code: "P2002",
        clientVersion: "1",
        batchRequestIdx: 1,
        meta: { test: 1 },
      })
    );
    const response = await request(app)
      .post("/sign-up")
      .set("Origin", allowedUrl)
      .send({ name: "jubi", password: "123" });

    expect(mocked.mock.calls).toHaveLength(1);
    expect(bcryptMocked.mock.calls).toHaveLength(1);
    expect(response.body?.isOk).toBe(false);
    expect(response.status).toBe(400);
  });
});
