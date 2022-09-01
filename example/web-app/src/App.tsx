import { useQuery, useRequest } from "@formulaic/api-hooks";
import { useState } from 'react'
import logo from './logo.svg'
import './App.css'

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
        <p>
          <button type="button" onClick={() => requestDate()}>
            Submit Request
          </button>
        </p>
      </div>

      <h3>useQuery</h3>
      <div className="card">
        <p>
          Date queried is {queriedDate.kind} {queriedDate.kind === "Literal" ? queriedDate.getData() : "(n/a)"}
        </p>
        <p>
          <button type="button" onClick={() => refreshDate()}>
            Refresh
          </button>
        </p>
      </div>
    </div>
  )
}

export default App
