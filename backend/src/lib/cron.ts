import { CronJob } from "cron";
import http, { IncomingMessage } from "node:http";
import https from "node:https";

// every 14 minutes send a GET request to the health endpoint
const job = new CronJob("*/14 * * * *", function (): void {
  const base = process.env.FRONTEND_URL;

  // TS는 process.env 값이 undefined일 가능성을 항상 염두에 둡니다.
  if (!base) {
    console.warn("FRONTEND_URL is not defined in environment variables.");
    return;
  }

  const url = new URL("/health", base).href;
  const client = url.startsWith("https:") ? https : http;

  client
    .get(url, (res: IncomingMessage) => {
      if (res.statusCode === 200) {
        console.log("GET request sent successfully");
      } else {
        console.log("GET request failed", res.statusCode);
      }
    })
    .on("error", (e: Error) => {
      // 이벤트 리스너의 에러 객체도 Error 타입으로 명시해 줍니다.
      console.error("Error while sending request", e.message);
    });
});

export default job;
