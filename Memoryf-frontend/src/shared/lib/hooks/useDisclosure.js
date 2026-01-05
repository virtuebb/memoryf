import { useCallback, useState } from "react";

export function useDisclosure(initialOpen = false) {
	const [isOpen, setIsOpen] = useState(Boolean(initialOpen));

	const open = useCallback(() => setIsOpen(true), []);
	const close = useCallback(() => setIsOpen(false), []);
	const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

	return {
		isOpen,
		setIsOpen,
		open,
		close,
		toggle,
	};
}
