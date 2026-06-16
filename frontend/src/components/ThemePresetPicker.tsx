import { Button, Modal, useOverlayState } from "@heroui/react";
import { Check, Palette } from "lucide-react";
import { applyThemePresetToDocument, useTheme } from "../context/theme";
import { HERO_UI_THEME_PRESETS } from "../data/herouiThemePresets";

export function ThemePresetPicker() {
  const modal = useOverlayState();
  const { themePreset, setThemePreset } = useTheme();

  // 2. 선택할 테마의 id 파라미터를 문자열(string)로 지정하고,
  // 함수가 반환하는 값이 없으므로 void로 명시합니다.
  const handleSelect = (id: string): void => {
    applyThemePresetToDocument(id);
    setThemePreset(id);
    modal.close();
  };

  return (
    <Modal.Root state={modal}>
      <Modal.Trigger>
        <Button
          variant="ghost"
          size="sm"
          isIconOnly
          className="text-foreground"
        >
          <Palette className="size-5" />
        </Button>
      </Modal.Trigger>

      <Modal.Backdrop variant="opaque">
        <Modal.Container size="md" scroll="inside" placement="center">
          <Modal.Dialog className="max-h-[85dvh] border border-white/10 bg-[#2a2a2c] text-foreground shadow-2xl">
            <Modal.Header className="flex flex-row items-center justify-between gap-3 border-b border-white/10 pb-3">
              <Modal.Heading className="text-lg font-semibold tracking-tight text-white">
                메인 테마
              </Modal.Heading>
              <Modal.CloseTrigger />
            </Modal.Header>

            <Modal.Body className="isolate pt-4">
              <p className="mb-4 text-sm text-zinc-400">
                메인 테마들을 선택하세요
              </p>
              <div className="grid grid-cols-3 gap-4 sm:grid-cols-4">
                {HERO_UI_THEME_PRESETS.map((p) => {
                  const selected = themePreset === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handleSelect(p.id)}
                      className={[
                        "relative flex flex-col items-center gap-2 rounded-xl p-2 text-center transition-colors",
                        selected
                          ? "bg-white/10 ring-2 ring-accent ring-offset-2 ring-offset-[#2a2a2c]"
                          : "hover:bg-white/6",
                      ].join(" ")}
                      aria-pressed={selected}
                    >
                      <span className="relative">
                        <span
                          className="block size-14 shrink-0 rounded-full shadow-md ring-1 ring-white/20"
                          // p.swatch는 이전에 정의한 인터페이스 덕분에 자동 완성됩니다.
                          style={{ background: p.swatch }}
                        />

                        {selected ? (
                          <span className="absolute -right-0.5 -top-0.5 flex size-5 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-md">
                            <Check className="size-3" strokeWidth={3} />
                          </span>
                        ) : null}
                      </span>
                      <span
                        className={[
                          "text-[11px] font-medium leading-tight",
                          selected ? "text-white" : "text-zinc-400",
                        ].join(" ")}
                      >
                        {p.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal.Root>
  );
}
