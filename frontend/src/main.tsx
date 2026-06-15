import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx"; // 확장자 변경 주의!
import { ClerkProvider } from "@clerk/react";
import { BrowserRouter } from "react-router";

// 1. Clerk의 Publishable Key를 환경 변수에서 안전하게 가져옵니다.
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// 2. 키가 없으면 앱을 실행하지 않고 에러를 던져 TS와 개발자 모두에게 알립니다.
if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

// 3. getElementById("root") 뒤에 느낌표(!)를 붙여줍니다.
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ClerkProvider>
  </StrictMode>,
);
