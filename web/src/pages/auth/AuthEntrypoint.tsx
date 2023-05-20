import React from 'react';
import ReactDOM from 'react-dom/client';

import Auth from './Auth';
import Layout from '../Layout';

import '../index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<React.StrictMode>
		<Layout>
			<Auth />
		</Layout>
	</React.StrictMode>,
);
