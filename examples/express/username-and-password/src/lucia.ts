import { lucia } from "lucia";
import { betterSqlite3 } from "@lucia-auth/adapter-sqlite";
import { express } from "lucia/middleware";
import "lucia/polyfill/node";

import sqlite from "better-sqlite3";
const db = sqlite("main.db");

export const auth = lucia({
	adapter: betterSqlite3(db, {
		user: "user",
		session: "user_session",
		key: "user_key"
	}),
	middleware: express(),
	env: process.env.NODE_ENV === "production" ? "PROD" : "DEV",
	getUserAttributes: (data) => {
		return {
			username: data.username
		};
	}
});

export type Auth = typeof auth;
