import request from "supertest";
import { createApp } from "../src/app";
import { allowedUrl } from "./mocks/allowedUrl";
import { generateJwtToken } from "./mocks/generateJwtToken";
import { prismaMock } from "./mocks/singleton";

const app = createApp();
const jwtToken = generateJwtToken();

describe("Create cards", () => {
  it("POST to /deck should be successful", async () => {
    const card = { front: "front test", back: "back test", deckId: "123" };

    const cardCreatedMocked = prismaMock.card.create.mockResolvedValue(
      card as any
    );

    const response = await request(app)
      .post("/card")
      .set("Cookie", ["jwt-token=" + jwtToken])
      .set("Origin", allowedUrl)
      .send(card);

    console.log("checking body", response.body);
    expect(cardCreatedMocked.mock.calls).toHaveLength(1);
    expect(response.body?.data).toMatchObject(card);
    expect(response.status).toBe(201);
  });
});
