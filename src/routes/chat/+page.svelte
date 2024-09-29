<script lang="ts">
	import ChatList from '$lib/components/ChatList.svelte';
	import type { History } from '$lib/history';
	import { onMount } from 'svelte';

	let text: string = '';
	let history: History[] = [
		{ role: 'user', parts: [{ text: '**user enter chat**' }] },
		{ role: 'model', parts: [{ text: "Hello there, I'm glad to see you here!" }] }
	];
	let message: Promise<string> = new Promise((resolve) => {
		resolve('"Input text to begin"');
	});
	let recognition: SpeechRecognition;
	let isRecording = false;

	onMount(() => {
		if ('webkitSpeechRecognition' in window) {
			recognition = new webkitSpeechRecognition();
			recognition.continuous = true;
			recognition.interimResults = true;
			recognition.onresult = (event) => {
				const result = event.results[event.results.length - 1];
				if (result.isFinal) {
					text += result[0].transcript + ' ';
				}
			};
			recognition.onerror = (event) => {
				console.error('Speech recognition error', event.error);
				isRecording = false;
			};
			recognition.onend = () => {
				isRecording = false;
			};
		}
	});

	function toggleRecording() {
		if (!recognition) {
			alert('Speech recognition is not supported in this browser.');
			return;
		}
		if (isRecording) {
			recognition.stop();
		} else {
			recognition.start();
		}
		isRecording = !isRecording;
	}

	const handleSubmit = async () => {
		if (text === '' || history[history.length - 1].role === 'user') return;
		history.push({ role: 'user', parts: [{ text }] });
		const response = await fetch('/api/chat', {
			method: 'POST',
			body: JSON.stringify({
				text,
				history
			})
		});
		text = '';
		message = new Promise((resolve, reject) => {
			response
				.json()
				.then((value) => {
					setTimeout(
						() => {
							history = [...history, { role: 'model', parts: [{ text: value.message }] }];
							resolve(value.message);
						},
						Math.random() * 2000 + 1000
					);
				})
				.catch((error) => reject(error));
		});
	};
</script>

<svelte:head>
	<title>Chat | Therapy Bot</title>
</svelte:head>

<div class="flex h-full">
	<div class="m-auto h-[90svh] w-full max-w-2xl bg-zinc-800/20 p-8 rounded-lg flex flex-col">
		{#await message}
			<ChatList history={history.slice(1)} loading />
		{:then}
			<ChatList history={history.slice(1)} />
		{:catch}
			<p>Error</p>
		{/await}
		<form
			on:submit|preventDefault={handleSubmit}
			class="input-group input-group-divider grid-cols-[auto_1fr_auto]"
		>
			<button
				type="button"
				on:click={toggleRecording}
				class={`variant-filled-${isRecording ? 'error' : 'secondary'} p-2`}
				aria-label={isRecording ? 'Stop recording' : 'Start recording'}
			>
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					{#if isRecording}
						<!-- Stop icon -->
						<rect x="4" y="4" width="16" height="16" rx="2" ry="2"/>
					{:else}
						<!-- Microphone icon -->
						<path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
						<path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
						<line x1="12" y1="19" x2="12" y2="23"/>
						<line x1="8" y1="23" x2="16" y2="23"/>
					{/if}
				</svg>
			</button>
			<input
				type="text"
				name="user-input"
				autocomplete="off"
				placeholder="Enter input"
				class="bg-transparent border-0 ring-0"
				bind:value={text}
			/>
			<button type="submit" class="variant-filled-primary">Send</button>
		</form>
	</div>
</div>