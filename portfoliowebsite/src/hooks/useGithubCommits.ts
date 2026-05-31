
import { useEffect, useState } from "react";
import { fetchCommits } from "../api/github.api";
import type { GithubCommit } from "../data/types/github.types";

export function useGithubCommits(repo: string) {
    const [commits, setCommits] = useState<GithubCommit[]>([]);
    useEffect(() => {
        fetchCommits(repo)
            .then(setCommits)
            .catch(console.error);
    }, [repo]);

    return commits;
}