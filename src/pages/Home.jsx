import "./Home.css";
import Navbar from "../components/Navbar";
import UserBalance from "../components/UserBalance";
import QuickLinks from "../components/QuickLinks";
import Icons from "../components/Icons";
function Home() {
  return (
    <div className="body">
      <Navbar />
      <UserBalance />
      <QuickLinks />
      <Icons />
    </div>
  );
}

export default Home;
