import request from "supertest";
import { createApp } from "../src/app";
import { allowedUrl } from "./mocks/allowedUrl";
import { generateJwtToken } from "./mocks/generateJwtToken";
import { prismaMock } from "./mocks/singleton";

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
});
