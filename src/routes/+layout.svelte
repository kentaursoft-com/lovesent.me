<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { toasts, theme } from '$lib/stores';
	import { Heart, LogIn, LogOut, LayoutDashboard, Plus, Sparkles } from 'lucide-svelte';

	let { children, data } = $props();
	let heartContainer: HTMLDivElement;

	const heartEmojis = ['❤️', '💖', '💕', '🌸', '💜', '💛', '💗', '💓'];

	function createHeart() {
		if (!heartContainer) return;
		const heart = document.createElement('span');
		heart.className = 'heart-float';
		heart.style.left = `${Math.random() * 100}vw`;
		heart.style.animationDuration = `${6 + Math.random() * 10}s`;
		heart.style.fontSize = `${12 + Math.random() * 24}px`;
		heart.style.opacity = `${Math.random() * 0.4 + 0.3}`;
		heart.innerText = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
		heartContainer.appendChild(heart);
		const duration = parseFloat(heart.style.animationDuration) * 1000;
		setTimeout(() => heart.remove(), duration);
	}

	onMount(() => {
		// Create initial batch of hearts
		for (let i = 0; i < 15; i++) {
			setTimeout(() => createHeart(), i * 200);
		}
		// Continue creating hearts
		const interval = setInterval(createHeart, 2000);
		return () => clearInterval(interval);
	});
</script>

<!-- Skip link for accessibility -->
<a href="#main-content" class="skip-link" aria-label="Skip to main content">
	Skip to content 💖
</a>

<!-- Floating hearts background -->
<div bind:this={heartContainer} class="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true"></div>

<!-- Navigation Bar -->
<nav class="navbar bg-base-100/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-pink-100" aria-label="Main navigation">
	<div class="navbar-start">
		<a href="/" class="btn btn-ghost text-xl font-dancing text-pink-600 hover:text-pink-700 gap-1" aria-label="Love Sent home page">
			<Heart class="w-6 h-6 text-pink-500 fill-pink-500 animate-pulse-heart" aria-hidden="true" />
			<span class="hidden sm:inline">Love Sent</span>
			<span class="sm:hidden">LS</span>
			<span aria-hidden="true">💖</span>
		</a>
	</div>

	<div class="navbar-center hidden md:flex">
		<p class="text-sm text-pink-400 italic" aria-hidden="true">
			Send heartfelt confessions that can't be ignored! 😍
		</p>
	</div>

	<div class="navbar-end gap-2">
		{#if data.user}
			<a href="/dashboard" class="btn btn-ghost btn-sm gap-1 text-pink-600" aria-label="Go to your dashboard">
				<LayoutDashboard class="w-4 h-4" aria-hidden="true" />
				<span class="hidden sm:inline">Dashboard</span>
			</a>
			<a href="/create" class="btn btn-primary btn-sm rounded-full gap-1 shadow-md" aria-label="Create a new confession">
				<Plus class="w-4 h-4" aria-hidden="true" />
				<span class="hidden sm:inline">Create</span>
				<span aria-hidden="true">✨</span>
			</a>
			<form method="POST" action="/logout">
				<button type="submit" class="btn btn-ghost btn-sm gap-1 text-gray-500" aria-label="Log out of your account">
					<LogOut class="w-4 h-4" aria-hidden="true" />
					<span class="hidden sm:inline">Logout</span>
				</button>
			</form>
		{:else}
			<a href="/login" class="btn btn-ghost btn-sm gap-1 text-pink-600" aria-label="Log in to your account">
				<LogIn class="w-4 h-4" aria-hidden="true" />
				Login
			</a>
			<a href="/signup" class="btn btn-primary btn-sm rounded-full shadow-md" aria-label="Create a free account">
				<Sparkles class="w-4 h-4" aria-hidden="true" />
				Sign Up 🥰
			</a>
		{/if}
	</div>
</nav>

<!-- Toast Notifications -->
<div class="toast toast-top toast-end z-[100]" aria-live="polite">
	{#each $toasts as toast (toast.id)}
		<div
			class="alert shadow-lg rounded-2xl border-0 {toast.type === 'success'
				? 'alert-success'
				: toast.type === 'error'
					? 'alert-error'
					: toast.type === 'warning'
						? 'alert-warning'
						: 'alert-info'}"
			role="alert"
		>
			<span>
				{#if toast.type === 'success'}💖{:else if toast.type === 'error'}😢{:else if toast.type === 'warning'}⚠️{:else}💡{/if}
				{toast.message}
			</span>
			<button class="btn btn-ghost btn-xs" onclick={() => toasts.remove(toast.id)} aria-label="Dismiss notification">✕</button>
		</div>
	{/each}
</div>

<!-- Main Content -->
<main id="main-content" class="relative z-10 min-h-[calc(100vh-4rem)]">
	{@render children()}
</main>

<!-- Footer -->
<footer class="footer footer-center p-8 bg-base-200/60 text-base-content mt-12 relative z-10">
	<div>
		<p class="font-dancing text-2xl text-pink-500" aria-hidden="true">💕 Love Sent 💕</p>
		<p class="text-sm text-gray-500">Made with 💖 and lots of love © {new Date().getFullYear()}</p>
		<p class="text-xs text-gray-400 italic mt-2">
			"Every love story is beautiful, but yours will be legendary." 🌹
		</p>
	</div>
</footer>
