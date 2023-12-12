import request from "supertest";
import { createApp } from "../src/app";
import { allowedUrl } from "./mocks/allowedUrl";
import { generateJwtToken } from "./mocks/generateJwtToken";
import { prismaMock } from "./mocks/singleton";
import { card } from "./mocks/card";

const app = createApp();
const jwtToken = generateJwtToken();

describe("Testing studyDeck controller", () => {
  it("GET to /deck/:deckName should be successful", async () => {
    const mocked = prismaMock.deck.findFirstOrThrow.mockResolvedValue({
      cards: card,
    } as any);

    const response = await request(app)
      .get("/deck/deck")
      .set("Cookie", ["jwt-token=" + jwtToken])
      .set("Origin", allowedUrl);

    expect(mocked.mock.calls).toHaveLength(1);
    expect(response.body?.data).toMatchObject(card);
    expect(response.status).toBe(200);
  });
  it("GET to /deck/:deckName should fail and return fail response", async () => {
    const mocked = prismaMock.deck.findFirstOrThrow.mockRejectedValue("");

    const response = await request(app)
      .get("/deck/deck")
      .set("Cookie", ["jwt-token=" + jwtToken])
      .set("Origin", allowedUrl);

    expect(mocked.mock.calls).toHaveLength(1);
    expect(response?.body.isOk).toBe(false);
    expect(response.status).toBe(400);
  });
});
