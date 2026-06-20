export const USER_DATA_QUERY = `
  query userInfo($login: String!) {
    user(login: $login) {
      name
      login
      followers {
        totalCount
      }
      repositories(first: 100, ownerAffiliations: [OWNER], isFork: false, privacy: PUBLIC) {
        totalCount
        nodes {
          stargazerCount
        }
      }
      contributionsCollection {
        contributionYears
      }
    }
  }
`;

export const generateYearsQuery = (login: string, years: number[]): string => {
  const yearsStr = years.map(year => `
    year${year}: contributionsCollection(from: "${year}-01-01T00:00:00Z", to: "${year}-12-31T23:59:59Z") {
      contributionCalendar {
        totalContributions
        weeks {
          contributionDays {
            contributionCount
            date
          }
        }
      }
    }
  `).join('');

  return `
    query {
      user(login: "${login}") {
        ${yearsStr}
      }
    }
  `;
};
