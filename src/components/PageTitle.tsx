interface Props {
  title: string;
  count?: number;
}

const PageTitle = ({ title, count = 0 }: Props) => {
  return (
    <div className="flex">
      <h2 className="text-22 font-semibold tracking-tighter">{title}</h2>
      {!!count && (
        <span className="ml-4 text-22 font-medium tracking-tighter">
          ({count})
        </span>
      )}
    </div>
  );
};

export default PageTitle;
