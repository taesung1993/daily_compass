import { PropsWithChildren } from "react";

export function Heading1({ children }: PropsWithChildren) {
  return <h1 className="scroll-m-20 text-[24px] font-bold">{children}</h1>;
}
