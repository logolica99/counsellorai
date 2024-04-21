export function formatTime(timestamp) {
  const date = new Date(timestamp);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const year = date.getFullYear().toString();
  const month = date.toLocaleString("en-US", { month: "short" });

  return `${hours}:${minutes}, ${day} ${month}`;
}
