import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Headers':
		'authorization, x-client-info, apikey, content-type',
};

serve(async req => {
	if (req.method === 'OPTIONS') {
		return new Response(null, { headers: corsHeaders });
	}

	try {
		const { userMessage, assistantMessage } = await req.json();
		const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

		if (!LOVABLE_API_KEY) {
			console.error('LOVABLE_API_KEY is not configured');
			throw new Error('LOVABLE_API_KEY is not configured');
		}

		console.log('Generating title for conversation');

		const response = await fetch(
			'https://ai.gateway.lovable.dev/v1/chat/completions',
			{
				method: 'POST',
				headers: {
					Authorization: `Bearer ${LOVABLE_API_KEY}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					model: 'google/gemini-2.5-flash',
					messages: [
						{
							role: 'system',
							content:
								"You are a title generator. Generate a short, descriptive title (3-6 words max) for a conversation based on the user's first message and AI's response. The title should be in the same language as the conversation. Return ONLY the title, nothing else. No quotes, no explanation, just the title text.",
						},
						{
							role: 'user',
							content: `User message: "${userMessage}"\n\nAI response: "${
								assistantMessage?.slice(0, 200) || ''
							}"\n\nGenerate a short title:`,
						},
					],
					max_tokens: 50,
					temperature: 0.7,
				}),
			}
		);

		if (!response.ok) {
			const errorText = await response.text();
			console.error('AI gateway error:', response.status, errorText);
			throw new Error('Failed to generate title');
		}

		const data = await response.json();
		const title = data.choices?.[0]?.message?.content?.trim() || 'Yangi suhbat';

		// Clean up the title (remove quotes if present)
		const cleanTitle = title.replace(/^["']|["']$/g, '').slice(0, 50);

		console.log('Generated title:', cleanTitle);

		return new Response(JSON.stringify({ title: cleanTitle }), {
			headers: { ...corsHeaders, 'Content-Type': 'application/json' },
		});
	} catch (e) {
		console.error('generate-title error:', e);
		return new Response(JSON.stringify({ title: 'Yangi suhbat' }), {
			headers: { ...corsHeaders, 'Content-Type': 'application/json' },
		});
	}
});
