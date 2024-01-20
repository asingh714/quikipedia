import { Oval } from "react-loader-spinner";

const Spinner = () => {
  return (
    <Oval
      height={80}
      width={80}
      color="#7e22ce"
      wrapperStyle={{}}
      wrapperClass=""
      visible={true}
      ariaLabel="oval-loading"
      secondaryColor="#7e22ce"
      strokeWidth={2}
      strokeWidthSecondary={2}
    />
  );
};

export default Spinner;
