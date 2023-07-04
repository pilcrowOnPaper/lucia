import { auth } from "../lucia.js";

import type { Handler } from "express";

export const logoutAction: Handler = async (req, res) => {
	const authRequest = auth.handleRequest(req, res);
	const session = await authRequest.validate();
	if (!session) {
		return res.sendStatus(401);
	}
	await auth.invalidateSession(session.sessionId);
	authRequest.setSession(null);
	// redirect back to login page
	return res.status(302).setHeader("Location", "/login").end();
};
