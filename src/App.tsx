import { useEffect, useState } from 'react'
import './App.css'

const stateGame = {
	1: {
		x: 0,
		y: 0,
	},
	2: {
		x: 0,
		y: 1,
	},
	3: {
		x: 0,
		y: 2,
	},
	4: {
		x: 1,
		y: 0,
	},
	5: {
		x: 1,
		y: 1,
	},
	6: {
		x: 1,
		y: 2,
	},
	7: {
		x: 2,
		y: 0,
	},
	8: {
		x: 2,
		y: 1,
	},
	0: {
		x: 2,
		y: 2,
	}
}

const dataState: number[][] = [
	[1, 2, 3],
	[4, 5, 6],
	[7, 8, 0]
]

function App() {

	const validKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd']


	const handlePressKey = (e: KeyboardEvent) => {
		moveToken(e.key)
	}
	
	const moveToken = (key: string) => {
		console.log(key)
		if (validKeys.includes(key)) {
			const { x, y } = stateGame[0]
			let target = -1;
			if (key === 'ArrowUp' || key === 'w') {
				const newX = x + 1
				if (newX < 3) {
					target = dataState[newX][y]
					const temp = dataState[x][y]
					dataState[x][y] = dataState[newX][y]
					dataState[newX][y] = temp
					stateGame[target].x = stateGame[0].x
					stateGame[0].x = newX
				}
			} else if (key === 'ArrowDown' || key === 's') {
				const newX = x - 1
				if (newX >= 0) {
					target = dataState[newX][y]
					const temp = dataState[x][y]
					dataState[x][y] = dataState[newX][y]
					dataState[newX][y] = temp
					stateGame[target].x = stateGame[0].x
					stateGame[0].x = newX
				}
			} else if (key === 'ArrowLeft' || key === 'a') {
				const newY = y + 1
				if (newY < 3) {
					target = dataState[x][newY]
					const temp = dataState[x][y]
					dataState[x][y] = dataState[x][newY]
					dataState[x][newY] = temp
					stateGame[target].y = stateGame[0].y
					stateGame[0].y = newY
				}
			} else if (key === 'ArrowRight' || key === 'd') {
				const newY = y - 1
				if (newY >= 0){
					target = dataState[x][newY]
					const temp = dataState[x][y]
					dataState[x][y] = dataState[x][newY]
					dataState[x][newY] = temp
					stateGame[target].y = stateGame[0].y
					stateGame[0].y = newY
				}
			}
			setDataTable(dataState.flat())
		}
	}
	
	function getRandomInt(max:number) {
		return Math.floor(Math.random() * max);
	}

	const handleShuffle = async() => {
		for (let index = 0; index < 10; index++) {
			moveToken(validKeys[getRandomInt(4)])
		}
	}

	const [dataTable, setDataTable] = useState(dataState.flat())

	useEffect(() => {
		document.addEventListener('keydown', handlePressKey)
	}, [])

	return (
		<div
			className="max-w-xl m-auto grid grid-cols-1 place-content-center w-full h-screen p-4 text-center"
			style={{ backgroundColor: '#FFB703' }}>
			<h1 className='text-6xl text-white mb-5'>8-Puzzle Game</h1>
			<div className='grid grid-cols-3 gap-4 p-5 rounded-lg justify-items-stretch w-96 h-96 mx-auto' style={{ backgroundColor: '#023047' }}>
				{
					dataTable.map((item) => {
						return (
							item !== 0 ?
								<div
									key={item}
									className='section text-5xl text-white rounded-lg align-middle'>
									{item}
								</div> :
								<div key={item}></div>
						)
					})
				}
			</div>
			<button
				onClick={handleShuffle} 
				className="text-white rounded-lg section mt-5 w-72 mx-auto text-2xl h-12">Shuffle</button>
		</div>
	)
}

export default App
