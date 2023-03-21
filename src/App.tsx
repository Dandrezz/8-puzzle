import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import ConfettiExplosion from 'react-confetti-explosion';
import './App.css'
import Swal from 'sweetalert2';

interface IPoint {
	x: number,
	y: number,
	img?: string
}

interface IStateGame {
	[key: number]: IPoint
}

const stateGame: IStateGame = {
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

const stateSolve = [1, 2, 3, 4, 5, 6, 7, 8, 0]

function App() {

	const [isExploding, setIsExploding] = useState(false);

	const validKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd']

	const validWin = () => {
		if (dataState.flat().toString() === stateSolve.toString())
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
				if (newY >= 0) {
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

	function getRandomInt(max: number) {
		return Math.floor(Math.random() * max);
	}

	const handleShuffle = async () => {
		for (let index = 0; index < 24; index++) {
			moveToken(validKeys[getRandomInt(4)])
		}
	}

	const isAdjacentPoint = (x1: number, y1: number, x2: number, y2: number): boolean => {
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

	const handleUploadImage = async () => {

		const { value: file } = await Swal.fire({
			title: 'Select image',
			input: 'file',
			inputAttributes: {
				'accept': 'image/*',
				'aria-label': 'Upload your profile picture'
			}
		})

		const data = new FormData()
		data.append('file', file)
		data.append('upload_preset', 'aqjx77cr')

		fetch("https://api.cloudinary.com/v1_1/dqvtr77op/image/upload", {
			method: "post",
			body: data
		}).then(res => res.json())
			.then(data => {
				const { width, height } = data
				const nameFile = data.url.split('/').pop()
				for (let index = 1; index < 4; index++) {
					stateGame[index].img = `http://res.cloudinary.com/dqvtr77op/image/upload/x_${~~(width*(1/3)*(index-1))},y_${0},w_${~~(width/3)},h_${~~(height/3)},c_crop/${nameFile}`
					stateGame[index+3].img = `http://res.cloudinary.com/dqvtr77op/image/upload/x_${~~(width*(1/3)*(index-1))},y_${~~(height*(1/3))},w_${~~(width/3)},h_${~~(height/3)},c_crop/${nameFile}`
					if(index!=3)stateGame[index+6].img = `http://res.cloudinary.com/dqvtr77op/image/upload/x_${~~(width*(1/3)*(index-1))},y_${~~(height*(2/3))},w_${~~(width/3)},h_${~~(height/3)},c_crop/${nameFile}`
				}
			})
			.catch(err => {
				console.log(err)
			})
	}

	return (
		<div
			className="max-w-xl m-auto grid grid-cols-1 2xl:place-content-center w-screen h-screen p-4 text-center">
			<h1 className='2xl:text-6xl text-2xl font-bold text-white mb-5'>8 Puzzle Game</h1>
			{isExploding && <ConfettiExplosion particleCount={15} />}
			<motion.div className='grid grid-cols-3 gap-4 p-5 rounded-lg justify-items-stretch 2xl:w-96 2xl:h-96 xl:w-80 xl:h-80 w-72 h-72 mx-auto'>
				{
					dataTable.map((item) => {
						return (
							item !== 0 ?
								<motion.div
									layout
									key={item}
									onClick={handleClick}
									className='section text-5xl text-white rounded-lg'>
									{stateGame[item].img ? <img src={stateGame[item].img} alt="imagen" /> : item}
								</motion.div> :
								<motion.div layout key={item}></motion.div>
						)
					})
				}
			</motion.div>
			<button
				onClick={handleShuffle}
				className="text-white rounded-lg section mt-5 2xl:w-72 w-52 mx-auto 2xl:text-2xl text-xl 2xl:h-12 h-9">Shuffle</button>
			<button
				onClick={handleUploadImage}
				className="text-white rounded-lg section mt-5 2xl:w-72 w-52 mx-auto 2xl:text-2xl text-xl 2xl:h-12 h-9">Upload Image</button>

			<footer className="flex justify-center items-center gap-x-2 font-semibold pt-10 text-white">
				Hecho con <span className="text-red-500">❤</span> por Diego
			</footer>
		</div>
	)
}

export default App
