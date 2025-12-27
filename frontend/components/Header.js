export function Header({ connected, onConnect }) {
  return `<header class="header">
    <h1>⚓ Maritime Trading</h1>
    <button onclick="${onConnect}">${connected ? "Connected" : "Connect Wallet"}</button>
  </header>`;
