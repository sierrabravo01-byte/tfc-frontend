import { Product } from '../types';

/**
 * Creates a fuzzy regex pattern from a search string.
 * Example: "hny" -> /h.*n.*y/i
 */
const createFuzzyPattern = (query: string): RegExp => {
  // Escape special regex characters to prevent errors
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  // Insert .* between characters to allow for missing letters (fuzzy matching)
  const pattern = escaped.split('').join('.*');
  return new RegExp(pattern, 'i');
};

/**
 * Filters products based on a fuzzy search query, category, and vendor.
 */
export const searchProducts = (
  products: Product[],
  query: string,
  category: string,
  vendorId: string | null
): Product[] => {
  let filtered = products;

  // 1. Filter by Category (exact match)
  if (category !== "All") {
    filtered = filtered.filter(p => p.category === category);
  }

  // 2. Filter by Vendor (exact match)
  if (vendorId && vendorId !== "All") {
    filtered = filtered.filter(p => p.vendor.id === vendorId);
  }

  // 3. Filter by Search Query (Fuzzy)
  const trimmedQuery = query.trim();
  if (!trimmedQuery) return filtered;

  const fuzzyRegex = createFuzzyPattern(trimmedQuery);
  const strictLower = trimmedQuery.toLowerCase();

  return filtered.filter((product) => {
    // Prepare searchable fields
    const name = product.name;
    const description = product.description;
    const vendor = product.vendor.name;
    const tags = product.tags.join(' ');

    // Priority 1: Exact substring match (Standard search) - High relevance
    if (
      name.toLowerCase().includes(strictLower) ||
      vendor.toLowerCase().includes(strictLower)
    ) {
      return true;
    }

    // Priority 2: Fuzzy match on Name, Description, or Vendor
    // This handles typos or skipped characters (e.g., "hony" finds "Honey")
    return (
      fuzzyRegex.test(name) ||
      fuzzyRegex.test(description) ||
      fuzzyRegex.test(vendor) ||
      fuzzyRegex.test(tags)
    );
  });
};
