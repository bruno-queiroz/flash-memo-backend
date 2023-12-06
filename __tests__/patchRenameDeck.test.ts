import request from "supertest";
import { createApp } from "../src/app";
import { allowedUrl } from "./mocks/allowedUrl";
import { generateJwtToken } from "./mocks/generateJwtToken";
import { prismaMock } from "./mocks/singleton";
import { Prisma } from "@prisma/client";

const app = createApp();
const jwtToken = generateJwtToken();

describe("Testing patchRenameDeck controller", () => {
  it("PATCH to /deck/:deckId should be successful", async () => {
    const mocked = prismaMock.deck.update.mockResolvedValue("" as any);

    const response = await request(app)
      .patch("/deck/123")
      .set("Cookie", ["jwt-token=" + jwtToken])
      .set("Origin", allowedUrl);

    expect(mocked.mock.calls).toHaveLength(1);
    expect(response.body?.isOk).toBe(true);
    expect(response.status).toBe(200);
  });
  it("PATCH to /deck/:deckId should fail and return fail response", async () => {
    const mocked = prismaMock.deck.update.mockRejectedValue("" as any);

    const response = await request(app)
      .patch("/deck/123")
      .set("Cookie", ["jwt-token=" + jwtToken])
      .set("Origin", allowedUrl);

    expect(mocked.mock.calls).toHaveLength(1);
    expect(response.body?.isOk).toBe(false);
    expect(response.status).toBe(500);
  });
  it("PATCH to /deck/:deckId with same deck name should fail", async () => {
    const mocked = prismaMock.deck.update.mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError("error", {
        code: "P2002",
        clientVersion: "1",
        batchRequestIdx: 1,
        meta: { test: 1 },
      })
    );
    const response = await request(app)
      .patch("/deck/123")
      .set("Cookie", ["jwt-token=" + jwtToken])
      .set("Origin", allowedUrl)
      .send();

    expect(mocked.mock.calls).toHaveLength(1);
    expect(response.body?.isOk).toBe(false);
    expect(response.status).toBe(400);
  });
  it("PATCH to /deck/:deckId without jwt token should fail", async () => {
    const response = await request(app)
      .patch("/deck/123")
      .set("Origin", allowedUrl)
      .send();

    expect(response.body?.isOk).toBe(false);
    expect(response.status).toBe(401);
  });
});
