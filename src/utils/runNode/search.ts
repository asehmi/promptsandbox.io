import { ConversationalRetrievalQAChain } from 'langchain/chains';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { Node } from 'reactflow';

import { createSupabaseClient } from '../../auth/supabaseClient';
import { NodeTypesEnum, SearchDataType } from '../../nodes/types/NodeTypes';
import { RFState } from '../../store/useStore';
import { Message } from '../../windows/ChatPanel/Chat/types';
import { parsePromptInputs } from '../parsePromptInputs';
import { SupabaseVectorStoreWithFilter } from '../vectorStores/SupabaseVectorStoreWithFilter';
const search = async (node: Node<SearchDataType>, get: () => RFState, openAiKey: string) => {
	try {
		const inputs = node.data.inputs;
		const inputNodes = get().getNodes(inputs.inputs);
		const currentWorkflow = get().currentWorkflow;
		const docsLoaderNodeIndex = inputNodes.findIndex((node) => node.type === 'docsLoader');
		const inputIds = inputs.inputs.filter((input) => input !== 'docsLoader');
		const searchNode = node.data as SearchDataType;
		const userQuestion = parsePromptInputs(get, searchNode.text, inputIds);

		const chatApp = get().chatApp;
		let newChatApp: Message[] = [
			...chatApp,
			{
				role: 'assistant',
				content: `Search docs(s) ${inputNodes[docsLoaderNodeIndex].data.response} "${userQuestion}"...`,
				assistantMessageType: NodeTypesEnum.search,
			},
		];
		get().setChatApp(newChatApp);

		const supabase = createSupabaseClient();

		let embeddings = new OpenAIEmbeddings({ openAIApiKey: openAiKey });
		const session = await supabase.auth.getSession();

		if (session.error) {
			throw new Error(session.error.message);
		}

		let model = new ChatOpenAI({
			// TODO: need to let user set the openai settings
			modelName: 'gpt-3.5-turbo',
			openAIApiKey: openAiKey,
		});

		// if no sessions found, use api key set in non-user's "session"
		if (session && session.data && session.data.session && session.data.session.access_token) {
			embeddings = new OpenAIEmbeddings(
				{
					openAIApiKey: session.data.session.access_token,
				},
				{
					basePath: `${import.meta.env.VITE_SUPABASE_FUNCTION_URL}/openai`,
				},
			);
			model = new ChatOpenAI(
				{
					modelName: 'gpt-3.5-turbo',
					// this is the supabase session key, the real openAI key is set in the proxy #ifitworksitworks
					openAIApiKey: session.data.session.access_token,
				},
				{
					basePath: `${import.meta.env.VITE_SUPABASE_FUNCTION_URL}/openai`,
				},
			);
		}
		// Load the docs into the vector store
		const vectorStore = await SupabaseVectorStoreWithFilter.fromExistingIndex(embeddings, {
			client: supabase,
			tableName: 'documents',
			queryName: 'match_documents_with_filters',
		});
		// const vectorStore = await MemoryVectorStore.fromDocuments(docOutput, embeddings);

		const documents = inputNodes[docsLoaderNodeIndex].data.response
			.split(',')
			.map((document) => {
				return {
					name: document,
					chatbot_id: currentWorkflow?.id,
				};
			});

		console.log('yaya', documents);

		const chain = ConversationalRetrievalQAChain.fromLLM(
			model,
			vectorStore.asRetriever(undefined, documents),
			{
				returnSourceDocuments: true,
			},
		);

		chain.returnSourceDocuments = true;
		chain.verbose = true;
		const res = await chain.call({
			question: userQuestion,
			chat_history: [],
		});

		let answer = res.text;
		console.log('answer', answer);
		if (searchNode.returnSource) {
			/*
			 * append answer to add source from res.sourceDocuments, which is an array of objects with loc object field.
			 * append the res.sourceDocument[x].metadata.loc.pageNumber and res.sourceDocument[x].pageContent like so:
			 * `originalAnswer
			 * page pageNumber: pageContent
			 * page n: pageContent n
			 * ...
			 * `
			 */
			answer += '\n\nSource:\n';
			res.sourceDocuments.forEach((doc: any) => {
				answer += `file: ${doc.metadata.name}, page: #${
					doc.metadata.loc.pageNumber
				}\ncontent: ${doc.pageContent.slice(0, 190)}\n`;
			});
		}

		newChatApp = [...newChatApp];
		newChatApp[newChatApp.length - 1] = {
			content: 'Search Finished!',
			role: 'assistant',
			assistantMessageType: NodeTypesEnum.outputText,
		};
		get().setChatApp(newChatApp);
		node.data = {
			...node.data,
			// TODO: need to have a combiner node or a for loop node
			response: answer,
			isLoading: false,
		};
	} catch (error) {
		node.data = {
			...node.data,
			isLoading: false,
		};
		// TODO: set UI error
	}
};

export default search;
