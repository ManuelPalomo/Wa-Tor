"use strict";

const WIDTH = 640;
const HEIGHT = 480;
const CELL_SIZE = 8;

const STARTING_SHARKS = 100;
const STARTING_FISHES = 500;

const SHARK_STARTING_ENERGY = 5;
const ENERGY_PER_FISH = 3;
const ENERGY_PER_MOVEMENT = 1;

const CHRONON_FISH_REPRODUCTIVE_CYCLE = 3;
const CHRONON_SHARK_REPRODUCTIVE_CYCLE = 6;

const FISH_REPRODUCTION_CHANCE = 0.3;
const SHARK_REPRODUCTION_CHANCE = 0.3;
const CELL = 0;
const WATER = 1;
const SHARK = 2;
const FISH = 3;

const NORTH = 0;
const EAST = 1;
const SOUTH = 2;
const WEST = 3;
const NO_DIRECTION = 4;

const COLOR_BLUE = "BLUE";
const COLOR_RED = "RED"
const COLOR_GREEN = "YELLOW";

window.addEventListener('DOMContentLoaded', () => {
    start();
})


class Wator {
    constructor(canvas) {
        this.canvas = canvas;
        this.canvas.height = HEIGHT;
        this.canvas.width = WIDTH;
        this.context = canvas.getContext("2d");
        this.grid = new Grid();
    }
    _draw() {
        this._clear();
        var context = this.context;
        this.grid.matrix.map(function (row) {
            row.map(function (cell) {
                cell.paint(context);
            })
        })
    }

    _clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    _update() {
        var grid = this.grid;
        this.grid.matrix.map(function (row) {
            row.map(function (cell) {
                cell.update(grid);
            })
        })
    }

    initializeLoop() {
        var self = this;
        setInterval(function () {
            self._update();
            self._draw();
        }, 500);
    }
}

class Grid {
    constructor() {
        let widthCellNumber = Math.floor(WIDTH / CELL_SIZE);
        let heightCellNumber = Math.floor(HEIGHT / CELL_SIZE);
        this.matrix = [];

        this.fishCount = 0;
        this.sharkCount = 0;
        this.waterCount = 0;

        for (var i = 0; i < heightCellNumber; i++) {
            this.matrix[i] = new Array(widthCellNumber);
            for (var j = 0; j < this.matrix[i].length; j++) {
                var cell = null;
                var random = Math.floor((Math.random() * 3) + 1);
                if (random == 1) {
                    cell = new Water(j, i);
                    this.waterCount++;
                } else if (random == 2) {
                    if (this.fishCount < STARTING_FISHES) {
                        cell = new Fish(j, i);
                        this.fishCount++;
                    }else{
                        cell = new Water(j, i);
                        this.waterCount++; 
                    }
                } else {
                    if (this.sharkCount < STARTING_SHARKS) {
                        cell = new Shark(j, i);
                        this.sharkCount++;
                    }else{
                        cell = new Water(j, i);
                        this.waterCount++;  
                    }
                }
                this.matrix[i][j] = cell;
            }
        }
    }

    getCellContent(x, y) {
        return this.matrix[y][x];
    }

    changePosition(cell, x, y) {
        this.matrix[cell.y][cell.x] = new Water(cell.x, cell.y);
        this.matrix[y][x] = cell;
        cell.changePosition(x, y);
    }

    deleteCell(x, y) {
        this.matrix[y][x] = new Water(x, y);
    }

    placeCell(cell, x, y) {
        this.matrix[y][x] = cell;
    }
}

class Cell {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.type = CELL;

    }

    paint(context) {
        context.fillStyle = this.color;
        context.fillRect(this.x * CELL_SIZE, this.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    }

    update(grid) { }

    changePosition(newX, newY) {
        this.x = newX;
        this.y = newY;
    }

    _move(grid) {
        var direction = this._getWhatDirectionToMove(grid);
        switch (direction) {
            case NORTH:
                this._moveNorth(grid);
                break;
            case EAST:
                this._moveEast(grid);
                break;
            case SOUTH:
                this._moveSouth(grid);
                break;
            case WEST:
                this._moveWest(grid);
                break;
        }
    }

    _getWhatDirectionToMove(grid) { }

    _moveNorth(grid) {
        (this.y - 1 < 0) ? grid.changePosition(this, this.x, grid.matrix.length - 1) : grid.changePosition(this, this.x, this.y - 1);
    }
    _moveSouth(grid) {
        (this.y + 1 == grid.matrix.length) ? grid.changePosition(this, this.x, 0) : grid.changePosition(this, this.x, this.y + 1);
    }
    _moveEast(grid) {
        (this.x + 1 == grid.matrix[0].length) ? grid.changePosition(this, this, 0, this.y) : grid.changePosition(this, this.x + 1, this.y);
    }
    _moveWest(grid) {
        (this.x - 1 < 0) ? grid.changePosition(this, grid.matrix[0].length - 1, this.y) : grid.changePosition(this, this.x + -1, this.y);
    }

}

class Water extends Cell {
    constructor(x, y) {
        super(x, y, COLOR_BLUE);
        this.type = WATER;
    }

    update(grid) { }
}

class Fish extends Cell {
    constructor(x, y) {
        super(x, y, COLOR_GREEN);
        this.type = FISH;
        this.chrononsSurvived = 0;
    }
    update(grid) {
        var spawnX = this.x;
        var spawnY = this.y;
        this._move(grid);
        this._reproduce(spawnX, spawnY, grid);
        this.chrononsSurvived++;

    }

    _getWhatDirectionToMove(grid) {
        var availableDirections = this._checkAvailableDirections(grid);
        if (availableDirections.length > 0) {
            var randomIndex = Math.floor(Math.random() * availableDirections.length);
            return availableDirections[randomIndex];
        }
        return NO_DIRECTION;
    }
    _checkAvailableDirections(grid) {
        var availableDirections = [];
        if (this._canMoveNorth(grid)) availableDirections.push(NORTH);
        if (this._canMoveEast(grid)) availableDirections.push(EAST);
        if (this._canMoveSouth(grid)) availableDirections.push(SOUTH);
        if (this._canMoveWest(grid)) availableDirections.push(WEST);
        return availableDirections;
    }

    _canMoveNorth(grid) {
        var northCell = null;
        (this.y - 1 < 0) ? northCell = grid.getCellContent(this.x, grid.matrix.length - 1) : northCell = grid.getCellContent(this.x, this.y - 1);
        return northCell.type == WATER;
    }

    _canMoveSouth(grid) {
        var southCell = null;
        (this.y + 1 == grid.matrix.length) ? southCell = grid.getCellContent(this.x, 0) : southCell = grid.getCellContent(this.x, this.y + 1);
        return southCell.type == WATER;
    }

    _canMoveEast(grid) {
        var eastCell = null;
        (this.x + 1 == grid.matrix[0].length) ? eastCell = grid.getCellContent(0, this.y) : eastCell = grid.getCellContent(this.x + 1, this.y);
        return eastCell.type == WATER;
    }

    _canMoveWest(grid) {
        var westCell = null;
        (this.x - 1 < 0) ? westCell = grid.getCellContent(grid.matrix[0].length - 1, this.y) : westCell = grid.getCellContent(this.x - 1, this.y);
        return westCell.type == WATER;
    }

    _reproduce(spawnX, spawnY, grid) {
        if (this.chrononsSurvived == CHRONON_FISH_REPRODUCTIVE_CYCLE) {
            this.chrononsSurvived = 0;
            if (Math.random() < FISH_REPRODUCTION_CHANCE) {
                var newFish = new Fish(spawnX, spawnY);
                grid.placeCell(newFish, spawnX, spawnY);
            }
        }
    }
}

class Shark extends Cell {
    constructor(x, y) {
        super(x, y, COLOR_RED);
        this.type = SHARK;
        this.chrononsSurvived = 0;
        this.energy = SHARK_STARTING_ENERGY;
    }

    update(grid) {
        var spawnX = this.x;
        var spawnY = this.y;

        this._move(grid);
        this._consumeEnergy(grid);
        this._reproduce(spawnX, spawnY, grid);
        this.chrononsSurvived++;
    }

    _reproduce(spawnX, spawnY, grid) {
        if (this.chrononsSurvived == CHRONON_SHARK_REPRODUCTIVE_CYCLE) {
            this.chrononsSurvived = 0;
            if (Math.random() < SHARK_REPRODUCTION_CHANCE) {
                var newShark = new Shark(spawnX, spawnY);
                grid.placeCell(newShark, spawnX, spawnY);
            }
        }
    }

    _getWhatDirectionToMove(grid) {
        var availableDirections = this._checkAvailableDirections(grid);
        if (availableDirections.length > 0) {
            var randomIndex = Math.floor(Math.random() * availableDirections.length);
            return availableDirections[randomIndex];
        }
        return NO_DIRECTION;
    }

    _checkAvailableDirections(grid) {
        var availableFishes = [];
        var availableWaters = [];

        this._fillNorthContent(grid, availableFishes, availableWaters);
        this._fillSouthContent(grid, availableFishes, availableWaters);
        this._fillEastContent(grid, availableFishes, availableWaters);
        this._fillWestContent(grid, availableFishes, availableWaters);

        if (availableFishes.length > 0) {
            this._eatFish();
            return availableFishes;
        }
        return availableWaters;
    }

    _fillNorthContent(grid, availableFishes, availableWater) {
        var northCell = null;
        (this.y - 1 < 0) ? northCell = grid.getCellContent(this.x, grid.matrix.length - 1) : northCell = grid.getCellContent(this.x, this.y - 1);
        if (northCell.type == FISH) availableFishes.push(NORTH);
        else if (northCell.type == WATER) availableWater.push(NORTH);
    }

    _fillSouthContent(grid, availableFishes, availableWater) {
        var southCell = null;
        (this.y + 1 == grid.matrix.length) ? southCell = grid.getCellContent(this.x, 0) : southCell = grid.getCellContent(this.x, this.y + 1);
        if (southCell.type == FISH) availableFishes.push(SOUTH);
        else if (southCell.type == WATER) availableWater.push(SOUTH);
    }

    _fillEastContent(grid, availableFishes, availableWater) {
        var eastCell = null;
        (this.x + 1 == grid.matrix[0].length) ? eastCell = grid.getCellContent(0, this.y) : eastCell = grid.getCellContent(this.x + 1, this.y);
        if (eastCell.type == FISH) availableFishes.push(EAST);
        if (eastCell.type == WATER) availableFishes.push(EAST);
    }

    _fillWestContent(grid, availableFishes, availableWater) {
        var westCell = null;
        (this.x - 1 < 0) ? westCell = grid.getCellContent(grid.matrix[0].length - 1, this.y) : westCell = grid.getCellContent(this.x - 1, this.y);
        if (westCell.type == FISH) availableFishes.push(WEST);
        if (westCell.type == WATER) availableWater.push(WEST);
    }

    _consumeEnergy(grid) {
        this.energy -= ENERGY_PER_MOVEMENT;
        if (this.energy == 0) {
            grid.deleteCell(this.x, this.y);
        }
    }
    _eatFish() {
        this.energy += ENERGY_PER_FISH;
    }


}

function start() {
    var wator = new Wator(document.getElementById("canvas"));
    wator.initializeLoop();
}