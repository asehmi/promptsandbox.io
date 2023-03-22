import { Configuration, OpenAIApi } from 'openai';
import { ChatPromptNodeDataType, InputNode, LLMPromptNodeDataType } from '../nodes/types/NodeTypes';

export function parsePromptInputs(prompt: string, inputNodes: InputNode[]): string {
	let parsedPrompt = prompt;
	inputNodes.forEach((inputNode) => {
		parsedPrompt = parsedPrompt.replace(
			new RegExp(`{{${inputNode.data.name}}}`, 'g'),
			inputNode.data.response,
		);
	});
	return parsedPrompt;
}

export async function getOpenAIResponse(
	apiKey: string | null,
	llmPrompt: LLMPromptNodeDataType,
	inputNodes: InputNode[],
) {
	try {
		if (!apiKey) {
			throw new Error(
				'OpenAI API key is not set. Please set it in the settings at the bottom left panel.',
			);
		}

		const parsedPrompt = parsePromptInputs(llmPrompt.text, inputNodes);

		const settings: {
			model: string;
			prompt: string;
			max_tokens: number;
			temperature: number;
			top_p: number;
			presence_penalty: number;
			frequency_penalty: number;
			best_of: number;
			stop?: string[];
		} = {
			model: llmPrompt.model,
			prompt: parsedPrompt,
			max_tokens: Math.floor(llmPrompt.max_tokens),
			temperature: llmPrompt.temperature,
			top_p: llmPrompt.top_p,
			presence_penalty: llmPrompt.presence_penalty,
			frequency_penalty: llmPrompt.frequency_penalty,
			best_of: Math.floor(llmPrompt.best_of),

			// TODO: make these fields configurable
			// n: llmPrompt.n,
			// stream: llmPrompt.stream,
		};

		if (llmPrompt.stop.length) {
			settings.stop = llmPrompt.stop;
		}

		const config = new Configuration({
			apiKey,
		});
		const openAi = new OpenAIApi(config);
		const response = await openAi.createCompletion(settings);
		return response;
	} catch (error: any) {
		throw new Error(error.message);
	}
}

export async function getOpenAIChatResponse(
	apiKey: string | null,
	chatPrompt: ChatPromptNodeDataType,
	chatSequence: {
		role: 'user' | 'assistant' | 'system';
		content: string;
	}[],
) {
	if (!apiKey) {
		throw new Error(
			'OpenAI API key is not set. Please set it in the settings at the bottom left panel.',
		);
	}
	const settings: {
		messages: {
			role: 'user' | 'assistant' | 'system';
			content: string;
		}[];
		model: string;
		max_tokens: number;
		temperature: number;
		top_p: number;
		presence_penalty: number;
		frequency_penalty: number;
		best_of: number;
		stop?: string[];
	} = {
		messages: chatSequence,
		model: chatPrompt.model,
		max_tokens: Math.floor(chatPrompt.max_tokens),
		temperature: chatPrompt.temperature,
		top_p: chatPrompt.top_p,
		presence_penalty: chatPrompt.presence_penalty,
		frequency_penalty: chatPrompt.frequency_penalty,
		best_of: Math.floor(chatPrompt.best_of),

		// TODO: make these fields configurable
		stop: chatPrompt.stop,
	};

	if (chatPrompt.stop.length) {
		settings.stop = chatPrompt.stop;
	}

	const config = new Configuration({
		apiKey,
	});
	const openAi = new OpenAIApi(config);
	// TODO: Other openAI APIs especially Chat
	const response = await openAi.createChatCompletion(settings);

	return response;
}
