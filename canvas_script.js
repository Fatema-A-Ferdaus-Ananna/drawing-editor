const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const colorPicker = document.getElementById('colorPicker');
const saveButton = document.getElementById('saveButton');
const brushWidth = document.querySelector('.strokeWidth');

let isDrawing = false;
let lastX = 0;
let lastY = 0;
let strokeColor = '#000000'; // Default stroke color

// Set initial canvas size
canvas.width = 800;
canvas.height = 500;
    
//let strokeWidth = 15; // Initial stroke width
ctx.lineWidth = 1;
//ctx.lineJoin = "butt";
ctx.lineCap = "round";
brushWidth.textContent = "Brush Width  :  " + ctx.lineWidth;

let history = []; // Drawing history
let historyIndex = -1; // Index of current state in history

    

ctx.fillStyle = '#ffffff';
ctx.fillRect(0, 0, canvas.width, canvas.height);

canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);

function startDrawing(e) {
        isDrawing = true;
        [lastX, lastY] = [e.offsetX, e.offsetY];
}

function draw(e) {
    if (!isDrawing) return;

    ctx.strokeStyle = strokeColor;
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
    [lastX, lastY] = [e.offsetX, e.offsetY];
}

function stopDrawing() {
    if (isDrawing) {
        // Save current state to history
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        history = history.slice(0, historyIndex + 1);
        history.push(imageData);
        historyIndex++;
    }

    isDrawing = false;
    }

colorPicker.addEventListener('input', function() {
    strokeColor = this.value;
});

saveButton.addEventListener('click', function() {
        
    const dataUrl = canvas.toDataURL('image/jpeg', 1); // Specify JPEG format and quality (0.8)

    // const dataUrl = canvas.toDataURL(); // Get the image data URL
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = 'drawing.jpge'; // Set the filename for the downloaded image
    a.click();
});

// Event listener for increasing stroke width
document.getElementById('increaseWidth').addEventListener('click', function() {
    ctx.lineWidth += 1;
    brushWidth.textContent = "Brush Width  :  " + ctx.lineWidth;
});

// Event listener for decreasing stroke width
document.getElementById('decreaseWidth').addEventListener('click', function() {
    if (ctx.lineWidth > 1) {
        ctx.lineWidth -= 1;
        brushWidth.textContent = "Brush Width  :  " + ctx.lineWidth;
    }
});

// Event listener for undo
document.getElementById('undoButton').addEventListener('click', function() {
    if (historyIndex > 0) {
        historyIndex--;
        ctx.putImageData(history[historyIndex], 0, 0);
    }
});

// Event listener for redo
document.getElementById('redoButton').addEventListener('click', function() {
    if (historyIndex < history.length - 1) {
        historyIndex++;
        ctx.putImageData(history[historyIndex], 0, 0);
    }
});

// Event listener for clearing canvas
document.getElementById('clearButton').addEventListener('click', function() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    history = [];
    historyIndex = -1;
});


