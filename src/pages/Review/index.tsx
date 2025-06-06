// import { useQuery } from "@tanstack/react-query";
// import services from "src/services";

const Review = () => {
  // const { data } = useQuery({
  //   queryKey: ["review"],
  //   queryFn: () => services.Reveiw.fetchReivews(),
  // });

  // console.log(data);

  return (
    <div className="flex justify-center h-full w-full items-center">
      <div className="flex flex-col items-center">
        <img
          src="images/logo-icon-pencil.png"
          className="w-140 mb-20 opacity-40"
        />
        <p className="text-gray-5 leading-8 text-center text-18 tracking-normal">
          준비중입니다.
        </p>
      </div>
    </div>
  );
};

export default Review;
