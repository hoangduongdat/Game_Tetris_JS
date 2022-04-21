

let field = document.getElementsByClassName('block');


newGrid = (width, height) => {
    let grid = new Array(height);
    for (let i = 0; i < height; i++){
        grid[i] = new Array(width);
    }

    let index = 0;
    for (let i = 0; i < height; i++) {
        for (let j = 0;j < width; j++) {
            grid[i][j] = {
                index: index++,
                value: 0
            }
        }
    }

    return {
        board : grid,
        width : width,
        height : height
    }
}

// console.log(newGrid(GRID_WIDTH, GRID_HEIGHT));

// reset giá trị grid và color 
resetGrid = (grid) =>{
    for (let i =0; i < grid.height; i++) {
        for (let j =0; j < grid.width; j++) {
            grid.board[i][j].value =0;
        }
    }

    Array.from(field).forEach(field =>{
        field.style.background = TRANSPARENT
    })
}


newTetromino = (blocks, colors, start_x, start_y) =>{
    let index = Math.floor(Math.random() * blocks.length)

    return {
        block: JSON.parse(JSON.stringify(blocks[index])),
        color: colors[index],
        x: start_x,
        y: start_y
    }
}

// let tetromino = newTetromino(BLOCKS,COLORS,START_X,START_Y)
// console.log(tetromino)

// draw Tetromino
drawTetromino = (tetromino,grid) =>{
    
    tetromino.block.forEach((row, i) =>{
        row.forEach((value, j) =>{
            let x= tetromino.x +i
            let y= tetromino.y +j

            if(value > 0) {
                field[grid.board[x][y].index].style.background=tetromino.color
            }
        })
    })
}

//clear Tetromino
clearTetromino = (tetromino,grid) =>{
    tetromino.block.forEach((row, i) =>{
        row.forEach((value, j) =>{
            let x= tetromino.x +i
            let y= tetromino.y +j

            if(value > 0) {
                field[grid.board[x][y].index].style.background=TRANSPARENT
            }
        })
    })
}


//check point is in grid
 isInGrid = (x, y, grid) => {
     return x < grid.height && x >=0 && y < grid.width && y >=0 
 }

 // check point is field or blank

isField = (x, y, grid) => {
    if(!isInGrid(x, y, grid)){
        return false
    }else {
        return grid.board[x][y].value !== 0 
    }
}

// check tetromino is movable?
movable = (tetromino,grid, direction) => {
    let newX = tetromino.x
    let newY = tetromino.y


    switch(direction) {
        case DIRECTION.DOWN:
            newX = tetromino.x + 1
            break
        case DIRECTION.LEFT:
            newY = tetromino.y - 1
            break
        case DIRECTION.RIGHT:
            newY = tetromino.y + 1
            break
    }
    return tetromino.block.every((row,i) =>{
        return row.every((value, j) => {
            let x = newX + i
            let y = newY + j
            
            return value === 0 || (isInGrid(x,y,grid) && !isField(x,y,grid))
        })
    })
}

//move down
moveDown = (tetromino,grid) => {
    if(!movable(tetromino, grid, DIRECTION.DOWN)) return
    clearTetromino(tetromino,grid)
    tetromino.x++
    drawTetromino(tetromino,grid)
}

//move left
moveLeft = (tetromino,grid) => {
    if(!movable(tetromino, grid, DIRECTION.LEFT)) return
    clearTetromino(tetromino,grid)
    tetromino.y--
    drawTetromino(tetromino,grid)
}

//move right
moveRight = (tetromino,grid) => {
    if(!movable(tetromino, grid, DIRECTION.RIGHT)) return
    clearTetromino(tetromino,grid)
    tetromino.y++
    drawTetromino(tetromino,grid)
}








// check rotatable

rotatable = (tetromino, grid) => {
    let cloneBlock = JSON.parse(JSON.stringify(tetromino.block))
   
    //rotate block
    for (let y = 0; y < cloneBlock.length; y++) {
        for(let x = 0; x < y; ++x) {
            [cloneBlock[x][y], cloneBlock[y][x]] = [cloneBlock[y][x], cloneBlock[x][y]]
        }
    }
    cloneBlock.forEach(row => row.reverse());
    // check block is visible
    return cloneBlock.every((row,i) =>{
        return row.every((value, j) => {
            let x = tetromino.x + i
            let y = tetromino.y + j
     
            return value === 0 || (isInGrid(x,y,grid) && !isField(x,y,grid))
        })
    })

}

// rotate tetromino
rotate =(tetromino,grid) =>{
    if(!rotatable(tetromino,grid)) return
    clearTetromino(tetromino,grid)
    for (let y = 0; y < tetromino.block.length; y++) {
        for(let x = 0; x < y; ++x) {
            [tetromino.block[x][y], tetromino.block[y][x]] = [tetromino.block[y][x], tetromino.block[x][y]]
        }
    }
    tetromino.block.forEach(row => row.reverse());
    drawTetromino(tetromino,grid)
}


// hard drop tetromino

hardDrop = (tetromino,grid) => {
    clearTetromino(tetromino,grid)
    while (movable(tetromino, grid, DIRECTION.DOWN)) {
        tetromino.x++
    }

    drawTetromino(tetromino,grid)
}

//update the grid when tetromino downed

updateGrid = (tetromino,grid) => {
    tetromino.block.forEach((row, i) => {
        row.forEach((value, j) => {
            let x =tetromino.x +i
            let y= tetromino.y +j

            if( value > 0 && isInGrid(x,y,grid))  {
                grid.board[x][y].value = value
            }
        })
    })
}

//check full row
checkFilledRow = (row) => {
    return row.every(v => {
        return v.value !==0
    })
}

// delete  fielld full row
deleteRow = (row_index, grid) => {
    for (let row = row_index; row >0 ; row--) {
        for (let col = 0; col < 10; col++) {
            grid.board[row][col].value = grid.board[row - 1][col].value
            let value = grid.board[row][col].value

            //update fielld 
            field[grid.board[row][col].index].style.background = value === 0? TRANSPARENT : COLORS[value-1]
        }
    }
}


//check grid for delete

checkGrid = (grid) => {
    grid.board.forEach((row , i) => {
        if(checkFilledRow(row)) {
            deleteRow(i,grid)
            game.score+= 100
            score_span.innerHTML = game.score
        }
    })
}

// game object

let game = {
    score : START_SCORE,
    speed: START_SPEED,
    level: 1,
    state: GAME_STATE.END,
    interval: null
}








// let tetromino = newTetromino(BLOCKS,COLORS,START_X,START_Y)

let tetromino =null
let score_span =document.querySelector('#score')
let level_span =document.querySelector('#level')

score_span.innerHTML = game.score
level_span.innerHTML = game.level

gameLoop = () =>{
    if(game.state == GAME_STATE.PLAY) {
        if(movable(tetromino,grid, DIRECTION.DOWN)) {
            moveDown(tetromino, grid) 
        } else {
            updateGrid(tetromino,grid)
            checkGrid(grid)
            tetromino = newTetromino(BLOCKS,COLORS,START_X,START_Y)
            drawTetromino(tetromino,grid)

            if(movable(tetromino,grid, DIRECTION.DOWN)) {
                drawTetromino(tetromino,grid)
            } else {
                game.state =GAME_STATE.END
                let body = document.querySelector('body') 
                body.classList.add('end')
                body.classList.remove('play')

                let result_lv = document.querySelector('#result-level')
                let result_score = document.querySelector('#result-score')

                result_lv.innerHTML =game.level
                result_score.innerHTML =game.score
            }

        }
    }
}


gameStart = () =>{
    game.state =GAME_STATE.PLAY
    tetromino = newTetromino(BLOCKS,COLORS,START_X,START_Y)
    drawTetromino(tetromino,grid)

    game.interval = setInterval(gameLoop, game.speed)
}


gamePause = () =>{
    game.state =GAME_STATE.PAUSE
}
gameResume = () =>{
    game.state =GAME_STATE.PLAY
}
gameReset = () =>{
    clearInterval(game.interval)
    resetGrid(grid)
    game.score=START_SCORE
    game.speed=START_SPEED
    game.state =GAME_STATE.END
    game.level=1
    game.interval =null
    tetromino= null
    score_span.innerHTML = game.score
    level_span.innerHTML = game.level

}



let grid = newGrid(GRID_WIDTH, GRID_HEIGHT)


// drawTetromino(tetromino,grid)

// setInterval(()=>{
//     if(movable(tetromino,grid, DIRECTION.DOWN)) {
//         moveDown(tetromino, grid) 
//     } else {
//         updateGrid(tetromino,grid)
//         checkGrid(grid)
//         tetromino = newTetromino(BLOCKS,COLORS,START_X,START_Y)
//         drawTetromino(tetromino,grid)
//     }
 
// },500)



// add keyboard event

document.addEventListener("keydown",e =>{
    e.preventDefault()
    let body = document.querySelector('body')
    let key=e.which
    switch(key) {
        
        case KEY.DOWN:
            moveDown(tetromino, grid)
            break
        case KEY.LEFT:
            moveLeft(tetromino, grid)
            break
        case KEY.RIGHT:
            moveRight(tetromino,grid)
            break
        case KEY.UP:
            rotate(tetromino,grid)
            break
        case KEY.SPACE:
            hardDrop(tetromino,grid)
            break
        case KEY.P:
            if(game.state !== GAME_STATE.PAUSE){
                gamePause()
                let btn_play= document.querySelector('#btn-play')
                btn_play.innerHTML='Resume'
                body.classList.add('pause')
                body.classList.remove('play')
            }else{
                body.classList.add('play')
                body.classList.remove('pause')
                gameResume()
            }
            break
        
    }
})




let btns = document.querySelectorAll('[id*="btn-"]')
let body = document.querySelector('body')

btns.forEach(e => {
    let btn_id= e.getAttribute('id')
    e.addEventListener('click',() => {
        switch(btn_id) {
            case 'btn-drop':
                hardDrop(tetromino,grid)
                break
            case 'btn-up':
                rotate(tetromino,grid)
                break
            case 'btn-down':
                moveDown(tetromino, grid)
                break
            case 'btn-left':
                moveLeft(tetromino, grid)
                break
            case 'btn-right':
                moveRight(tetromino,grid)
                break
            case 'btn-play': 
                body.classList.add('play')
                if(game.state===GAME_STATE.PAUSE){
                    body.classList.remove('pause')
                    gameResume()
                    return
                }
                gameStart()
                break
            case 'btn-theme': 
                body.classList.toggle('dark')
                break
            case 'btn-help': 
                let how_to= document.querySelector('.how-to')
                how_to.classList.toggle('active')
                break
            case 'btn-pause': 
                gamePause()
                let btn_play= document.querySelector('#btn-play')
                btn_play.innerHTML='Resume'
                body.classList.add('pause')
                body.classList.remove('play')
                break
            case 'btn-new-game':
                gameReset()

                body.classList.add('play')
                body.classList.remove('pause')
                body.classList.remove('end')
                gameStart()

                break

        }
    })
})