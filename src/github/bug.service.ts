import { generateBugExplorerQuery } from './bug.queries';

export interface BugExplorerData {
  totalContributions: number;
  weeks: any[];
  year: number;
}

export const getBugExplorerData = async (username: string): Promise<BugExplorerData | null> => {
  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    console.error('GITHUB_TOKEN is not defined');
    return null;
  }

  try {
    const currentYear = new Date().getFullYear();
    const from = `${currentYear}-01-01T00:00:00Z`;
    const to = `${currentYear}-12-31T23:59:59Z`;

    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        Authorization: `bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: generateBugExplorerQuery(from, to),
        variables: { login: username },
      }),
    });

    const result: any = await response.json();

    if (result.errors || !result.data || !result.data.user) {
      console.error('GitHub API errors:', result.errors);
      return null;
    }

    const calendar = result.data.user.contributionsCollection.contributionCalendar;

    return {
      totalContributions: calendar.totalContributions,
      weeks: calendar.weeks,
      year: currentYear
    };
  } catch (error) {
    console.error('Error fetching bug explorer data from GitHub:', error);
    return null;
  }
};
