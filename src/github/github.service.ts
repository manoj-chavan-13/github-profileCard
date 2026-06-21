import { USER_DATA_QUERY, generateYearsQuery, LANGUAGES_QUERY } from './queries';
import { GitHubData } from '../types';

export interface LanguageStats {
  name: string;
  color: string;
  size: number;
  percentage: number;
}

export interface LanguageData {
  totalSize: number;
  repositoriesCount: number;
  languages: LanguageStats[];
}

export const getUserLanguages = async (username: string): Promise<LanguageData | null> => {
  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    console.error('GITHUB_TOKEN is not defined');
    return null;
  }

  try {
    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        Authorization: `bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: LANGUAGES_QUERY,
        variables: { login: username },
      }),
    });

    const result: any = await response.json();

    if (result.errors || !result.data || !result.data.user) {
      console.error('GitHub API errors:', result.errors);
      return null;
    }

    const repos = result.data.user.repositories;
    const langMap = new Map<string, { size: number; color: string }>();
    let totalSize = 0;

    repos.nodes.forEach((repo: any) => {
      if (!repo.languages || !repo.languages.edges) return;
      repo.languages.edges.forEach((edge: any) => {
        const name = edge.node.name;
        const color = edge.node.color || '#858585';
        const size = edge.size;

        totalSize += size;
        if (langMap.has(name)) {
          const current = langMap.get(name)!;
          langMap.set(name, { ...current, size: current.size + size });
        } else {
          langMap.set(name, { size, color });
        }
      });
    });

    const languages: LanguageStats[] = Array.from(langMap.entries())
      .map(([name, data]) => ({
        name,
        color: data.color,
        size: data.size,
        percentage: totalSize > 0 ? (data.size / totalSize) * 100 : 0
      }))
      .sort((a, b) => b.size - a.size);

    return {
      totalSize,
      repositoriesCount: repos.totalCount,
      languages
    };
  } catch (error) {
    console.error('Error fetching languages from GitHub:', error);
    return null;
  }
};


export const getUserData = async (username: string): Promise<GitHubData | null> => {
  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    throw new Error('GITHUB_TOKEN is not defined in environment variables');
  }

  try {
    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        Authorization: `bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: USER_DATA_QUERY,
        variables: { login: username },
      }),
    });

    const result: any = await response.json();

    if (result.errors || !result.data || !result.data.user) {
      console.error('GitHub API errors:', result.errors);
      return null;
    }

    const user = result.data.user;
    const repositories = user.repositories.totalCount;
    
    // Calculate total stars
    const stars = user.repositories.nodes.reduce((acc: number, repo: any) => acc + repo.stargazerCount, 0);

    const years: number[] = user.contributionsCollection.contributionYears;
    
    // Second query to get all years' contributions
    const yearsResponse = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        Authorization: `bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: generateYearsQuery(username, years),
      }),
    });

    const yearsResult: any = await yearsResponse.json();
    
    if (yearsResult.errors || !yearsResult.data || !yearsResult.data.user) {
      console.error('GitHub Years API errors:', yearsResult.errors);
      return null;
    }

    let allTimeContributions = 0;
    let allWeeks: any[] = [];

    // Sort years descending just to be safe, though GitHub usually returns them in descending order
    // But we need ascending order to calculate the streak correctly
    const ascendingYears = [...years].sort((a, b) => a - b);

    for (const year of ascendingYears) {
      const yearData = yearsResult.data.user[`year${year}`].contributionCalendar;
      allTimeContributions += yearData.totalContributions;
      allWeeks = allWeeks.concat(yearData.weeks);
    }

    const longestStreak = getLongestStreak(allWeeks);

    return {
      username: user.login.toUpperCase(), // Uppercase as in the design
      followers: user.followers.totalCount,
      repositories,
      stars,
      allTimeContributions,
      longestStreak,
    };
  } catch (error) {
    console.error('Error fetching data from GitHub:', error);
    return null;
  }
};

const getLongestStreak = (weeks: any[]): number => {
  let longestStreak = 0;
  let currentStreak = 0;

  for (const week of weeks) {
    for (const day of week.contributionDays) {
      if (day.contributionCount > 0) {
        currentStreak++;
        longestStreak = Math.max(longestStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    }
  }

  return longestStreak;
};

export const getFollowers = async (username: string): Promise<number | null> => {
  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    console.error('GITHUB_TOKEN is not defined');
    return null;
  }

  try {
    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        Authorization: `bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          query ($login: String!) {
            user(login: $login) {
              followers {
                totalCount
              }
            }
          }
        `,
        variables: { login: username },
      }),
    });

    const result: any = await response.json();

    if (result.errors || !result.data || !result.data.user) {
      console.error('GitHub API errors:', result.errors);
      return null;
    }

    return result.data.user.followers.totalCount;
  } catch (error) {
    console.error('Error fetching followers from GitHub:', error);
    return null;
  }
};
