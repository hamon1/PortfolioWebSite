import { type Trouble } from "../../data/schemas/trouble.schema";

type Props = {
    trouble: Trouble;

    githubRepo: string;
};

const STATUS_LABEL: Record<NonNullable<Trouble["status"]>, string> = {
    resolved: "해결",
    partial: "부분 해결",
    unresolved: "미해결",
};

function TroubleCard({ trouble, githubRepo }: Props) {
    return (
        <div className="trouble-card">
            {(trouble.status || trouble.date || trouble.commitHash) && (
                <div className="trouble-meta">
                    {trouble.status && (
                        <span className={`trouble-status trouble-status--${trouble.status}`}>
                            {STATUS_LABEL[trouble.status]}
                        </span>
                    )}

                    {trouble.date && (
                        <span className="trouble-date">{trouble.date}</span>
                    )}

                    {trouble.commitHash && (
                        <a
                            href={`https://github.com/${githubRepo}/commit/${trouble.commitHash}`}
                            target="_blank"
                            rel="noreferrer"
                            className="trouble-commit-link"
                        >
                            {trouble.commitHash.slice(0, 7)}
                        </a>
                    )}
                </div>
            )}

            <div>
                <strong>Problem</strong>
                <p>{trouble.problem}</p>
            </div>

            <div>
                <strong>Cause</strong>
                <p>{trouble.cause}</p>
            </div>

            <div>
                <strong>Solution</strong>
                <p>{trouble.solution}</p>
            </div>

            {trouble.codeSnippet && (
                <pre className="trouble-code">
                    <code>{trouble.codeSnippet}</code>
                </pre>
            )}

            {trouble.result && (
                <div>
                    <strong>Result</strong>
                    <p>{trouble.result}</p>
                </div>
            )}

            {trouble.lesson && (
                <div className="trouble-callout trouble-callout--lesson">
                    <strong>교훈</strong>
                    <p>{trouble.lesson}</p>
                </div>
            )}

            {trouble.caveat && (
                <div className="trouble-callout trouble-callout--caveat">
                    <strong>잔존 이슈</strong>
                    <p>{trouble.caveat}</p>
                </div>
            )}
        </div>
    );
}

export default TroubleCard;
