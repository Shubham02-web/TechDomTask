export const formatDate = (isoDate) => {
  if (!isoDate) return null; // Handle cases where isoDate is null or undefined
  const date = new Date(isoDate);
  const day = date.getDate().toString().padStart(2, "0"); // Ensure two-digit day
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Ensure two-digit month (getMonth() is zero-based)
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};
