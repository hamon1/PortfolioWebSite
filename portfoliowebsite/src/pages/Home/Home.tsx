import About from "../About/About";
import FeaturedProjects from "./FeaturedProjects";
import MouseGlow from "../../components/effects/MouseGlow";
// import Demo from "../Demo/Demo";
// import DevLog from "../DevLog/DevLog";

function Home() {
return (
    <div className="home-page">
        <MouseGlow />
        <About/>

        <FeaturedProjects/>

        {/* <Demo/> */}

        {/* <DevLog/> */}
    </div>
    );
}

export default Home;