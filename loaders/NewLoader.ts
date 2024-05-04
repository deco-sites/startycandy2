// Define props interface
interface Props {
  /**
   * @title Number of Trends
   * @description The number of trends to fetch.
   */
  count?: number;
}

// Define return type interface
interface Trend {
  title: string;
  value: number;
}

// Define function to fetch trends
export default async function fetchGoogleTrends(props: Props): Promise<Trend[]> {
  // Default count to 10 if not provided
  const { count = 10 } = props;
  
  // Make request to Google Trends API
  const response = await fetch(`https://trends.google.com/trends/api/dailytrends?hl=en-US&tz=-120&geo=US&ns=15`);
  
  // Ensure request was successful
  if (!response.ok) {
    throw new Error(`Failed to fetch Google Trends. Status: ${response.status}`);
  }
  
  // Read the response body as text
  const responseBody = await response.text();
  
  // Parse the response body
  const trendsData = responseBody.substring(5); // Removing garbage data before JSON
  const trends = JSON.parse(trendsData).default.trendingSearchesDays[0].trendingSearches;
  
  // Extract the required number of trends
  const selectedTrends = trends.slice(0, count).map((trend: any) => ({
    title: trend.title.query,
    value: trend.formattedTraffic,
  }));

  return selectedTrends;
}