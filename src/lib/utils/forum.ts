export function isTopicUnread(
	topic: { id: string; last_reply_at?: string | null; updated_at?: string; created_at: string },
	topicViews: Record<string, string>,
	isLoggedIn: boolean
): boolean {
	if (!isLoggedIn) return false;
	const viewedAt = topicViews[topic.id];
	if (!viewedAt) return true;
	const lastActivity = topic.last_reply_at || topic.updated_at || topic.created_at;
	return new Date(lastActivity) > new Date(viewedAt);
}
