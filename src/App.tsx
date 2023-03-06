import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import ConfettiExplosion from 'react-confetti-explosion';
import './App.css'

interface IPoint {
	x: number,
	y: number,
}

interface IStateGame {
	[key: number]: IPoint
}

const stateGame:IStateGame = {
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

const stateSolve = [1,2,3,4,5,6,7,8,0]

function App() {

	const [isExploding, setIsExploding] = useState(false);

	const validKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd']

	const validWin = () => {
		if(dataState.flat().toString() === stateSolve.toString())
			setIsExploding(true)
	}

	const handlePressKey = (e: KeyboardEvent) => {
		if (!validKeys.includes(e.key)) return
		moveToken(e.key)
		validWin()
	}
	
	const moveToken = (key: string) => {
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
		for (let index = 0; index < 24; index++) {
			moveToken(validKeys[getRandomInt(4)])
		}
	}

	const isAdjacentPoint = (x1: number, y1: number, x2: number, y2: number):boolean => {
		return (Math.abs(y1 - y2) + Math.abs(x1 - x2) === 1)
	}

	const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		setIsExploding(false)
		const target = parseInt(e.currentTarget.innerText)
		const { x, y } = stateGame[target]
		const { x: x0, y: y0 } = stateGame[0]
		if (isAdjacentPoint(x, y, x0, y0)) {
			const temp = dataState[x][y]
			dataState[x][y] = dataState[x0][y0]
			dataState[x0][y0] = temp
			stateGame[target].x = x0
			stateGame[target].y = y0
			stateGame[0].x = x
			stateGame[0].y = y
			setDataTable(dataState.flat())
		}
		validWin()
	}

	const [dataTable, setDataTable] = useState(dataState.flat())

	useEffect(() => {
		document.addEventListener('keydown', handlePressKey)
	}, [])

	return (
		<div
			className="max-w-xl m-auto grid grid-cols-1 place-content-center w-full h-screen p-4 text-center">
			<h1 className='text-6xl text-white mb-5'>8 Puzzle Game</h1>
			{isExploding && <ConfettiExplosion particleCount={15} />}
			<motion.div  className='grid grid-cols-3 gap-4 p-5 rounded-lg justify-items-stretch sm:w-96 sm:h-96 w-72 h-72 mx-auto'>
				{
					dataTable.map((item) => {
						return (
							item !== 0 ?
								<motion.div
									layout
									key={item}
									onClick={handleClick}
									className='section text-5xl text-white rounded-lg align-middle'>
									{item}
								</motion.div> :
								<motion.div layout key={item}></motion.div>
						)
					})
				}
			</motion.div>
			<button
				onClick={handleShuffle} 
				className="text-white rounded-lg section mt-5 w-72 mx-auto text-2xl h-12">Shuffle</button>
		</div>
	)
}

export default App
