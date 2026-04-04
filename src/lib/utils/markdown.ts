import { marked } from 'marked';
import DOMPurify from 'isomorphic-dompurify';

marked.setOptions({
	breaks: true,
	gfm: true
});

export function renderMarkdown(text: string): string {
	const raw = marked.parse(text, { async: false }) as string;
	return DOMPurify.sanitize(raw, {
		ALLOWED_TAGS: [
			'p', 'br', 'strong', 'em', 'del', 'a', 'ul', 'ol', 'li',
			'h1', 'h2', 'h3', 'h4', 'blockquote', 'code', 'pre', 'img', 'hr'
		],
		ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'target', 'rel'],
		ADD_ATTR: ['target']
	});
}
