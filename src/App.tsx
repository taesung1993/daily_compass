/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from "@tanstack/react-query";
import { getRecord } from "./lib/services/record.service";
import { useEffect, useMemo, useState } from "react";
import Weather from "./components/weather";
import Quote from "./components/Quote";
import News from "./components/News";
import { BeforeInstallPromptEvent } from "./lib/types/window";
import { Sheet, SheetContent } from "./components/ui/sheet";
import { Button } from "./components/ui/button";

const defaultBeforeInstallPromptEvent: BeforeInstallPromptEvent = {
  platforms: [],
  userChoice: Promise.resolve({ outcome: "dismissed", platform: "" }),
  prompt: () => Promise.resolve(),
  preventDefault: () => {},
};

const isIOSPromptActive = () => {
  const isActive = JSON.parse(localStorage.getItem("iosInstalled") || "true");

  if (isActive) {
    return defaultBeforeInstallPromptEvent;
  }

  return null;
};

function App() {
  const { data } = useQuery({
    queryKey: ["record"],
    queryFn: getRecord,
  });

  const record = useMemo(() => {
    if (data && data.data && data.data.records.length > 0) {
      const { id, createdTime, fields } = data.data.records.at(-1);
      const newData = {
        id,
        createdTime,
        fields: {} as any,
      };

      for (const [key, value] of Object.entries(fields)) {
        switch (key) {
          case "날씨":
          case "뉴스":
          case "명언":
            newData.fields[key] = JSON.parse(value as string);
            break;
        }
      }

      return {
        ...newData,
        fields: {
          ...fields,
          ...newData.fields,
        },
      };
    }

    return null;
  }, [data]);

  const isDeviceIOS = /iPad|iPhone|iPod/.test(window.navigator.userAgent);
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(
      isDeviceIOS ? isIOSPromptActive() : null
    );
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setDeferredPrompt(() => e);
      setOpen(() => true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const clearPrompt = () => {
    localStorage.setItem("iosInstalled", "false");
    setDeferredPrompt(null);
    setOpen(() => false);
  };

  const installPrompt = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();

      deferredPrompt.userChoice.then(() => {
        clearPrompt();
      });
    }
  };

  const onOpenChange = (value: boolean) => {
    if (!value) {
      clearPrompt();
      return;
    }

    setOpen(value);
  };

  return (
    <article className="w-screen bg-gradient-to-b from-[#AEAEAE] to-[#E9E9E9]">
      <section className="w-full max-w-[480px] min-h-screen mx-auto bg-[#F6F9FF]">
        {record && <Weather {...record!.fields["날씨"]} />}

        <div className="flex flex-col gap-5 px-3 pt-2 pb-20">
          {record && <Quote {...record!.fields["명언"]} />}
          {record && <News news={record!.fields["뉴스"]} />}
        </div>
      </section>

      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="bottom" className="pt-10 pb-20">
          <div className="flex items-center gap-3">
            <img src="/logo.png" width="64" height="64" alt="logo" />
            <div>
              <p className="text-2xl font-bold">오늘의 나침반</p>
              <p className="text-2xl font-bold">바로가기를 추가하시겠습니까?</p>
            </div>
          </div>

          {isDeviceIOS ? (
            <div className="mt-10">
              <ol className="flex flex-col gap-2">
                <li>
                  <p className="flex items-center text-xl font-medium">
                    1.
                    <span className="bg-white p-1 inline-block rounded-md border ml-1">
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 512 512"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M336 192H376C386.609 192 396.783 196.214 404.284 203.716C411.786 211.217 416 221.391 416 232V424C416 434.609 411.786 444.783 404.284 452.284C396.783 459.786 386.609 464 376 464H136C125.391 464 115.217 459.786 107.716 452.284C100.214 444.783 96 434.609 96 424V232C96 221.391 100.214 211.217 107.716 203.716C115.217 196.214 125.391 192 136 192H176"
                          stroke="#027AFF"
                          strokeWidth="32"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M336 128L256 48L176 128"
                          stroke="#027AFF"
                          strokeWidth="32"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M256 321V48"
                          stroke="#027AFF"
                          strokeWidth="32"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    <strong className="text-[#027AFF] font-medium mr-1">
                      (공유하기)
                    </strong>
                    버튼을 누른다.
                  </p>
                </li>

                <li>
                  <p className="flex items-center text-xl font-medium">
                    2.
                    <strong className="ml-1 text-[#027AFF] font-medium mr-1">
                      홈 화면에 추가
                    </strong>
                    를탭합니다.
                  </p>
                </li>
              </ol>
            </div>
          ) : (
            <div className="mt-10 grid grid-cols-2 gap-2">
              <Button
                variant={"outline"}
                className="border-primary-compass text-primary-compass hover:text-primary-compass/90"
                onClick={clearPrompt}
              >
                취소
              </Button>
              <Button
                className="bg-primary-compass hover:bg-primary-compass/90"
                onClick={installPrompt}
              >
                추가하기
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </article>
  );
}

export default App;
