export interface ForumCategory {
	id: string;
	slug: string;
	name: string;
	description: string;
	icon: string;
	color: string;
	display_order: number;
	topic_count: number;
	created_at: string;
}

export interface ForumAuthorProfile {
	id: string;
	display_name: string | null;
	avatar_url: string | null;
	summit_count: number;
}

export interface ForumTopicWithAuthor {
	id: string;
	slug: string;
	title: string;
	body: string;
	category_id: string;
	author_id: string;
	peak_id: string | null;
	route_id: string | null;
	is_pinned: boolean;
	is_locked: boolean;
	reply_count: number;
	view_count: number;
	reaction_count: number;
	last_reply_at: string;
	last_reply_by: string | null;
	created_at: string;
	updated_at: string;
	author: ForumAuthorProfile;
	peak: { id: string; name: string; slug: string } | null;
}

export interface TopicDetail extends ForumTopicWithAuthor {
	category: ForumCategory;
	route: { id: string; name: string } | null;
}

export interface ForumReplyWithAuthor {
	id: string;
	topic_id: string;
	author_id: string;
	body: string;
	reply_to_id: string | null;
	reaction_count: number;
	created_at: string;
	updated_at: string;
	author: ForumAuthorProfile;
	quoted_reply: {
		id: string;
		body: string;
		author: { display_name: string | null };
	} | null;
}

export interface ForumSearchResult {
	result_type: 'topic' | 'reply';
	id: string;
	topic_id: string;
	topic_title: string;
	topic_slug: string;
	category_slug: string;
	title: string | null;
	body: string;
	author_display_name: string | null;
	author_avatar_url: string | null;
	rank: number;
	created_at: string;
}
