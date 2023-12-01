import request from "supertest";
import { createApp } from "../src/app";
import { allowedUrl } from "./mocks/allowedUrl";
import { generateJwtToken } from "./mocks/generateJwtToken";
import { prismaMock } from "./mocks/singleton";
import { deckWithStatus } from "./mocks/deckWithStatus";
import { decksAndCardsReadyToReview } from "./mocks/decksAndCardsReadyToReview";

const app = createApp();
const jwtToken = generateJwtToken();

describe("Testing getDecks controller", () => {
  it("GET to /deck should be successful", async () => {
    const mocked = prismaMock.user.findUnique.mockResolvedValue(
      decksAndCardsReadyToReview as any
    );

    const response = await request(app)
      .get("/deck")
      .set("Cookie", ["jwt-token=" + jwtToken])
      .set("Origin", allowedUrl);

    expect(mocked.mock.calls).toHaveLength(1);
    expect(response.body?.data).toMatchObject(deckWithStatus);
    expect(response.status).toBe(200);
  });
  it("GET to /deck should fail", async () => {
    const mocked = prismaMock.user.findUnique.mockRejectedValue("");

    const response = await request(app)
      .get("/deck")
      .set("Cookie", ["jwt-token=" + jwtToken])
      .set("Origin", allowedUrl);

    expect(mocked.mock.calls).toHaveLength(1);
    expect(response.status).toBe(500);
  });
  it("GET to /deck without jwt token should return an error", async () => {
    const response = await request(app)
      .get("/deck")
      .set("Origin", allowedUrl)
      .send();

    expect(response.body?.isOk).toBe(false);
    expect(response.status).toBe(401);
  });
});
