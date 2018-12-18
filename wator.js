const WIDTH = 640; 
const HEIGHT= 480;
const CELL_SIZE=2;

const COLOR_BLUE = "BLUE";
const COLOR_RED = "RED";
const COLOR_GREEN = "GREEN";

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
                
                var cell = null;
                var random = Math.floor((Math.random()*3)+1);
                if(random == 1){
                    cell = new Water(j,i);
                }else if(random == 2){
                    cell = new Fish(j,i);
                }else{
                    cell = new Shark(j,i);
                }
                this.matrix[i][j] = cell;
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

class Water extends Cell{
    constructor(x,y){
        super(x,y,COLOR_BLUE);
    }
}

class Fish extends Cell{
    constructor(x,y){
        super(x,y,COLOR_GREEN);
    }
}

class Shark extends Cell{
    constructor(x,y){
        super(x,y,COLOR_RED);
    }
}

function start(){
    var wator = new Wator(document.getElementById("canvas"));
    wator.paint();
}