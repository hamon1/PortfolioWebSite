import About from "../About/About";
import Projects from "../Projects/Projects";
// import Demo from "../Demo/Demo";
// import DevLog from "../DevLog/DevLog";

function Home() {
return (
    <div className="home-page">
        <About/>

        <Projects/>

        {/* <Demo/> */}

        {/* <DevLog/> */}
    </div>
    );
}

export default Home;