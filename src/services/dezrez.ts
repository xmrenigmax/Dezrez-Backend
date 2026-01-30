import _ from 'lodash';

const DEZREZ_API_BASE = 'https://api.dezrez.com/v1'; // Standard API endpoint

export async function searchDezrezListings(criteria: any) {
  const apiKey = process.env.DEZREZ_API_KEY;
  
  try {
    // 1. Build query from AI-extracted arguments
    const queryParams = new URLSearchParams();
    if (!_.isNil(criteria.location)) queryParams.append('town', criteria.location);
    if (!_.isNil(criteria.maxPrice)) queryParams.append('price_to', criteria.maxPrice);

    // 2. Fetch from CRM
    const response = await fetch(`${ DEZREZ_API_BASE }/properties/search?${ queryParams }`, {
      headers: { 
        'Authorization': `Bearer ${ apiKey }`,
        'Accept': 'application/json' 
      }
    });

    if (!response.ok) throw new Error('DezRez API unreachable');

    const rawData = await response.json();

    // 3. RAG Filter: Ensure we only return active listings to the AI
    // We map only essential fields to keep the prompt small and fast
    const activeListings = _.chain(rawData.items)
      .filter({ status: 'Available' }) 
      .take(3) // Limit to top 3 to prevent "over-stuffing" the AI [cite: 112]
      .map((item) => ({
        address: item.displayAddress,
        price: item.price,
        summary: item.marketingText,
        link: item.url
      }))
      .value();

    return activeListings;

  } catch (error) {
    console.error('DezRez Service Error:', error);
    return []; // Return empty for graceful failure
  }
}