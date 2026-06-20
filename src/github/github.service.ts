import { USER_DATA_QUERY, generateYearsQuery } from './queries';
import { GitHubData } from '../types';

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
