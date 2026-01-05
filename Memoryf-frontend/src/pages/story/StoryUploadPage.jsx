import { useNavigate } from "react-router-dom";
import { StoryUploadModal } from "../../features/story";

const StoryUploadPage = ({ isOpen, onClose, onSuccess }) => {
	const navigate = useNavigate();

	const isRouteMode = typeof isOpen === "undefined";
	const effectiveIsOpen = isRouteMode ? true : isOpen;
	const effectiveOnClose = onClose ?? (() => navigate(-1));

	return (
		<StoryUploadModal
			isOpen={effectiveIsOpen}
			onClose={effectiveOnClose}
			onSuccess={onSuccess}
		/>
	);
};

export default StoryUploadPage;
