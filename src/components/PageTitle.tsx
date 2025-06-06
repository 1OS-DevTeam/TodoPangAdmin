interface Props {
  title: string;
}

const PageTitle = ({ title }: Props) => {
  return (
    <div className="flex bg-white p-24 rounded-8 mb-24 shadow">
      <h2 className="text-18 font-medium tracking-tight leading-6">{title}</h2>
    </div>
  );
};

export default PageTitle;
