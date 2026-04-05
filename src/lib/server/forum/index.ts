// Forum module barrel export
// All imports from '$lib/server/forum' resolve here

// Types
export type {
	ForumCategory,
	ForumAuthorProfile,
	ForumTopicWithAuthor,
	TopicDetail,
	ForumReplyWithAuthor,
	ForumSearchResult
} from './types';

// Utils (exported for use by forumBookmarks, forumReactions, forumAdmin)
export { enrichWithAuthors } from './utils';

// Categories
export { getCategories, getCategoryBySlug } from './categories';

// Topics
export {
	getTopicsByCategory,
	getPopularTopics,
	getRecentTopics,
	getTopicsForPeak,
	getUserTopics,
	getTopicDetail,
	getTopicBySlug,
	createTopic,
	updateTopic,
	deleteTopic
} from './topics';

// Replies
export { getReplies, createReply, updateReply, deleteReply } from './replies';

// Search
export { searchForum } from './search';

// Views
export { recordTopicView, getUserTopicViewTimestamps } from './views';

// Reactions
export { toggleForumReaction, getReactionsForPosts } from './reactions';
export type { ForumReactionData } from './reactions';

// Bookmarks
export { toggleBookmark, getUserBookmarks, getBookmarkStatus } from './bookmarks';

// Admin
export {
	pinTopic,
	lockTopic,
	moveTopic,
	adminDeleteTopic,
	adminDeleteReply,
	getForumStats,
	getForumModerationQueue
} from './admin';
export type { ForumStats, ForumModerationQueue } from './admin';
