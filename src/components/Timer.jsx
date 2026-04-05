// Timer component — displays elapsed seconds as MM:SS
export default function Timer({ seconds }) {
  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');
  return <span>{mm}:{ss}</span>;
}
