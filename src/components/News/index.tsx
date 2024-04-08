import { Card, CardContent, CardHeader } from "../ui/card";

interface Props {
  news: Array<{ title: string; content: string; link: string }>;
}

export default function News({ news }: Props) {
  return (
    <Card className="pb-10">
      <CardHeader>
        <h6 className="text-[20px] text-[#06060] font-semibold">오늘의 뉴스</h6>
      </CardHeader>
      <CardContent>
        <ul className="flex flex-col gap-4">
          {news.map(({ title, content, link }) => (
            <li key={link}>
              <a href={link} target="_blank" className="flex flex-col">
                <h2 className="line-clamp-2 break-all text-[#06060] text-[14px] font-semibold">
                  {title}
                </h2>
                <p className="line-clamp-1 break-all text-[#686868] text-[12px]">
                  {content}
                </p>
              </a>
            </li>
          ))}
        </ul>
        {/* <div className="flex flex-col gap-2">
          <p className="text-[#686868]">{content}</p>
          <p className="text-[#06060] font-medium">{writer}</p>
        </div> */}
      </CardContent>
    </Card>
  );
}
