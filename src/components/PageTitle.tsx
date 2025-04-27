interface Props {
  title: string;
  count?: number;
}

const PageTitle = ({ title, count = 0 }: Props) => {
  return (
    <div className="flex">
      <h2 className="text-22 font-semibold tracking-tighter leading-6">
        {title}
      </h2>
      {!!count && (
        <span className="ml-8 text-20 leading-6 font-normal tracking-tighter text-gray-8">
          ({count}개)
        </span>
      )}
    </div>
  );
};

export default PageTitle;
