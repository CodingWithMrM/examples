// On screen: the bug. Server and browser render different text.
export default function Clock() {
  return <h1>{new Date().toLocaleTimeString()}</h1>;
}
