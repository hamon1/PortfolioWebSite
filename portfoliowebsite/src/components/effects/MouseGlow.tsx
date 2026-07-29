import './mouseGlow.css';

function MouseGlow() {
    return (
        <div className="mouse-glow-layer" aria-hidden="true">
            <div className="mouse-glow">
                <div className="mouse-face">
                    <div className="mouse-face__eyes">
                        <span className="mouse-face__eye" />
                        <span className="mouse-face__eye" />
                    </div>
                    <span className="mouse-face__mouth" />
                </div>
            </div>
        </div>
    );
}

export default MouseGlow;
