import { CorsOptions } from "cors";

const allowedUrls = ["http://localhost:5173", "https://flash-memo.vercel.app"];

export const corsOptions: CorsOptions = {
  origin: function (origin, callback) {
    console.log("origin request:", origin);
    if (allowedUrls.indexOf(origin || "") !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};
