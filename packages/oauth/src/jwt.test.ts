import { importPKCS8 } from "jose";
import { test, expect } from "vitest";
import { SignJWT, jwtVerify } from "jose";
import { createES256SignedJWT } from "./jwt.js";
import { getPKCS8Key } from "./utils.js";

test("createES256SignedJWT()", async () => {
	const keyId = "KEY_ID";
	const issuer = "TEAM_ID";
	const audience = "https://appleid.apple.com";

	const certificate = `-----BEGIN PRIVATE KEY-----
MIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgmGp6kcu19PgWNuga
r/CDWncdxmhlxAeo6ERpz2q4pHehRANCAASXR+mBqrjqcaJVzZoVYoWMQGAG8eQY
Jg0x4ad/bCs1qaMTLyMtsANR2dgANIfU7lKEeZAxPap8ch+I1LtW2pHH
-----END PRIVATE KEY-----`;

	const now = Math.floor(new Date().getTime());
	const payload = {
		iss: issuer,
		iat: now,
		exp: now + 60 * 3,
		aud: audience,
		sub: "CLIENT_ID"
	};

	const getJoseJwt = async () => {
		const cert = await importPKCS8(certificate, "ES256");
		const jwt = await new SignJWT(payload)
			.setProtectedHeader({ alg: "ES256", kid: keyId })
			.sign(cert);

		return jwt;
	};

	const getJWT = async () => {
		const privateKey = getPKCS8Key(certificate);
		const jwt = await createES256SignedJWT(
			{
				alg: "ES256",
				kid: keyId
			},
			payload,
			privateKey
		);
        return jwt
	};

	const verifyJWT = async (jwt: string) => {
		await jwtVerify(jwt, await importPKCS8(certificate, "ES256"), {
			issuer,
			audience,
			algorithms: ["ES256"]
		});
	};

	// ie. expect the promise to resolve without any errors
	await expect(verifyJWT(await getJoseJwt())).resolves.to.not.toThrowError();
	await expect(verifyJWT(await getJWT())).resolves.to.not.toThrowError();
});
