export interface GithubCommit {
    sha: string;

    commits: {
        message: string;

        author: {
            date: string;
        };
    };
}