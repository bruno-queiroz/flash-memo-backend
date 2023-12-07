import request from "supertest";
import { createApp } from "../src/app";
import { allowedUrl } from "./mocks/allowedUrl";
import { generateJwtToken } from "./mocks/generateJwtToken";
import { prismaMock } from "./mocks/singleton";

const app = createApp();
const jwtToken = generateJwtToken();

describe("Testing searchCard controller", () => {
  it("GET to /card/:deckId/:cardQuery should be successful", async () => {
    const mocked = prismaMock.deck.findUnique.mockResolvedValue("" as any);

    const response = await request(app)
      .get("/card/123/a")
      .set("Cookie", ["jwt-token=" + jwtToken])
      .set("Origin", allowedUrl);

    expect(mocked.mock.calls).toHaveLength(1);
    expect(response.status).toBe(200);
  });
  it("GET to /card/:deckId/:cardQuery should fail and return fail response", async () => {
    const mocked = prismaMock.deck.findUnique.mockRejectedValue("");

    const response = await request(app)
      .get("/card/123/a")
      .set("Cookie", ["jwt-token=" + jwtToken])
      .set("Origin", allowedUrl);

    expect(mocked.mock.calls).toHaveLength(1);
    expect(response.body?.isOk).toBe(false);
    expect(response.status).toBe(400);
  });
  it("GET to /card/:deckId/:cardQuery without jwt token should fail", async () => {
    const response = await request(app)
      .get("/card/123/a")
      .set("Origin", allowedUrl);

    expect(response.body?.isOk).toBe(false);
    expect(response.status).toBe(401);
  });
});
