export interface GithubCommit {
    sha: string;

    commit: {
        message: string;

        author: {
            date: string;
        };
    };
}