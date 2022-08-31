import { useState } from 'react'
import './App.css'
import { useQuery, useRequest } from './lib';

async function currentTime() {
  const d = new Date();
  const h = d.getHours();
  const m = d.getMinutes();
  const s = d.getSeconds();
  return `${h}:${m}:${s}`;
}

function App() {
  const [count, setCount] = useState(0)
  const [requestDate, requestedDate] = useRequest(() => currentTime());
  const lastDate = requestedDate.last;

  const [queriedDate, refreshDate] = useQuery(() => currentTime(), []);

  return (
    <div className="App">
      <h1>Formulaic API Hooks</h1>

      <h3>useRequest</h3>
      <div className="card">
        <p>Date fetched is {lastDate.kind} {lastDate.kind === "Literal" ? lastDate.getData() : "(n/a)"}</p>
        <button onClick={() => requestDate()}>
          Submit Request
        </button>
      </div>

      <h3>useQuery</h3>
      <div className="card">
        <p>Date queried is {queriedDate.kind} {queriedDate.kind === "Literal" ? queriedDate.getData() : "(n/a)"}</p>
        <button onClick={() => refreshDate()}>
          Refresh
        </button>
      </div>
    </div>
  );
}

export default App
