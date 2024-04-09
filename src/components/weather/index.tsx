import { Card } from "@/components/ui/card";
import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";

import "dayjs/locale/ko";

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
    return "흐림";
  }, [status]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(() => dayjs());
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  console.log(imageUrl);

  return (
    <Card className={background}>
      <div className="px-6 pt-9 pb-11">
        <div>
          <p className="text-[20px] font-semibold text-white">인천광역시</p>
          <p className="text-[14px] font-regular text-white">
            {currentTime.format("MM월 DD일 dddd | HH:mm")}
          </p>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <p className="text-[48px] font-semibold text-white">
              {Math.floor(temperature.max)}°
            </p>
            <img src={imageUrl} alt="clouds" width="66" height="44" />
          </div>

          <p className="text-[14px] font-semibold text-white">
            <span className="uppercase mr-2">{statusText}</span>
            <span>{`${Math.floor(temperature.max)}° / ${Math.floor(
              temperature.min
            )}°`}</span>
          </p>
        </div>
      </div>
    </Card>
  );
}
