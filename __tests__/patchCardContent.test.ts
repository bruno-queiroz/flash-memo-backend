import request from "supertest";
import { createApp } from "../src/app";
import { allowedUrl } from "./mocks/allowedUrl";
import { generateJwtToken } from "./mocks/generateJwtToken";
import { prismaMock } from "./mocks/singleton";
import { card } from "./mocks/card";

const app = createApp();
const jwtToken = generateJwtToken();

describe("Testing patchCardContent controller", () => {
  it("PATCH to /card-content/:cardId should be successful", async () => {
    const mocked = prismaMock.card.update.mockResolvedValue(card as any);

    const response = await request(app)
      .patch("/card-content/123")
      .set("Cookie", ["jwt-token=" + jwtToken])
      .set("Origin", allowedUrl);

    expect(mocked.mock.calls).toHaveLength(1);
    expect(response.body?.data).toMatchObject(card);
    expect(response.body?.isOk).toBe(true);
    expect(response.status).toBe(200);
  });
  it("PATCH to /card-content/:cardId should fail", async () => {
    const mocked = prismaMock.card.update.mockRejectedValue("");

    const response = await request(app)
      .patch("/card-content/123")
      .set("Cookie", ["jwt-token=" + jwtToken])
      .set("Origin", allowedUrl);

    expect(mocked.mock.calls).toHaveLength(1);
    expect(response.body?.isOk).toBe(false);
    expect(response.status).toBe(500);
  });
});
