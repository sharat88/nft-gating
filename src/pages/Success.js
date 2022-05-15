import { Link } from "react-router-dom";

const Success = () => (
  <div className='main-app'>
    <h2>Success</h2>
    <p>
      Congrats! You've logged in to this page using an NFT.
    </p>
    <Link to="/">Back to Home</Link>
  </div>
);

export default Success;