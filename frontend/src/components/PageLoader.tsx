import { LoaderIcon } from "lucide-react";
import { APP_NAME, AppLogo } from "./AppLogo";

// 화살표 함수에 반환 타입(: JSX.Element)을 추가하여 React 컴포넌트임을 명확히 합니다.
const PageLoader = () => {
  return (
    <div className="flex h-dvh items-center justify-center bg-background text-foreground">
      <div className="flex flex-col items-center gap-4">
        {/* 이전에 만든 AppLogo의 인터페이스 덕분에 size와 className 속성도 안전하게 자동 완성됩니다. */}
        <AppLogo size={44} className="rounded-xl" />

        <div className="flex items-center gap-2 text-sm font-medium text-muted">
          <LoaderIcon className="size-4 animate-spin text-accent" aria-hidden />
          <span>Loading {APP_NAME}</span>
        </div>
      </div>
    </div>
  );
};

export default PageLoader;
