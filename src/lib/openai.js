import OpenAI from "openai";

const openai = new OpenAI({
	apiKey: import.meta.env.VITE_OPENAI_API_KEY,
	dangerouslyAllowBrowser: true,
});

async function generate(prompt) {
	try {
		const completion = await openai.chat.completions.create({
			model: "gpt-4o",
			messages: [
				{
					role: "user",
					content: prompt,
				},
			],
			response_format: {
				type: "json_schema",
				json_schema: {
					name: "statements_schema",
					schema: {
						type: "object",
						properties: {
							statements: {
								type: "array",
								items: {
									type: "string",
								},
							},
						},
						additionalProperties: false,
					},
				},
			},
		});
		return completion.choices[0];
	} catch (e) {
		console.error(e);
		return;
	}
}

async function chat(messages, format) {
	const completion = await openai.chat.completions.create({
		model: "gpt-4o",
		messages,
		response_format: format || {
			type: "json_schema",
			json_schema: {
				name: "answer_hint_schema",
				schema: {
					type: "object",
					properties: {
						answer: {
							type: "boolean",
						},
						userHasGuessedRight: {
							typy: "boolean",
						},
						hint: {
							type: "string",
						},
					},
				},
			},
		},
	});

	return completion.choices[0];
}

export const getUserPrompt = (randomAnimal, wikiInfo) => {
	return `
        You are a gifted animal expert. You are being given information about the animal: ${randomAnimal}.
        Please return five statements based on the text and return in JSON format. Since we play a guessing game,
        only rely on biological facts about this animal. Also feel free to include your own knowledge.
        Here is the context: ${wikiInfo}
    `;
};

export default { openai };
export { generate, chat };
