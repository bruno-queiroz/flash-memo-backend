import request from "supertest";
import { createApp } from "../src/app";
import { allowedUrl } from "./mocks/allowedUrl";
import { generateJwtToken } from "./mocks/generateJwtToken";
import { prismaMock } from "./mocks/singleton";
import { deckWithStatus } from "./mocks/deckWithStatus";
import { decksAndCardsReadyToReview } from "./mocks/decksAndCardsReadyToReview";

const app = createApp();
const jwtToken = generateJwtToken();

describe("Testing getLogOut controller", () => {
  it("GET to /log-out should be successful", async () => {
    const response = await request(app)
      .get("/deck")
      .set("Cookie", ["jwt-token=" + jwtToken])
      .set("Origin", allowedUrl);

    expect(response.statusCode).toBe(200);
  });
});
