import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const Section = ({ children }: Props) => {
  return (
    <div className="w-full h-full rounded-8 bg-white p-24 overflow-x-auto shadow">
      {children}
    </div>
  );
};

export default Section;
