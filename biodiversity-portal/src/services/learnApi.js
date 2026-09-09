import { importantDays } from "../data/importantDays";
import { learnNews } from "../data/learnNews";
import { organizations } from "../data/organizations";

export async function getLearnContent() {
  return { news: learnNews, importantDays, organizations, source: "mock" };
}

export function filterLearnContent({ news, importantDays: days, organizations: contacts }, query) {
  const normalized = query.trim().toLowerCase();
  return {
    news: news.filter((item) => !normalized || `${item.title} ${item.summary} ${item.category} ${item.tags.join(" ")}`.toLowerCase().includes(normalized)),
    importantDays: days.filter((item) => !normalized || `${item.name} ${item.description} ${item.relatedHabitats.join(" ")}`.toLowerCase().includes(normalized)),
    organizations: contacts.filter((item) => !normalized || `${item.name} ${item.type} ${item.description} ${item.topics.join(" ")}`.toLowerCase().includes(normalized)),
  };
}
