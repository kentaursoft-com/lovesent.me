<script lang="ts">
	import { onMount } from 'svelte';
	import { getShareUrl } from '$lib/utils';

	let { data } = $props();
	const c = data.confession;

	// State
	let noClicks = $state(0);
	let currentNoIndex = $state(0);
	let yesScale = $state(1);
	let noPosition = $state({ top: '60%', left: '60%' });
	let noScale = $state(1);
	let noText = $state(c.noOptions[0] || 'No 😢');
	let accepted = $state(c.accepted || false);
	let showOverlay = $state(false);
	let showPersistentMessage = $state(false);
	let mounted = $state(false);
	let containerEl: HTMLDivElement;

	// Heart emojis for floating animation
	const heartEmojis = ['❤️', '💖', '💕', '🌸', '💜', '💛', '💗', '💓', '💞', '💝'];

	onMount(() => {
		mounted = true;
		if (c.accepted) {
			showOverlay = true;
		}
	});

	function onNoClick() {
		noClicks++;
		currentNoIndex = (currentNoIndex + 1) % c.noOptions.length;
		noText = c.noOptions[currentNoIndex];

		// Move the No button to a random position
		if (containerEl) {
			const rect = containerEl.getBoundingClientRect();
			const maxTop = rect.height - 60;
			const maxLeft = rect.width - 160;
			const newTop = Math.max(50, Math.random() * maxTop);
			const newLeft = Math.max(10, Math.random() * maxLeft);
			noPosition = { top: `${newTop}px`, left: `${newLeft}px` };
		}

		// Grow Yes button
		yesScale = 1 + noClicks * 0.12;

		// Shrink No button after many attempts
		if (noClicks > 6) {
			noScale = Math.max(0.4, 1 - (noClicks - 6) * 0.08);
		}

		// Shake screen every 3 clicks
		if (noClicks % 3 === 0) {
			shakeScreen();
		}

		// Show persistent message after 15+ clicks
		if (noClicks >= 15) {
			showPersistentMessage = true;
		}
	}

	function shakeScreen() {
		document.body.classList.add('shake');
		setTimeout(() => document.body.classList.remove('shake'), 500);
	}

	async function onYesClick() {
		accepted = true;
		showOverlay = true;

		// Fire confetti!
		if (mounted) {
			try {
				const confettiModule = await import('canvas-confetti');
				const confetti = confettiModule.default;

				// Initial burst
				confetti({
					particleCount: 200,
					spread: 120,
					origin: { y: 0.6 },
					colors: ['#ff69b4', '#ff1493', '#ffffff', '#ffd700', '#d946ef', '#f472b6']
				});

				// Second burst
				setTimeout(() => {
					confetti({
						particleCount: 150,
						angle: 60,
						spread: 80,
						origin: { x: 0 },
						colors: ['#ff69b4', '#ff1493', '#ffffff']
					});
				}, 250);

				// Third burst
				setTimeout(() => {
					confetti({
						particleCount: 150,
						angle: 120,
						spread: 80,
						origin: { x: 1 },
						colors: ['#ff69b4', '#ff1493', '#ffffff']
					});
				}, 400);

				// Continuous hearts
				const duration = 4000;
				const end = Date.now() + duration;
				const interval = setInterval(() => {
					if (Date.now() > end) {
						clearInterval(interval);
						return;
					}
					confetti({
						particleCount: 10,
						angle: 90,
						spread: 360,
						origin: { x: Math.random(), y: Math.random() * 0.3 },
						colors: ['#ff69b4', '#ff1493', '#d946ef'],
						ticks: 200,
						gravity: 0.5,
						scalar: 1.5
					});
				}, 100);
			} catch (e) {
				console.log('Confetti not available', e);
			}
		}

		// Send acceptance to server
		try {
			await fetch(`/api/accept/${c.uniqueSlug}`, { method: 'POST' });
		} catch {
			// Non-critical
		}

		// Create celebration hearts
		createCelebrationHearts();
	}

	function createCelebrationHearts() {
		if (!containerEl) return;
		for (let i = 0; i < 40; i++) {
			setTimeout(() => {
				const heart = document.createElement('span');
				heart.className = 'heart-float';
				heart.style.left = `${Math.random() * 100}%`;
				heart.style.animationDuration = `${3 + Math.random() * 5}s`;
				heart.style.fontSize = `${16 + Math.random() * 32}px`;
				heart.style.opacity = `${Math.random() * 0.6 + 0.4}`;
				heart.innerText = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
				containerEl.appendChild(heart);
				setTimeout(() => heart.remove(), 8000);
			}, i * 100);
		}
	}

	function shareResult() {
		const text = `${c.crushName} said YES on Love Sent! 💖🎉`;
		const url = window.location.href;
		if (navigator.share) {
			navigator.share({ title: 'Love Accepted! 💖', text, url });
		} else {
			window.open(getShareUrl('twitter', text, url), '_blank');
		}
	}

	async function takeScreenshot() {
		try {
			const html2canvas = (await import('html2canvas')).default;
			const overlay = document.getElementById('acceptance-overlay');
			if (overlay) {
				const canvas = await html2canvas(overlay);
				const link = document.createElement('a');
				link.download = `love-accepted-${c.crushName}.png`;
				link.href = canvas.toDataURL();
				link.click();
			}
		} catch {
			// Fallback: just show share options
			shareResult();
		}
	}
</script>

<svelte:head>
	<title>{c.crushName}, {c.questionText} 💖 — Love Sent</title>
	<meta name="description" content="A special romantic confession for {c.crushName} on Love Sent 💕" />
	<meta property="og:title" content="{c.crushName}, {c.questionText} 💖" />
	<meta property="og:description" content="Someone has a heartfelt confession for {c.crushName}! Open to find out... 🥰" />
	<meta property="og:type" content="website" />
</svelte:head>

<div
	bind:this={containerEl}
	class="min-h-screen flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden"
	style="background: linear-gradient(135deg, {c.themeColor || '#fce4ec'} 0%, #f3e5f5 50%, #e8eaf6 100%);"
>
	<!-- Floating hearts background -->
	<div class="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
		{#each Array(12) as _, i}
			<span
				class="heart-float absolute"
				style="left: {(i * 8.3)}%; animation-duration: {6 + (i % 5) * 2}s; font-size: {14 + (i % 4) * 6}px; opacity: {0.2 + (i % 3) * 0.15}; animation-delay: {i * 0.5}s;"
			>
				{heartEmojis[i % heartEmojis.length]}
			</span>
		{/each}
	</div>

	<!-- Main Confession Content -->
	{#if !showOverlay}
		<div class="relative z-10 flex flex-col items-center max-w-lg mx-auto text-center">
			<!-- Photo -->
			{#if c.photoUrl}
				<img
					src={c.photoUrl}
					alt="Special photo for {c.crushName} 💖"
					class="w-36 h-36 sm:w-48 sm:h-48 rounded-full object-cover border-8 border-white shadow-xl mb-6 animate-pulse-heart"
				/>
			{:else}
				<div class="w-36 h-36 sm:w-48 sm:h-48 rounded-full bg-gradient-to-br from-pink-300 to-purple-300 flex items-center justify-center border-8 border-white shadow-xl mb-6 animate-pulse-heart">
					<span class="text-6xl" aria-hidden="true">💝</span>
				</div>
			{/if}

			<!-- Question -->
			<h1 class="text-3xl sm:text-4xl md:text-5xl font-dancing text-pink-700 mb-3 leading-tight">
				{c.crushName},
			</h1>
			<h2 class="text-2xl sm:text-3xl md:text-4xl font-dancing text-pink-600 mb-4">
				{c.questionText} 😍
			</h2>

			<!-- Extra Message -->
			{#if c.extraMessage}
				<p class="text-lg text-gray-600 mb-6 italic bg-white/60 rounded-2xl px-6 py-3 backdrop-blur">
					"{c.extraMessage}" 💕
				</p>
			{/if}

			<!-- YES Button -->
			<button
				id="yes-btn"
				class="btn btn-primary btn-lg rounded-full shadow-xl text-xl px-10 mb-6 hover:shadow-2xl glow-pink"
				style="transform: scale({yesScale}); transition: transform 0.4s ease;"
				onclick={onYesClick}
				aria-label="Yes! Accept the confession with joy! 💖"
			>
				Yes! 💕
			</button>

			<!-- NO Button (the playful one!) -->
			{#if mounted}
				<button
					id="no-btn"
					class="btn btn-outline border-pink-300 text-pink-500 rounded-full shadow-md absolute"
					style="top: {noPosition.top}; left: {noPosition.left}; transform: scale({noScale}); transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); z-index: 20;"
					onclick={onNoClick}
					aria-label="No button: Try clicking it... if you can! 😏"
				>
					{noText}
				</button>
			{/if}

			<!-- Persistent message after many No clicks -->
			{#if showPersistentMessage}
				<div class="mt-4 p-4 bg-white/80 backdrop-blur rounded-2xl shadow-md animate-bounce-cute">
					<p class="text-pink-600 font-medium">
						Okay, you're persistent! 😂 But Yes is still waiting... 💕
					</p>
				</div>
			{/if}

			<!-- No click counter (subtle) -->
			{#if noClicks > 0 && noClicks < 15}
				<p class="text-sm text-pink-400 mt-4 opacity-70" aria-hidden="true">
					{#if noClicks < 5}
						The No button is getting nervous! 😅
					{:else if noClicks < 10}
						It's running away from you! 🏃💨
					{:else}
						Almost gave up? Just say Yes! 🥺💖
					{/if}
				</p>
			{/if}
		</div>
	{/if}

	<!-- Acceptance Overlay -->
	{#if showOverlay}
		<div id="acceptance-overlay" class="relative z-20 flex flex-col items-center max-w-lg mx-auto text-center animate-bounce-cute">
			<div class="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-8 sm:p-12 border border-pink-100">
				<div class="text-6xl mb-4" aria-hidden="true">🎉💖🎉</div>

				<h1 class="text-4xl sm:text-5xl font-dancing text-pink-600 mb-4">
					YAYYYYY! 🥰
				</h1>

				<h2 class="text-2xl font-dancing text-pink-500 mb-4">
					{c.crushName} Accepted! 💖💖💖
				</h2>

				<p class="text-lg text-gray-600 mb-2">
					You just made someone very happy!
				</p>

				<p class="text-xl text-pink-500 font-medium mb-6">
					Your heart just fluttered! 💞
				</p>

				{#if c.extraMessage}
					<div class="bg-pink-50 rounded-2xl p-4 mb-6">
						<p class="text-gray-600 italic">"{c.extraMessage}" 💕</p>
					</div>
				{/if}

				<div class="text-4xl mb-6" aria-hidden="true">
					✨🌹💕🌸💖✨
				</div>

				<!-- Action Buttons -->
				<div class="flex flex-wrap gap-3 justify-center">
					<button
						class="btn btn-primary rounded-full gap-1 shadow-md"
						onclick={shareResult}
						aria-label="Share this happy moment"
					>
						📱 Share the Joy!
					</button>
					<button
						class="btn btn-secondary rounded-full gap-1 shadow-md"
						onclick={takeScreenshot}
						aria-label="Take a screenshot of this moment"
					>
						📸 Screenshot
					</button>
				</div>

				<!-- Social Share Links -->
				<div class="flex flex-wrap gap-3 justify-center mt-6">
					{#each ['twitter', 'whatsapp', 'facebook', 'telegram'] as platform}
						<a
							href={getShareUrl(platform, `${c.crushName} said YES on Love Sent! 💖🎉`, typeof window !== 'undefined' ? window.location.href : `https://lovesent.me/confess/${c.uniqueSlug}`)}
							target="_blank"
							rel="noopener noreferrer"
							class="btn btn-sm btn-outline rounded-full capitalize border-pink-200 text-pink-500 hover:bg-pink-50"
							aria-label="Share on {platform}"
						>
							{#if platform === 'twitter'}🐦{:else if platform === 'whatsapp'}💬{:else if platform === 'facebook'}📘{:else}✈️{/if}
							{platform}
						</a>
					{/each}
				</div>

				<p class="text-sm text-gray-400 mt-6">
					Love is in the air! 🌹 — <a href="/" class="text-pink-500 underline">lovesent.me</a>
				</p>
			</div>
		</div>
	{/if}
</div>
