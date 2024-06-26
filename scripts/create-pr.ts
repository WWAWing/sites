import { Octokit } from "@octokit/rest";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const WWA_WING_VERSION = process.env.WWA_WING_VERSION;
const BRANCH_NAME = process.env.BRANCH_NAME;

const createSitesPullRequest = async (branchName: string, version: string) => {
  try {
    const octokit = new Octokit({ auth: GITHUB_TOKEN, baseUrl: "https://api.github.com", request: { timeout: 5000 } });
    await octokit.pulls.create({
      owner: "WWAWing",
      repo: "sites",
      base: "master",
      head: branchName,
      title: `Release v${version}`
    })
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

if (!GITHUB_TOKEN) {
  console.error("GitHub Token がありません. 環境変数 GITHUB_TOKEN を与えてください.");
  process.exit(1);
}

if (!BRANCH_NAME) {
  console.error("ブランチ名が指定さてていません. 環境変数 BRANCH_NAME を与えてください.")
  process.exit(1);
}

if (!WWA_WING_VERSION) {
  console.error("WWA Wing のバージョンが指定されていません. 環境変数 WWA_WING_VERSION を与えてください.")
  process.exit(1);
}

createSitesPullRequest(BRANCH_NAME, WWA_WING_VERSION);
