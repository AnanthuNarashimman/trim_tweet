import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';

import { Analytics } from "@vercel/analytics/react"

import Page from './Pages/Page';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Page />
      <Analytics />
    </>
  )
}

export default App
