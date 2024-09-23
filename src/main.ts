import './style.css'

const setAppContent = (content: string) =>
  document.querySelector<HTMLDivElement>('#app')!.innerHTML = content;

let state: "https" | "http" | "unknown" =
  window.location.protocol === 'https:' ? "https"
    : window.location.protocol === 'http:' ? "http"
      : "unknown";


const params = new URLSearchParams(window.location.search);

if (params.has('protocol')) {
  state = params.get('protocol') === 'https' ? 'https' : 'http';
}

switch (state) {
  case "https":
    console.log('This page is served over HTTPS');
    const inputID = 'input'
    const buttonID = 'button'
    setAppContent(`
      <div>
        <input type="text" placeholder="Enter URL" id=${inputID} />
        <button id=${buttonID}>Open child page</button>
      </div>
    `);
    document.getElementById(buttonID)!.addEventListener('click', () => {
      const url = (document.getElementById(inputID) as HTMLInputElement).value;
      const otherWindow = window.open(url);
      if (!otherWindow) {
        alert('Please allow popups for this website');
        return;
      }
      setInterval(() => otherWindow.postMessage('Hello from HTTPS site', url), 1000);
    });
    break;
  case "http":
    console.log('This page is served over HTTP');
    setAppContent(`<p>Open console to view messages being received.</p>`);
    window.addEventListener('message', (event) => {
      console.log('Received message:', event.data);
    });
    break;
  case "unknown":
    alert('This page is served over an unknown protocol');
    break;
}