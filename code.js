document.addEventListener('DOMContentLoaded', () => {
    let rows, cols;
    let playing = false;
    let timer;
    let reproductionTime = 500;
    let birthRules = [3]; // defaultní pravidla
    let survivalRules = [2, 3]; // defaultní pravidla
    let grid = [];
    let nextGrid = [];

    createGrid();
    setupControls();
    calculateGridSize();

    function calculateGridSize() {
        const cellSize = parseInt(document.getElementById('cellSize').value) || 20; // velikost buňky
        rows = Math.floor(window.innerHeight / cellSize) - 5; // rezerva pro ovládání
        cols = Math.floor(window.innerWidth / cellSize) - 5;
        resetGrid();
    }

    window.addEventListener('resize', calculateGridSize);

    function createGrid() {
        const gridContainer = document.getElementById('gridContainer');
        gridContainer.innerHTML = ''; // Vyčistit starý grid
        const table = document.createElement('table');
        for (let i = 0; i < rows; i++) {
            const tr = document.createElement('tr');
            grid[i] = [];
            nextGrid[i] = [];
            for (let j = 0; j < cols; j++) {
                const td = document.createElement('td');
                td.className = 'dead';
                td.id = `${i}_${j}`;
                td.onclick = () => toggleCell(i, j);
                tr.appendChild(td);
                grid[i][j] = 0;
                nextGrid[i][j] = 0;
            }
            table.appendChild(tr);
        }
        gridContainer.appendChild(table);
    }

    function toggleCell(row, col) {
        const cell = document.getElementById(`${row}_${col}`);
        if (grid[row][col] === 0) {
            cell.className = 'live';
            grid[row][col] = 1;
        } else {
            cell.className = 'dead';
            grid[row][col] = 0;
        }
    }

    function setupControls() {
        document.getElementById('start').addEventListener('click', () => {
            playing = !playing;
            document.getElementById('start').innerText = playing ? 'Pause' : 'Start';
            if (playing) play();
        });

        document.getElementById('clear').addEventListener('click', () => {
            playing = false;
            document.getElementById('start').innerText = 'Start';
            resetGrid();
        });

        document.getElementById('random').addEventListener('click', randomizeGrid);

        document.getElementById('speed').addEventListener('input', (e) => {
            reproductionTime = e.target.value;
        });

        document.getElementById('cellSize').addEventListener('input', () => {
            const newSize = document.getElementById('cellSize').value;
            document.querySelectorAll('td').forEach(cell => {
                cell.style.width = `${newSize}px`;
                cell.style.height = `${newSize}px`;
            });
            calculateGridSize();
        });

        document.getElementById('applyRules').addEventListener('click', () => {
            birthRules = document.getElementById('birth').value.split(',').map(Number);
            survivalRules = document.getElementById('survival').value.split(',').map(Number);
            alert(`Pravidla nastavena: Birth = ${birthRules}, Survival = ${survivalRules}`);
        });
    }

    function play() {
        computeNextGeneration();
        if (playing) timer = setTimeout(play, reproductionTime);
    }

    function computeNextGeneration() {
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                applyRules(row, col);
            }
        }
        updateGrid();
    }

    function applyRules(row, col) {
        const neighbors = countNeighbors(row, col);
        if (grid[row][col] === 1) {
            nextGrid[row][col] = survivalRules.includes(neighbors) ? 1 : 0;
        } else {
            nextGrid[row][col] = birthRules.includes(neighbors) ? 1 : 0;
        }
    }

    function countNeighbors(row, col) {
        let count = 0;
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if (i === 0 && j === 0) continue;
                const r = row + i;
                const c = col + j;
                if (r >= 0 && r < rows && c >= 0 && c < cols && grid[r][c] === 1) {
                    count++;
                }
            }
        }
        return count;
    }

    function updateGrid() {
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const cell = document.getElementById(`${row}_${col}`);
                grid[row][col] = nextGrid[row][col];
                cell.className = grid[row][col] === 1 ? 'live' : 'dead';
            }
        }
    }

    function resetGrid() {
        grid = [];
        nextGrid = [];
        createGrid();
    }

    function randomizeGrid() {
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                grid[row][col] = Math.random() > 0.5 ? 1 : 0;
                document.getElementById(`${row}_${col}`).className =
                    grid[row][col] === 1 ? 'live' : 'dead';
            }
        }
    }
});