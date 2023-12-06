import request from "supertest";
import { createApp } from "../src/app";
import { allowedUrl } from "./mocks/allowedUrl";
import { generateJwtToken } from "./mocks/generateJwtToken";
import { prismaMock } from "./mocks/singleton";
import { Prisma } from "@prisma/client";
import { deck } from "./mocks/deck";

const app = createApp();
const jwtToken = generateJwtToken();

describe("Testing postDeck controller", () => {
  it("POST to /deck should be successful", async () => {
    const mocked = prismaMock.deck.create.mockResolvedValue(deck as any);

    const response = await request(app)
      .post("/deck")
      .set("Cookie", ["jwt-token=" + jwtToken])
      .set("Origin", allowedUrl);

    expect(mocked.mock.calls).toHaveLength(1);
    expect(response.body?.data).toMatchObject(deck);
    expect(response.body?.isOk).toBe(true);
    expect(response.status).toBe(200);
  });
});
