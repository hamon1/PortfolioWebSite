import { Link } from "react-router-dom";
import CommissionCard from "../../components/commission/CommissionCard";

import { commissions } from "../../data/parsers/commission.parser";

function Commission() {
    return (
        <section id="commission-section">

            <div className="back-navigation">

                <Link to="/">
                    back to Portfolio
                </Link>
            </div>

            <div className="section-header">

                <div>

                    <span>
                        Archive
                    </span>

                    <h2>
                        Art Commission
                    </h2>

                </div>

                <button>
                    전체 보기
                </button>

            </div>

            <div className="commission-grid">

                {commissions.map((commission) => (
                    <CommissionCard
                    key = {commission.id}
                    commission={commission}
                    />
                ))}
            </div>

        </section>
    );
}

export default Commission;