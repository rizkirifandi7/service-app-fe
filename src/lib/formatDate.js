export const formatDate = (dateString) => {
	if (!dateString) return "-";
	return new Date(dateString).toLocaleDateString("id-ID", {
		weekday: "long", // Adds day name (Senin, Selasa, etc.)
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
	});
};
