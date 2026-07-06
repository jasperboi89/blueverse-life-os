/**
 * Standard per-route head() payload: title + description with matching
 * OpenGraph tags. Pass ogDescription when the social blurb should differ.
 */
export function pageHead(title: string, description: string, ogDescription = description) {
  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: ogDescription },
    ],
  };
}
