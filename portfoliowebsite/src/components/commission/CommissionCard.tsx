import { type Commission } from "../../data/schemas/commission.schema";
import "../../styles/commissionCard.css";

type Props = {
    commission: Commission
}

function CommissionCard({ commission }: Props) {
    return (
        <article className="commission-card">

            <div className="commission-thumbnail">
                <img src={`${import.meta.env.BASE_URL}${commission.image}`} alt={commission.id} width={400}/>
            </div>

            <div className="commission-content">

                <span>
                    Character Illustration
                </span>

                <h3>
                    숲 테마 캐릭터 일러스트
                </h3>

                <p>
                    의상 오마카세 및 배경 포함 작업
                </p>

                <div className="commission-meta">

                    <span>
                        {commission.year}
                    </span>

                    <span>
                        {commission.type}
                    </span>

                </div>

                <div className="commission-tags">
                    {commission.tags.map((tag) => (
                        <div>{tag}</div>
                    ))}
                </div>

                <div className="commission-actions">

                    <button>
                        상세 보기
                    </button>

                    <button>
                        커미션 링크
                    </button>

                </div>

            </div>

        </article>
    );
}

export default CommissionCard;