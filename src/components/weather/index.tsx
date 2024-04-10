import { Card } from "@/components/ui/card";
import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";

import "dayjs/locale/ko";
import { cn } from "@/lib/utils";

dayjs.locale("ko");

interface Props {
  humidity: number;
  status: string;
  temperature: {
    max: number;
    min: number;
  };
}

export default function Weather({ status, temperature }: Props) {
  const [currentTime, setCurrentTime] = useState(dayjs());
  const imageUrl = new URL("/weathers/clouds.png", import.meta.url).href;
  const background = useMemo(() => {
    const hour = currentTime.hour();

    if (hour >= 0 && hour <= 6) {
      return "bg-sun-set";
    } else if (hour >= 7 && hour <= 19) {
      return "bg-sun-rise";
    } else {
      return "bg-sun-set";
    }
  }, [currentTime]);
  const statusText = useMemo(() => {
    return "구름 많음";
  }, [status]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(() => dayjs());
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <Card className={cn(background, "rounded-none border-none")}>
      <div className="px-6 pt-9 pb-11 aspect-[4/3] flex flex-col justify-center items-center">
        <img src={imageUrl} width="90" alt="clouds" />
        <div className="relative mt-5">
          <p className="font-roboto text-[60px] font-black text-white">
            {Math.floor(temperature.max)}
          </p>
          <p className="absolute -top-1 -right-4 font-roboto text-[48px] font-black text-white">
            °
          </p>
        </div>
        <p className="text-base text-white font-medium">{statusText}</p>
        <p className="text-[14px] font-light text-white">
          {currentTime.format("MM월 DD일 dddd")}
        </p>
      </div>
    </Card>
  );
}
