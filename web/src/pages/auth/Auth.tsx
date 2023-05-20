import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { useEffect } from 'react';
import { shallow } from 'zustand/shallow';

import useSupabase from '../../auth/supabaseClient';
import { useStore, selector } from '../../store';

export default function AuthPage() {
	const { nodes, setCurrentWorkflow } = useStore(selector, shallow);

	const supabase = useSupabase();

	useEffect(() => {
		const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
			if (event === 'SIGNED_IN') {
				// if user have been creating a workflow without logging in, save it
				// if (nodes.length && session) {
				setCurrentWorkflow(null);
				// }
				window.open('/', '_self');
			}
		});

		// Clean up the listener when the component is unmounted
		return () => {
			authListener.subscription.unsubscribe();
		};
	}, [nodes.length, setCurrentWorkflow, supabase]);
	return (
		<>
			<div className="flex min-h-full flex-col py-52 sm:px-6 lg:px-8">
				<div className="sm:mx-auto sm:w-full sm:max-w-md">
					<h1 className="mx-auto h-12 w-auto text-center text-5xl">Chatbutler.ai</h1>
					<h2 className="mt-6 text-center text-2xl font-bold tracking-tight text-gray-900">
						Sign in to your account
					</h2>
				</div>

				<div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
					<Auth
						supabaseClient={supabase}
						providers={['google']}
						redirectTo={
							!import.meta.env.VITE_VERCEL_ENV ||
							import.meta.env.VITE_VERCEL_ENV === 'production'
								? 'https://app.Chatbutler.ai'
								: 'http://localhost:5173'
						}
						appearance={{
							theme: ThemeSupa,
							variables: {
								default: {
									colors: {
										brandButtonText: 'black',
									},
								},
							},
						}}
					/>
				</div>
			</div>
		</>
	);
}
