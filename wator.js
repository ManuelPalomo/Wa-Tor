const WIDTH = 640; 
const HEIGHT= 480;
const CELL_SIZE=2;

window.addEventListener('DOMContentLoaded',()=>{
    start();
})


class Wator{
    constructor(canvas){
        this.canvas = canvas;
        this.canvas.height = HEIGHT;
        this.canvas.width = WIDTH;
        this.context = canvas.getContext("2d");
        this.initialize();
        this.paint();
    }

    initialize(){
        this.grid = new Grid();
    }

    paint(){
        var context = this.context;
        this.grid.matrix.map(function(row){
            row.map(function(cell){
                cell.paint(context);
            })
        })      
    }
    clear(){
    }
}

class Grid{
    constructor(){
        let widthCellNumber = Math.floor(WIDTH/CELL_SIZE);
        let heightCellNumber = Math.floor(HEIGHT/CELL_SIZE);
        this.matrix = [];
        for(var i=0; i<heightCellNumber;i++){
            this.matrix[i] = new Array(widthCellNumber);
            for(var j = 0;j<this.matrix[i].length;j++){
                this.matrix[i][j] = new Cell(j,i,"RED");
            }
        }
    }
}

class Cell{
    constructor(x,y,color){
        this.x = x;
        this.y = y;
        this.color = color;
    }

    paint(context){
        context.fillStyle=this.color;
        context.fillRect(this.x*CELL_SIZE,this.y*CELL_SIZE,CELL_SIZE,CELL_SIZE);
    }

    move(){}
}

function start(){
    var wator = new Wator(document.getElementById("canvas"));
    wator.paint();
}