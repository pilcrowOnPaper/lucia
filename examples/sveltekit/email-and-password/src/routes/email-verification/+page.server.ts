import { redirect, fail } from '@sveltejs/kit';
import { generateEmailVerificationToken } from '$lib/server/verification-token';
import { sendEmailVerificationLink } from '$lib/server/email';

import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth.validate();
	if (!session) throw redirect(302, '/login');
	if (session.user.emailVerified) {
		throw redirect(302, '/');
	}
	return {
		userId: session.user.userId,
		email: session.user.email
	};
};

export const actions: Actions = {
	default: async ({ locals }) => {
		const session = await locals.auth.validate();
		if (!session) throw redirect(302, '/login');
		if (session.user.emailVerified) {
			throw redirect(302, '/');
		}
		try {
			const token = await generateEmailVerificationToken(session.user.userId);
			await sendEmailVerificationLink(token);
			return {
				success: true
			};
		} catch {
			return fail(500, {
				message: 'An unknown error occurred'
			});
		}
	}
};
