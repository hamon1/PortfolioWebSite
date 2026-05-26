import { type DevLog } from '../../data/schemas/devLog.schema';

type Props = {
    devLog: DevLog;
}


function ProjectCard({ devLog }: Props) {
    return (
        <section className="project-card featured">

            <div className="project-thumbnail">
                {/* <img src="./assets/travelbuddy.webp" alt="TravelBUDDY 썸네일"> */}
            </div>


            <div className="project-content">


                <div className="project-header">
                    <h3 className="project-title">
                        {devLog.title}
                    </h3>

                </div>


                <p className="project-description">
                    {devLog.date}
                </p>


                <div>
                    {devLog.tags.map(tag => (
                        <span key={tag}>
                            {tag} 
                        </span>
                    ))}
                </div>

            </div>
        </section>
    );
}

export default ProjectCard;