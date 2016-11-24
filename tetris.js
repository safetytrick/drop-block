
class Tick {
  constructor(start, duration) {
    this.start = start;
    this.duration = duration;
  }

  get ticks() {
    return this.duration / (1000 / 60);
  }
}

var colors = {
  'red': 'red',
  'magenta': 'magenta',
  'yellow': 'yellow',
  'cyan': 'cyan',
  'blue': 'blue',
  'orange': 'orange',
  'lime': 'lime'
}

var c = ['red', 'magenta', 'yellow', 'cyan', 'blue', 'orange', 'lime'];
var index = 0;

function randomColor() {
  return c[index++ % c.length];
}

var controls = {
  left: {
    keyCodes: [37] // left
  },
  right: {
    keyCodes: [39] // right
  },
  clockwise: {
    keyCodes: [38, 88] // up, x
  },
  counterClockwise: {
    keyCodes: [17, 90] // ctrl, z 
  },
  dropSoft: {
    keyCodes: [40] // down
  },
  dropHard: {
    keyCodes: [32] // space
  },
  shift: {
    keyCodes: [16, 67] // shift, c
  },
  pause: {
    keyCodes: [80] // p
  }
}

class Block {
  constructor(color, positions) {
    this.color = color;
    this.positions = positions;
    this.markerIndex = 0;
    this.grid = positions[this.markerIndex];

    this.x = 3;
    this.y = 0;
  }
  
  dropSoft(board) {
    this.y++;
    
    var occupied = this.occupied(board);
    if (occupied) {
      this.y--;
    }
    return !occupied;
  }

  dropHard(board) {
    while (this.dropSoft(board)) {
      // drop it!
    }
    return true;
  }

  occupied(board) {
    var occupied = false;
     this.eachBlock((x, y) => {
      occupied |= board.occupied(x, y);
    });
    return occupied;
  }

  left(board) {
    this.x--;
    var occupied = this.occupied(board);
    if (occupied) {
      this.x++;
    }
    return !occupied;
  }

  right(board) {
    this.x++;
    var occupied = this.occupied(board);
    if (occupied) {
      this.x--;
    }
    return !occupied;
  }

  clockwise(board) {
    var index = this.markerIndex;
    this.markerIndex = (this.markerIndex + 1) % this.positions.length;
    this.grid = this.positions[this.markerIndex];
    var occupied = this.occupied(board);
    if (occupied) {
      this.markerIndex = index;
      this.grid = this.positions[this.markerIndex];
    }
    return !occupied;
  }

  counterClockwise(board) {
    var index = this.markerIndex;
    this.markerIndex = (this.markerIndex + this.positions.length - 1) % this.positions.length;
    this.grid = this.positions[this.markerIndex];
    var occupied = this.occupied(board);
    if (occupied) {
      this.markerIndex = index;
      this.grid = this.positions[this.markerIndex];
    }
    return !occupied;
  }

  eachBlock(func) {
    for (var i = 0; i < this.grid.length; i++) {
      var row = this.grid[i];
      for (var j = 0; j < row.length; j++) {
        if (row[j]) {
          func.call(this, j + this.x, i + this.y);
        }
      }
    }
  }

  drawTo(board) {
    this.eachBlock((x, y) => {
      board.drawBlock(x, y, this.color);
    });
  }

  applyTo(board) {
    this.eachBlock((x, y) => {
      board.setBlock(x, y, this.color);
    });
  }
}

class Score {
  constructor() {
    this.lineCount = 0;
    this.score = 0;
  }

  get level() {
    return Math.floor(this.lineCount / 10);
  }

  clearedLines(count) {
    if (!count) {
      return;
    }
    this.lineCount += count;
    var lineScore = Score.scoreMap[count];
    this.score += lineScore * (this.level + 1);
    console.log("score", this.score);
    console.log("lineCount", this.lineCount);
  }
}

Score.scoreMap = {
  "1": 40,
  "2": 100,
  "3": 300,
  "4": 1200
}

class Tetronimo {
  constructor(name, color, grid) {
    this.name = name;
    this.color = color;
    this.grid = grid;
  }

  toBlock() {
    return new Block(this.color, this.grid);
  }
}

var tetronimos = [
  new Tetronimo('I', "cyan", [
        [
          [0,0,0,0],
          [1,1,1,1],
          [0,0,0,0],
          [0,0,0,0]
        ],
        [
          [0,0,1,0],
          [0,0,1,0],
          [0,0,1,0],
          [0,0,1,0]
        ],
        [
          [0,0,0,0],
          [0,0,0,0],
          [1,1,1,1],
          [0,0,0,0]
        ],
        [
          [0,1,0,0],
          [0,1,0,0],
          [0,1,0,0],
          [0,1,0,0]
        ]
      ]
    ),
  new Tetronimo('J', "blue", [
        [
          [1, 0, 0],
          [1, 1, 1], 
          [0, 0, 0]
        ],
        [
          [0, 1, 1],
          [0, 1, 0], 
          [0, 1, 0]
        ],
        [
          [0, 0, 0],
          [1, 1, 1], 
          [0, 0, 1]
        ],
        [
          [0, 1, 0],
          [0, 1, 0], 
          [1, 1, 0]
        ]
      ]
    ),
  new Tetronimo('L', "orange", [
        [
          [0, 0, 1],
          [1, 1, 1], 
          [0, 0, 0]
        ],
        [
          [0, 1, 0],
          [0, 1, 0], 
          [0, 1, 1]
        ],
        [
          [0, 0, 0],
          [1, 1, 1], 
          [1, 0, 0]
        ],
        [
          [1, 1, 0],
          [0, 1, 0], 
          [0, 1, 0]
        ]
      ]
    ),
  new Tetronimo('O', "yellow", [
        [
          [0,0,0,0],
          [0,1,1,0],
          [0,1,1,0],
          [0,0,0,0]
        ]  
      ]
    ),
  new Tetronimo('S', "lime", [
        [
          [0,1,1],
          [1,1,0],
          [0,0,0]
        ],
        [
          [0,1,0],
          [0,1,1],
          [0,0,1]
        ],
        [
          [0,0,0],
          [0,1,1],
          [1,1,0]
        ],
        [
          [1,0,0],
          [1,1,0],
          [0,1,0]
        ]
      ]
    ),
  new Tetronimo('T', "purple", [
        [
          [0, 1, 0], 
          [1, 1, 1], 
          [0, 0, 0]
        ],
        [
          [0, 1, 0], 
          [0, 1, 1], 
          [0, 1, 0]
        ],
        [
          [0, 0, 0], 
          [1, 1, 1], 
          [0, 1, 0]
        ],
        [
          [0, 1, 0], 
          [1, 1, 0], 
          [0, 1, 0]
        ]
      ]
    ),
  new Tetronimo('Z', "red", [
        [
          [1,1,0],
          [0,1,1],
          [0,0,0]
        ],
        [
          [0,0,1],
          [0,1,1],
          [0,1,0]
        ],
        [
          [0,0,0],
          [1,1,0],
          [0,1,1]
        ],
        [
          [0,1,0],
          [1,1,0],
          [1,0,0]
        ]
      ]
    )
];

class Tetris {

  constructor(board, blockSize) {
    this.board = board;
    this.context = board.getContext("2d");
    this.blockSize = blockSize;
    this.tickBucket = 5;
    // to hide top two columns
    this.context.translate(0, this.blockSize * -2);
    this.timeTracker = new TimeTracker();
  }

  init() {
    this.score = new Score();
    var gameBoard = [];
    for (var i = 0; i < 22; i++) {
      for (var j = 0; j < 10; j++) {
        var row = new Array(10);
        gameBoard.push(row);
      }
    }

    this.current = null;
    this.gameBoard = gameBoard;
    
    this.running = true;
    this.bindLoop();
  }

  pause() {
    this.running = false;
    this.eachBlock(this.drawBlank);
  }

  unpause() {
    this.running = true;
    this.bindLoop();
  }

  gameLoop(timestamp) {
    if (this.running) {
      var tick = this.timeTracker.tick(timestamp);
      if (tick.ticks > 10) {
        console.log("tick: " + tick.ticks);
        console.log("time: " + tick.duration);
      } 

      this.onTick(tick);
      this.bindLoop();
    }
  }

  bindLoop() {
    window.requestAnimationFrame(this.gameLoop.bind(this));
  }

  get nextDuration() {
    return 20;
  }

  occupied(x, y) {
    if (x < 0 || x >= 10 || y < 0 || y >= 22) {
      return true;
    }
    return !!this.gameBoard[y][x]
  }

  onEvent(event) {
    if (this.running && this.current && this.current[event]) {
      this.current[event].call(this.current, this);
      if (event == "dropHard") {
        this.progress();
        this.draw();
        this.tickBucket = 10;
      }
    } else {
      if (event == "pause") {
        if (this.running) {
          this.pause();
        } else {
          this.unpause();
        }
      }
      console.log(event, this.current);
    }
  }

  gameOver() {
    console.log("gameover", this.score);
  }


  onTick(tick) {
    this.tickBucket -= tick.ticks;
    if (this.tickBucket < 0) {
      this.progress();
      this.tickBucket = this.nextDuration;
    }
    this.draw();
  }

  progress() {
    if (!this.current) {
      var tetronimo = this.randomTetronimo();
      this.current = this.addTetronimo(tetronimo);
      if (!this.current.dropSoft(this)) {
        this.gameOver();
      }
    }
    if (!this.current.dropSoft(this)) {
      this.current.applyTo(this);
      this.current = null;
      this.clearBlocks();
    }
  }

  clearBlocks() {
    var cleared = [];
    for (var i = 0; i < this.gameBoard.length; i++) {
      var every = true;
      var row = this.gameBoard[i];
      for (var j = 0; j < row.length; j++) {
        every &= !!row[j];
        if (!every) {
          break;
        }
      }
      if (every) {
        cleared.push(i);
      }
    }
    this.score.clearedLines(cleared.length);
    for (var i = 0; i < cleared.length; i++) {
      this.gameBoard.splice(cleared[i], 1);
      this.gameBoard.unshift(new Array(10));
    }
  }

  addTetronimo(tetronimo) {
    var block = tetronimo.toBlock();
    return block;
  }

  randomTetronimo() {
    return tetronimos[Math.floor(Math.random() * tetronimos.length)];
  }

  draw() {
    var ctx = this.context;
    ctx.strokeStyle = "#999";
    ctx.lineCap = "round";
    this.eachBlock(this.drawBlock);
    if (this.current) {
      this.current.drawTo(this);
    }
  }

  eachBlock(call) {
    for (var i = 0; i < 22; i++) {
      for (var j = 0; j < 10; j++) {
        var val = this.gameBoard[i][j];
        call.call(this, j, i, val);
      }
    }
  }

  setBlock(x, y, color) {
    this.gameBoard[y][x] = color;
  }

  drawBlank(x, y) {
    this.drawBlock(x, y);
  }

  drawBlock(x, y, color) {
    var ctx = this.context;
    ctx.fillStyle = color || "black";
    ctx.fillRect(x * this.blockSize + 1, y * this.blockSize + 1, this.blockSize - 2, this.blockSize - 2);
    ctx.strokeRect(x * this.blockSize, y * this.blockSize, this.blockSize, this.blockSize);
  }

  color() {
    var ctx = this.board.getContext("2d");
    for (var i = 0; i < 22; i++) {
      for (var j = 0; j < 10; j++) {
        var val = this.gameBoard[i][j];
        ctx.beginPath();
        ctx.fillStyle = randomColor();
        ctx.fillRect(j * this.blockSize + 1, i * this.blockSize + 1, this.blockSize-2, this.blockSize-2);
      }
    }
  }
}



class TimeTracker {
  constructor() {
    this.started = false;
    this.lastFrameTimeMs = 0;
  }

  tick(time) {
    var tick = new Tick(time, time - this.lastFrameTimeMs);
    this.lastFrameTimeMs = time;
    return tick;
  }
}

var BLOCK_SIZE = 25;

function drawTetronimo(canvas, tetronimo) {
  var context = canvas.getContext("2d");
  context.fillStyle = tetronimo.color;
  context.lineCap = "round";
  context.strokeStyle = "#FFF";
  translateToCenter(tetronimo.grid[0], context, canvas.height, canvas.width);
  for (var i = 0; i < tetronimo.grid[0].length; i++) {
    var row = tetronimo.grid[0][i];
    for (var j = 0; j < row.length; j++) {
      if (row[j]) {
        context.fillRect(j * BLOCK_SIZE + 1, i * BLOCK_SIZE + 1, BLOCK_SIZE - 2, BLOCK_SIZE - 2)
        // context.strokeRect(j * BLOCK_SIZE + 1, i * BLOCK_SIZE + 1, BLOCK_SIZE - 2, BLOCK_SIZE - 2)
      }
    }
  }
}

function translateToCenter(grid, context, height, width) {
  var maxWidth = grid[0].length * BLOCK_SIZE;
  var maxHeight = grid[0].length * BLOCK_SIZE;
  context.translate((width - maxWidth) / 2, (height - maxHeight) / 2);
}



