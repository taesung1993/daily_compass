/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from "@tanstack/react-query";
import { getRecord } from "./lib/services/record.service";
import { useMemo } from "react";
import Weather from "./components/weather";
import Quote from "./components/Quote";
import News from "./components/News";

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

  return (
    <article className="w-screen bg-gradient-to-b from-[#AEAEAE] to-[#E9E9E9]">
      <section className="w-full max-w-[480px] min-h-screen mx-auto bg-[#F6F9FF]">
        {record && <Weather {...record!.fields["날씨"]} />}

        <div className="flex flex-col gap-5 px-3 pt-2 pb-20">
          {record && <Quote {...record!.fields["명언"]} />}
          {record && <News news={record!.fields["뉴스"]} />}
        </div>
      </section>
    </article>
  );
}

export default App;
