import { Session } from '@supabase/supabase-js';

import { SimpleWorkflow } from '../../../db/dbTypes';
import { DocSource } from '../../../nodes/types/NodeTypes';
import { RFState } from '../../../store/useStore';

function isValidUrl(urlString: string): boolean {
	try {
		new URL(urlString);
		return true;
	} catch (error) {
		return false;
	}
}

export async function uploadWebsiteUrl(
	currentSession: Session | null,
	source: DocSource,
	text: string,
	setText: React.Dispatch<React.SetStateAction<string>>,
	chatbot: SimpleWorkflow,
	setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
	setChatbotDocuments: React.Dispatch<
		React.SetStateAction<
			| {
					[x: string]: any;
			  }[]
			| null
		>
	>,
	setUiErrorMessage: RFState['setUiErrorMessage'],
) {
	if (!currentSession || !currentSession.access_token) {
		throw new Error('No session');
	}

	if (source === DocSource.pdfUrl || source === DocSource.websiteUrl) {
		if (!isValidUrl(text)) {
			alert('Please enter a valid URL');
			return;
		}
		const options = {
			method: 'POST',
			headers: {
				accept: 'application/json',
				'Content-Type': 'application/json',
				Authorization: `Bearer ${currentSession.access_token}`,
			},
			body: JSON.stringify({
				urls: [text],
				chatbot_id: chatbot.id,
			}),
		};

		const fileName = '';

		console.log('session', currentSession);

		try {
			setIsLoading(true);
			let response = await fetch('https://server.chatbutler.ai/upload-url/', options);

			// check if response is ok
			if (!response.ok) {
				setIsLoading(false);
				setUiErrorMessage('Error uploading document');
				throw new Error('Error uploading document');
			}

			response = await response.json();
			console.log('hi', response);

			// Start polling progress endpoint every X interval
			const progressInterval = setInterval(async () => {
				try {
					const progressResponse = await fetch(
						`https://server.chatbutler.ai/progress/?url=${encodeURIComponent(text)}`,
					).then((response) => response.json());

					// If progress is 100, stop polling and set loading to false
					if (progressResponse.progress === 100) {
						clearInterval(progressInterval);
						setChatbotDocuments((prev) => [
							...(prev || []),
							{
								name: progressResponse.url,
							},
						]);
						setIsLoading(false);
						setText('');
					}
				} catch (error) {
					console.log('Error fetching progress:', error);
				}
			}, 5000); // replace 5000 (5 seconds) with your desired interval
		} catch (error) {
			console.log(error);
		}
	} else {
		throw new Error('Invalid source');
	}
}
