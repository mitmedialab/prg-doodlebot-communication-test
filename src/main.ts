import './style.css'

const setAppContent = (content: string) =>
  document.querySelector<HTMLDivElement>('#app')!.innerHTML = content;

const makeListContainer = () => `<div><ul id="list"></ul></div>`;
const prependListElement = (content: string = "") => {
  const list = document.getElementById('list')!;
  list.innerHTML = `<li>${new Date().toLocaleTimeString()}: ${content}</li>` + list.innerHTML;
}

let state: "https" | "http" | "unknown" =
  window.location.protocol === 'https:' ? "https"
    : window.location.protocol === 'http:' ? "http"
      : "unknown";

if (window.isSecureContext && state === 'http')
  state = 'https'; // for localhost

const params = new URLSearchParams(window.location.search);
if (params.has('protocol')) {
  state = params.get('protocol') === 'https' ? 'https' : 'http';
}


switch (state) {
  case "https":
    const inputID = 'input'
    const buttonID = 'button'
    setAppContent(`
      <div>
        <input type="text" placeholder="Enter URL" id=${inputID} />
        <button id=${buttonID}>Open child page</button>
        ${makeListContainer()}
      </div>
    `);
    let count = 0;
    window.addEventListener('message', ({ data }) => prependListElement(data));
    document.getElementById(buttonID)!.addEventListener('click', () => {
      const url = (document.getElementById(inputID) as HTMLInputElement).value;
      const popup = window.open(url);
      if (!popup)
        return alert('Please allow popups for this website');

      setInterval(() => popup.postMessage(`HTTPS msg ${count++}`, url), 100);
    });
    break;
  case "http":
    setAppContent(`<div>Messages: ${makeListContainer()}</div>`);
    window.addEventListener('message', (event) => {
      prependListElement(event.data);
      event.source!.postMessage(`HTTP msg ${event.data}`, { targetOrigin: event.origin });
    });
    break;
  case "unknown":
    alert('This page is served over an unknown protocol');
    break;
}