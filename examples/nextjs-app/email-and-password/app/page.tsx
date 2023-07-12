import { auth } from "@/auth/lucia";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import Form from "@/components/form";

const Page = async () => {
	const authRequest = auth.handleRequest({
		request: null,
		cookies
	});
	const session = await authRequest.validate();
	if (!session) redirect("/login");
	if (!session.user.emailVerified) redirect("/email-verification");
	return (
		<>
			<h1>Profile</h1>
			<p>User id: {session.user.userId}</p>
			<p>Email: {session.user.email}</p>
			<Form action="/api/logout">
				<input type="submit" value="Sign out" />
			</Form>
		</>
	);
};

export default Page;
