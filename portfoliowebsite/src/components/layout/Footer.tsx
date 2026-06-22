import '../../styles/hero.css';

function Footer() {
    return (
        <footer id="contact-section" className="site-footer">
            <div className="footer-inner">
                <p className="footer-brand">
                    hamon<span>.dev</span>
                </p>

                <div className="footer-contact">
                    <a href="mailto:leejh021122@gmail.com">
                        leejh021122@gmail.com
                    </a>
                    <a
                        href="https://github.com/hamon1"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        GitHub
                    </a>
                </div>

                <p className="footer-copy">
                    © 2026 이정현. All rights reserved.
                </p>
            </div>
        </footer>
    );
}

export default Footer;
