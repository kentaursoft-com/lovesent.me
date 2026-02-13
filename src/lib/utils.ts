// ===== Utility Functions =====

// Generate a short, URL-friendly random slug
export function randomSlug(): string {
	return crypto.randomUUID().replace(/-/g, '').slice(0, 10);
}

// Generate a UUID
export function generateId(): string {
	return crypto.randomUUID();
}

// Sanitize text input (basic XSS prevention)
export function sanitize(text: string): string {
	return text
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#x27;');
}

// Validate email format
export function isValidEmail(email: string): boolean {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
}

// Love quotes for random display 💕
export const loveQuotes = [
	"Love is composed of a single soul inhabiting two bodies. 💕",
	"Where there is love there is life. 🌹",
	"The best thing to hold onto in life is each other. 🤗",
	"Love is like a flower — you've got to let it grow. 🌸",
	"Every love story is beautiful, but ours is my favorite. 📖💖",
	"In all the world, there is no heart for me like yours. ❤️",
	"You are my sun, my moon, and all my stars. ✨",
	"To love and be loved is to feel the sun from both sides. ☀️",
	"Love looks not with the eyes, but with the heart. 💞",
	"You had me at hello. 😍",
	"I love you to the moon and back. 🌙",
	"Two hearts that beat as one. 💕",
	"You're the peanut butter to my jelly. 🥜💜",
	"Together is a wonderful place to be. 🏡",
	"Love is friendship on fire. 🔥💖"
];

// Get a random love quote
export function getRandomQuote(): string {
	return loveQuotes[Math.floor(Math.random() * loveQuotes.length)];
}

// Social share URL generators
export function getShareUrl(
	platform: string,
	text: string,
	url: string
): string {
	const encodedText = encodeURIComponent(text);
	const encodedUrl = encodeURIComponent(url);

	switch (platform) {
		case 'twitter':
			return `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
		case 'facebook':
			return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`;
		case 'whatsapp':
			return `https://wa.me/?text=${encodedText}%20${encodedUrl}`;
		case 'telegram':
			return `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`;
		case 'linkedin':
			return `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
		case 'pinterest':
			return `https://pinterest.com/pin/create/button/?url=${encodedUrl}&description=${encodedText}`;
		case 'reddit':
			return `https://reddit.com/submit?url=${encodedUrl}&title=${encodedText}`;
		case 'email':
			return `mailto:?subject=${encodeURIComponent('Love Accepted! 💖')}&body=${encodedText}%20${encodedUrl}`;
		default:
			return url;
	}
}

// No button options organized by category
export const noOptionsLibrary = {
	ordinary: [
		"No 😢",
		"Nah 🙅",
		"Nope 🚫",
		"Not Interested 😔"
	],
	pleading: [
		"Whyyy? 🥺",
		"Why Not Me? 😔",
		"You're Making Me Cry! 💔",
		"Please Don't Say That! 😭",
		"Are You Sure About This? 😢",
		"Think Again Pretty Please! 🥹",
		"Don't Break My Poor Heart! 💔",
		"Pretty Please with Sugar on Top? 💖",
		"Last Chance to Change Your Mind!! ⚠️",
		"Okay... But I'll Always Love You 😞",
		"Wait, Come Back to Me! 🏃",
		"Reconsider? For Us? 🤗",
		"But We Have Chemistry! ⚗️",
		"Don't Leave Me Hanging! 😩",
		"One More Try? 🔄"
	],
	funny: [
		"Really Though? 😱",
		"Ouch, That Stings! 😩",
		"You're Kidding, Right? 😂",
		"No Way! (Just Kidding, Click Yes) 😉",
		"But We're Perfect Together! ✨",
		"Error: 'No' Option Disabled 🚫",
		"Yes Is Way Cuter! 🎀",
		"Puppy Eyes Mode Activated 🐶",
		"Heart Rejection Detected – Reload! 🔄",
		"Fine... (But Secretly Hoping for Yes) 😏",
		"Aw Shucks! Try Again? 🥴",
		"No Isn't in My Vocabulary! 📖",
		"But I Brought Flowers! 🌸",
		"Resistance Is Futile! 👽",
		"Click Yes or the Hearts Cry! 💦",
		"That's Not the Script! 🎭",
		"Plot Twist: Say Yes! 🔄",
		"You're Too Awesome to Say No! 🌟",
		"Heartbreak Loading... Cancel? ❌",
		"Just Testing – Now Say Yes! 😜",
		"No Button Malfunction – Use Yes! ⚙️"
	]
};

// Question suggestions for the Create wizard
export const questionSuggestions = [
	"Will You Be My Valentine? ❤️",
	"Will You Be My World? 🌍",
	"Will You Be My Girlfriend? 🥰",
	"Will You Be My Boyfriend? 😘",
	"Be Mine Forever? 💕",
	"Date Me? 🍒",
	"Marry Me? 💍",
	"Forgive Me? 🌹",
	"Happy Anniversary! 🎉",
	"I Love You! 💞",
	"Be My Partner in Crime? 🕵️",
	"Join My Adventure? 🌟",
	"Be My Soulmate? ✨",
	"Let's Make Memories? 📸",
	"You're My Everything? 🌈",
	"Will You Hold My Hand? 🤝",
	"Be My Sunshine? ☀️",
	"Let's Grow Old Together? 👴👵",
	"You're Irresistible! 😍",
	"Say Yes to Us? 🥂"
];
