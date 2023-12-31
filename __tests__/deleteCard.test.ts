import request from "supertest";
import { createApp } from "../src/app";
import { allowedUrl } from "./mocks/allowedUrl";
import { generateJwtToken } from "./mocks/generateJwtToken";
import { prismaMock } from "./mocks/singleton";

const app = createApp();
const jwtToken = generateJwtToken();

describe("Testing deleteCard controller", () => {
  it("DELETE to /card/:cardId should be successful", async () => {
    const mocked = prismaMock.card.delete.mockResolvedValue({} as any);

    const response = await request(app)
      .delete("/card/123")
      .set("Cookie", ["jwt-token=" + jwtToken])
      .set("Origin", allowedUrl)
      .send();

    expect(mocked.mock.calls).toHaveLength(1);
    expect(response.body?.isOk).toBe(true);
    expect(response.status).toBe(200);
  });
  it("DELETE to /card/:cardId should fail", async () => {
    const mocked = prismaMock.card.delete.mockRejectedValue({} as any);

    const response = await request(app)
      .delete("/card/123")
      .set("Cookie", ["jwt-token=" + jwtToken])
      .set("Origin", allowedUrl)
      .send();

    expect(mocked.mock.calls).toHaveLength(1);
    expect(response.body?.isOk).toBe(false);
    expect(response.status).toBe(500);
  });
  it("DELETE to /card/:cardId without jwt token should return an error", async () => {
    const response = await request(app)
      .delete("/deck/123")
      .set("Origin", allowedUrl)
      .send();

    expect(response.body?.isOk).toBe(false);
    expect(response.status).toBe(401);
  });
});
