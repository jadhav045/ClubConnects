import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaArrowLeft } from "react-icons/fa";

const DiscussionDetail = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const { discusss } = useSelector((state) => state.discuss);
	const discussion = discusss.find((d) => d._id === id);

	if (!discussion) {
		return <div>Discussion not found</div>;
	}

	return (
		<div className="max-w-4xl mx-auto p-4">
			<button
				onClick={() => navigate(-1)}
				className="mb-4 flex items-center gap-2 text-gray-600 hover:text-gray-800"
			>
				<FaArrowLeft /> Back to discussions
			</button>

			<article className="bg-white rounded-xl shadow-lg p-6">
				{/* ...detailed discussion view... */}
			</article>
		</div>
	);
};
