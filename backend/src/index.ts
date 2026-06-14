import express from "express";
const app = express();

app.get("/", (req, res) => {
  res.send("TypeScript 서버가 정상 작동 중입니다!");
});

app.listen(3000, () => console.log("Server running on port 3000"));
