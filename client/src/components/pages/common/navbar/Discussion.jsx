import React from "react";
import { useSelector } from "react-redux";
import MyEditor from "../../discuss/MyEditor";


const Discussion = () => {
	return (
		<div>
			{/* Discussion Section 🗣️ Imagine the Discussion section like a WhatsApp group
			or forum for your clubs where members can: Start a Conversation: Post a
			question, idea, or announcement. Example: "What should be the theme for
			our next event?" Reply to Posts: Others can comment or reply to the
			question. Example: "I think the theme should be AI and Tech Innovations!"
			Like or Report Posts: If someone likes the idea, they can give it a thumbs

			up 👍. If a post is inappropriate, they can report it to the admin. */}
			<MyEditor/>
		
		</div>
	);
};

export default Discussion;
