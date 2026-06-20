export const generateBugExplorerQuery = (from: string, to: string) => `
  query bugExplorer($login: String!) {
    user(login: $login) {
      contributionsCollection(from: "${from}", to: "${to}") {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
              color
            }
          }
        }
      }
    }
  }
`;
