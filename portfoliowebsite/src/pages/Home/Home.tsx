import About from "../About/About";
import FeaturedProjects from "./FeaturedProjects";
// import Demo from "../Demo/Demo";
// import DevLog from "../DevLog/DevLog";

function Home() {
return (
    <div className="home-page">
        <About/>

        <FeaturedProjects/>

        {/* <Demo/> */}

        {/* <DevLog/> */}
    </div>
    );
}

export default Home;