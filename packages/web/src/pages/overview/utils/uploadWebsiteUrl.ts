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
	url: string,
	chatbot: SimpleWorkflow,
	setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
	setUiErrorMessage: RFState['setUiErrorMessage'],
) {
	if (!currentSession || !currentSession.access_token) {
		throw new Error('No session');
	}

	if (source === DocSource.pdfUrl || source === DocSource.websiteUrl) {
		if (!isValidUrl(url)) {
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
				urls: [url],
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
			// Start polling progress endpoint every X interval
			const progressInterval = setInterval(async () => {
				try {
					const progressResponse = await fetch(
						`https://server.chatbutler.ai/progress/?url=${encodeURIComponent(url)}`,
					).then((response) => response.json());

					// If progress is 100, stop polling and set loading to false
					if (progressResponse.progress === 100) {
						clearInterval(progressInterval);
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