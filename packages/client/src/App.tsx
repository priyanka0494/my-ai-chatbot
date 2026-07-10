import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
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
			<Button>Click me</Button>
		</div>
	)
}

export default App
