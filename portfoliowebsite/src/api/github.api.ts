import type { GithubCommit } from "../data/types/github.types";

export async function fetchCommits(
    repo: string
): Promise<GithubCommit[]> {
    const response = await fetch(
        `https://api.github.com/repos/${repo}/commits`
    );

    if (!response.ok) {
        throw new Error("GitHub API Error");
    }

    return response.json();
}