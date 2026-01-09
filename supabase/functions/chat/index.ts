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
		const { messages } = await req.json();
		const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

		if (!LOVABLE_API_KEY) {
			console.error('LOVABLE_API_KEY is not configured');
			throw new Error('LOVABLE_API_KEY is not configured');
		}

		console.log(
			'Sending request to Lovable AI Gateway with',
			messages.length,
			'messages'
		);

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
								'You are NexusAI, a helpful and friendly AI assistant. You help users with their questions and tasks. Keep your responses clear, concise, and helpful. You can assist with productivity, answer questions, and help users accomplish their goals. Respond in the same language the user writes to you.',
						},
						...messages,
					],
					stream: true,
				}),
			}
		);

		if (!response.ok) {
			const errorText = await response.text();
			console.error('AI gateway error:', response.status, errorText);

			if (response.status === 429) {
				return new Response(
					JSON.stringify({
						error: 'Rate limits exceeded, please try again later.',
					}),
					{
						status: 429,
						headers: { ...corsHeaders, 'Content-Type': 'application/json' },
					}
				);
			}
			if (response.status === 402) {
				return new Response(
					JSON.stringify({
						error: 'Payment required, please add funds to your workspace.',
					}),
					{
						status: 402,
						headers: { ...corsHeaders, 'Content-Type': 'application/json' },
					}
				);
			}

			return new Response(JSON.stringify({ error: 'AI gateway error' }), {
				status: 500,
				headers: { ...corsHeaders, 'Content-Type': 'application/json' },
			});
		}

		console.log('Successfully received streaming response from AI Gateway');

		return new Response(response.body, {
			headers: { ...corsHeaders, 'Content-Type': 'text/event-stream' },
		});
	} catch (e) {
		console.error('chat error:', e);
		return new Response(
			JSON.stringify({
				error: e instanceof Error ? e.message : 'Unknown error',
			}),
			{
				status: 500,
				headers: { ...corsHeaders, 'Content-Type': 'application/json' },
			}
		);
	}
});
