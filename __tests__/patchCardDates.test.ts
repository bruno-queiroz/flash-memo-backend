import request from "supertest";
import { createApp } from "../src/app";
import { allowedUrl } from "./mocks/allowedUrl";
import { generateJwtToken } from "./mocks/generateJwtToken";
import { prismaMock } from "./mocks/singleton";

const app = createApp();
const jwtToken = generateJwtToken();

describe("Testing patchCardDates controller", () => {
  it("PATCH to /card-date/:cardId should be successful", async () => {
    const mocked = prismaMock.card.update.mockResolvedValue("" as any);

    const response = await request(app)
      .patch("/card-date/123")
      .set("Cookie", ["jwt-token=" + jwtToken])
      .set("Origin", allowedUrl);

    expect(mocked.mock.calls).toHaveLength(1);
    expect(response.body?.isOk).toBe(true);
    expect(response.status).toBe(200);
  });
  it("PATCH to /card-date/:cardId should fail and return fail response", async () => {
    const mocked = prismaMock.card.update.mockRejectedValue("");

    const response = await request(app)
      .patch("/card-date/123")
      .set("Cookie", ["jwt-token=" + jwtToken])
      .set("Origin", allowedUrl);

    expect(mocked.mock.calls).toHaveLength(1);
    expect(response.body?.isOk).toBe(false);
    expect(response.status).toBe(500);
  });
  it("PATCH to /card-date/:cardId without jwt token should fail", async () => {
    const response = await request(app)
      .patch("/card-date/123")
      .set("Origin", allowedUrl)
      .send();

    expect(response.body?.isOk).toBe(false);
    expect(response.status).toBe(401);
  });
});
