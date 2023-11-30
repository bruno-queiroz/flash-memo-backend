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
});
