<script lang="ts">
	import umatlogo from '$lib/assets/Umat logo.jpg';
	
</script>

<svelte:head>
	<title>About | Therapy Bot</title>
</svelte:head>

<div
	class="bg-zinc-800/50 p-8 rounded-xl mx-auto w-full max-w-2xl my-4 space-y-4 [&_p]:text-lg [&_p]:indent-8"
>
	<h1 class="text-center text-4xl">AI Therapist Chatbot</h1>

	<p>
		This project was made by an  undergraduate student from University of Mines and Technology  under the supiversory of lecturers in Computer Science and Engineering Department. The program aims at
		teaching students the future of AI and its applications in the medical field.
	</p>

	<p>
		The therapy chatbot is a cutting-edge digital mental health aid made to reassure and assist
		people going through stressful or depressing times. This chatbot was created with the
		Google-Gemini API and focuses on empathy and accessibility while providing a smooth user
		experience. Simple text interactions engage users and foster a friendly environment where they
		can find solace from emotional suffering.
	</p>
	<p>
		The chatbot is taught to provide insightful suggestions and resources for more professional
		treatment, even if it lacks a license to practice therapy. The chatbot seeks to close the
		accessibility gap in mental health care by utilizing cutting-edge AI technology to offer people
		in need of ongoing and rapid support. Our mission is to lessen depressive symptoms by providing
		a trustworthy, sympathetic partner that users may enjoy from the comfort of their homes. This
		app adds to the integration of AI in mental health care, demonstrating the potential of
		technology to enhance emotional well-being and support mental health initiatives.
	</p>

	<div class="flex flex-col">
		<img src={umatlogo} alt="UMaT Logo" />
	
	</div>
</div>
