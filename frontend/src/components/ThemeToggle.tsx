import { Button } from "@heroui/react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../context/theme";

// 컴포넌트가 JSX.Element를 반환함을 명시합니다.
export function ThemeToggle() {
  // 이전에 useTheme 훅에 완벽하게 타입을 지정해 두었기 때문에,
  // 여기서 theme이 "light" | "dark" 임을 자동으로 추론합니다.
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-1 rounded-full border border-default bg-surface p-1 shadow-sm">
      <Button
        size="sm"
        variant={theme === "light" ? "primary" : "ghost"}
        isIconOnly
        // setTheme 함수 역시 "light" 또는 "dark"만 받을 수 있도록
        // 이전에 타이핑해 두었으므로 안전하게 작동합니다.
        onPress={() => setTheme("light")}
      >
        <Sun className="size-4" />
      </Button>
      <Button
        size="sm"
        variant={theme === "dark" ? "primary" : "ghost"}
        isIconOnly
        onPress={() => setTheme("dark")}
      >
        <Moon className="size-4" />
      </Button>
    </div>
  );
}
