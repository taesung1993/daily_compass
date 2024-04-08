import { Card, CardContent, CardHeader } from "../ui/card";

interface Props {
  content: string;
  writer: string;
}

export default function Quote({ content, writer }: Props) {
  return (
    <Card>
      <CardHeader>
        <h6 className="text-[20px] text-[#06060] font-semibold">오늘의 명언</h6>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          <p className="text-[#686868]">{content}</p>
          <p className="text-[#06060] font-medium">{writer}</p>
        </div>
      </CardContent>
    </Card>
  );
}
