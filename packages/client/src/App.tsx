import { useEffect, useState } from "react"

function App() {
	const [message, setMessage] = useState("")

	useEffect(() => {
		fetch("/api/hello")
			.then((res) => res.json())
			.then((data) => setMessage(data.message))
	}, [])

	return (
		<div className="font-bold p-4 text-3xl text-center">
			<h1>{message}</h1>
		</div>
	)
}

export default App
