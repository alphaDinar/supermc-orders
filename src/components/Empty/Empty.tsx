import Lottie from "lottie-react";
import emptyAnimation from '../../../public/empty.json';

const Empty = () => {
  return (
    <section className="emptyBox">
      <Lottie animationData={emptyAnimation} width={300} height={300}/>
    </section>
  );
}

export default Empty;