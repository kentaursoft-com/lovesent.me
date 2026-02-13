<script lang="ts">
	import { Heart } from 'lucide-svelte';
</script>

<svelte:head>
	<title>Lost Love Letter 💔 — Love Sent</title>
</svelte:head>

<div class="min-h-[70vh] flex flex-col items-center justify-center px-4 py-12 bg-love-gradient text-center">
	<div class="animate-bounce-cute mb-6">
		<span class="text-8xl" aria-hidden="true">💔</span>
	</div>

	<h1 class="text-5xl font-dancing text-pink-600 mb-4">Lost Love Letter!</h1>
	<p class="text-xl text-gray-600 mb-2">This page seems to have wandered off... 😢</p>
	<p class="text-gray-500 mb-8">Maybe the love letter got lost in the mail?</p>

	<div class="flex gap-4 flex-wrap justify-center">
		<a href="/" class="btn btn-primary rounded-full gap-2 shadow-lg" aria-label="Go back to homepage">
			<Heart class="w-5 h-5 fill-white" aria-hidden="true" />
			Go Home 💖
		</a>
		<a href="/create" class="btn btn-outline border-pink-300 text-pink-500 rounded-full gap-2" aria-label="Create your own confession">
			Create Your Own ✨
		</a>
	</div>
</div>
