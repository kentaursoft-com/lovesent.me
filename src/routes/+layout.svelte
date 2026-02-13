<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { toasts, theme } from '$lib/stores';
	import { LogIn, LogOut, LayoutDashboard, Plus, Sparkles } from 'lucide-svelte';

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
		<a href="/" class="btn btn-ghost text-xl font-dancing text-pink-600 hover:text-pink-700" aria-label="Love Sent home page">
			<span class="hidden sm:inline">Love Sent</span>
			<span class="sm:hidden">LS</span>
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
<footer class="relative z-10 mt-12 bg-base-200/60 border-t border-pink-100">
	<div class="max-w-6xl mx-auto px-4 py-10">
		<!-- Top section: brand + link columns -->
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
			<!-- Brand -->
			<div class="sm:col-span-2 lg:col-span-1">
				<a href="/" class="inline-flex items-center gap-2 text-2xl font-dancing text-pink-600 hover:text-pink-700 mb-3">
					Love Sent
				</a>
				<p class="text-sm text-gray-500 leading-relaxed max-w-xs">
					The cutest way to confess your feelings! Create interactive confession pages that are impossible to refuse. 💖
				</p>
			</div>

			<!-- Platform -->
			<div>
				<h3 class="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">Platform</h3>
				<ul class="space-y-2">
					<li><a href="/create" class="text-sm text-gray-500 hover:text-pink-600 transition-colors">Create Confession ✨</a></li>
					<li><a href="/dashboard" class="text-sm text-gray-500 hover:text-pink-600 transition-colors">Dashboard</a></li>
					<li><a href="/signup" class="text-sm text-gray-500 hover:text-pink-600 transition-colors">Sign Up Free</a></li>
					<li><a href="/login" class="text-sm text-gray-500 hover:text-pink-600 transition-colors">Log In</a></li>
				</ul>
			</div>

			<!-- Company -->
			<div>
				<h3 class="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">Company</h3>
				<ul class="space-y-2">
					<li><a href="/about" class="text-sm text-gray-500 hover:text-pink-600 transition-colors">About Us</a></li>
					<li><a href="/contact" class="text-sm text-gray-500 hover:text-pink-600 transition-colors">Contact</a></li>
					<li><a href="https://kentaursoft.com" target="_blank" rel="noopener noreferrer" class="text-sm text-gray-500 hover:text-pink-600 transition-colors">Kentaur Soft Inc. ↗</a></li>
				</ul>
			</div>

			<!-- Legal -->
			<div>
				<h3 class="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">Legal</h3>
				<ul class="space-y-2">
					<li><a href="/privacy" class="text-sm text-gray-500 hover:text-pink-600 transition-colors">Privacy Policy</a></li>
					<li><a href="/terms" class="text-sm text-gray-500 hover:text-pink-600 transition-colors">Terms of Service</a></li>
				</ul>
			</div>
		</div>

		<!-- Divider -->
		<div class="border-t border-pink-100"></div>

		<!-- Bottom bar -->
		<div class="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6">
			<p class="text-sm text-gray-500 text-center sm:text-left">
				© 2026 Love Sent (<a href="https://lovesent.me" class="text-pink-500 hover:text-pink-700">lovesent.me</a>) — A product of <a href="https://kentaursoft.com" target="_blank" rel="noopener noreferrer" class="text-pink-500 hover:text-pink-700 font-medium">Kentaur Soft Inc.</a> All rights reserved.
			</p>
			<p class="text-xs text-gray-400 italic" aria-hidden="true">
				Made with 💖 and lots of love
			</p>
		</div>
	</div>
</footer>
