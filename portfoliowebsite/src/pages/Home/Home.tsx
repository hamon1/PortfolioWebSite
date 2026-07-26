import About from "../About/About";
import Projects from "../Projects/Projects";
import MouseGlow from "../../components/effects/MouseGlow";
// import Demo from "../Demo/Demo";
// import DevLog from "../DevLog/DevLog";

function Home() {
return (
    <div className="home-page">
        <MouseGlow />
        <About/>

        <Projects/>

        {/* <Demo/> */}

        {/* <DevLog/> */}
    </div>
    );
}

export default Home;