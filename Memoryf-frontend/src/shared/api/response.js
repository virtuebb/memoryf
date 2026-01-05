/**
 * ApiResponse helpers
 *
 * Backend is expected to return an envelope:
 * { success: boolean, message?: string, data?: any, ... }
 *
 * Some endpoints may still return raw payloads. These helpers allow callers to
 * safely consume both shapes during the refactor.
 */

export const isApiResponse = (value) => {
	return Boolean(value) && typeof value === 'object' && 'success' in value;
};

export const getApiResponseData = (value, fallback = null) => {
	if (isApiResponse(value)) {
		return value.data ?? fallback;
	}
	return value ?? fallback;
};

/**
 * Ensures the return value conforms to ApiResponse shape.
 * If the backend returns a raw payload, we treat it as a successful response.
 */
export const toApiResponse = (value, { success = true, message } = {}) => {
	if (isApiResponse(value)) return value;

	const response = { success, data: value };
	if (message !== undefined) response.message = message;
	return response;
};

/**
 * Some UIs expect ApiResponse.data fields to also exist at the top-level
 * (e.g. response.point, response.currentPoint). This helper merges object
 * data into the envelope while preserving the original shape.
 */
export const mergeApiResponseData = (value) => {
	if (!isApiResponse(value)) return value;

	const data = value.data;
	if (!data || typeof data !== 'object' || Array.isArray(data)) return value;

	return { ...value, ...data };
};
