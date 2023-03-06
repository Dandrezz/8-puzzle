import { useEffect } from 'react'
import './App.css'

function App() {

	const validKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight','w','a','s','d']

	const handlePressKey = (e: KeyboardEvent) => {
		if (validKeys.includes(e.key)){
			console.table(e.key);
		}
	}

	useEffect(() => {
		document.addEventListener('keydown', handlePressKey)
	}, [])
	

	return (
		<div 
			className="max-w-xl m-auto grid grid-cols-1 place-content-center w-full h-screen p-4 text-center" 
			style={{backgroundColor:'#FFB703'}}
			onKeyDown={(e)=>console.log(e.target)}>
			<h1 className='text-6xl text-white mb-5'>8 puzzle</h1>
			<div className='grid grid-cols-3 gap-4 p-5 rounded-lg justify-items-stretch w-96 h-96 mx-auto' style={{backgroundColor:'#023047'}}>
				<div className='section'>1</div>
				<div className='section'>2</div>
				<div className='section'>3</div>
				<div className='section'>4</div>
				<div className='section'>5</div>
				<div className='section'>6</div>
				<div className='section'>7</div>
				<div></div>
				<div className='section'>8</div>
			</div>
		</div>
	)
}

export default App
