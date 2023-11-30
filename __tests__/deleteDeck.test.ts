import request from "supertest";
import { createApp } from "../src/app";
import { allowedUrl } from "./mocks/allowedUrl";
import { generateJwtToken } from "./mocks/generateJwtToken";
import { prismaMock } from "./mocks/singleton";

const app = createApp();
const jwtToken = generateJwtToken();

describe("Testing deleteDeck controller", () => {
  it("DELETE to /deck/:deckId should be successful", async () => {
    const mocked = prismaMock.deck.delete.mockResolvedValue({} as any);

    const response = await request(app)
      .delete("/deck/123")
      .set("Cookie", ["jwt-token=" + jwtToken])
      .set("Origin", allowedUrl)
      .send();

    expect(mocked.mock.calls).toHaveLength(1);
    expect(response.body?.isOk).toBe(true);
    expect(response.status).toBe(200);
  });
  it("DELETE to /deck/:deckId should fail", async () => {
    const mocked = prismaMock.deck.delete.mockRejectedValue({} as any);

    const response = await request(app)
      .delete("/deck/123")
      .set("Cookie", ["jwt-token=" + jwtToken])
      .set("Origin", allowedUrl)
      .send();

    expect(mocked.mock.calls).toHaveLength(1);
    expect(response.body?.isOk).toBe(false);
    expect(response.status).toBe(500);
  });
  it("DELETE to /deck/:deckId without jwt token should return an error", async () => {
    const response = await request(app)
      .delete("/deck/123")
      .set("Origin", allowedUrl)
      .send();

    expect(response.body?.isOk).toBe(false);
    expect(response.status).toBe(401);
  });
});
