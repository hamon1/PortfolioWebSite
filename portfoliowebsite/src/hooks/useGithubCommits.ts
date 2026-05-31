
import { useEffect, useState } from "react";
import { fetchCommits } from "../api/github.api";

export function useGithubCommits(repo: string) {
    const [commits, setCommits] = useState([]);

    useEffect(() => {
        fetchCommits(repo)
            .then(setCommits)
            .catch(console.error);
    }, [repo]);

    return commits;
}