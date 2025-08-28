        // Screen navigation
        function showScreen(id) {
            document.querySelectorAll('.crt-screen').forEach(s => s.classList.remove('active'));
            document.getElementById(id).classList.add('active');
            // Pause audio if not on screen4
            if (id !== 'screen4') {
                audio.pause();
                spotifyPlayIcon.innerHTML = "&#9654;";
            }
            // Animasi pesan ulang tahun
            if (id === 'screen2') {
                setTimeout(() => {
                    const el = document.getElementById('birthdayMessage');
                    el.classList.add('active');
                    typeBirthdayMessage(birthdayText, el);
                }, 200);
            } else {
                document.getElementById('birthdayMessage').classList.remove('active');
            }
            // Stop photobox slideshow jika keluar dari photobox
            if (id !== 'screen3') stopPhotoboxSlideshow();
            // --- TETRIS GAME LOGIC ---
            if (id === 'screenTetris') {
                setTimeout(() => {
                    tetrisRestart();
                    setupTetrisTouchControls();
                }, 100);
            } else {
                // Pause tetris if not on tetris screen
                if (typeof tetrisInterval !== "undefined" && tetrisInterval) clearInterval(tetrisInterval);
                if (document.getElementById('tetrisGameOverMsg')) document.getElementById('tetrisGameOverMsg').style.display = 'none';
                tetrisStarted = false;
            }
        }

        // Pesan ulang tahun lebih panjang & animasi mengetik kebawah
        const birthdayText = `
        Selamat ulang tahun, Neva! 🎉<br><br>
        Semoga di usia yang baru ini, kamu selalu dikelilingi cinta, tawa, dan kebahagiaan yang gak ada habis habisnya.<br>
        Jangan pernah ragu buat bermimpi besar, karena kamu punya kekuatan untuk mewujudkan itu!<br>
        Terima kasih sudah menjadi sosok yang ceria, baik hati, dan selalu menginspirasi orang di sekitar kamu ya.<br>
        Semoga setiap langkah kamu dipenuhi keberuntungan, dan setiap hari penuh warna kebahagiaan.<br>
        Tetap jadi Neva yang luar biasa! 💖<br><br>
        Happy birthday, Gemoy WYATB! 🎀🌸✨
        `;

        // Fungsi animasi mengetik kebawah
        function typeBirthdayMessage(text, el, speed = 18) {
            el.innerHTML = "";
            let i = 0;
            let tag = false;
            let buffer = "";
            function type() {
                if (i < text.length) {
                    let char = text[i];
                    if (char === "<") tag = true;
                    if (tag) buffer += char;
                    else el.innerHTML += char;
                    if (char === ">") {
                        tag = false;
                        el.innerHTML += buffer;
                        buffer = "";
                    }
                    i++;
                    setTimeout(type, tag ? 0 : speed);
                }
            }
            type();
        }

        // Photobox logic
        const photos = [
            {
                src: "images/ui.jpeg",
                caption: "Waktu kamu nemenin ke UI🎓"
            },
            {
                src: "images/photoboxpc.jpeg",
                caption: "Photobox Ngelag😒"
            },
            {
                src: "images/PHOTOBOXTSM (1).jpeg",
                caption: "Photobox TSM🔥"
            },
            {
                src: "images/ragunan.jpeg",
                caption: "Ekosistem Date🦒"
            },
            {
                src: "images/perpisahan.jpeg",
                caption: "Perpisahan SMA😭"
            },
            {
                src: "images/gemoyy.jpeg",
                caption: "Gemoyyy💖"
            },
            {
                src: "images/di paparazi.jpeg",
                caption: "Fotbar pertama ya ini"
            },
            {
                src: "images/lupa ini dimana.jpeg",
                caption: "Photobox lupa ini dimana"
            },
            {
                src: "images/taman langsat.jpeg",
                caption: "Taman Date"
            }
        ];
        let photoIdx = 0;
        let photoboxTimer = null;
        function updatePhotobox(next = true, withAnim = true) {
            const img = document.getElementById('photoboxPhoto');
            const cap = document.getElementById('photoboxCaption');
            img.classList.remove('anim-in', 'anim-out');
            if (withAnim) img.classList.add('anim-out');
            setTimeout(() => {
                img.src = photos[photoIdx].src;
                cap.textContent = photos[photoIdx].caption;
                if (withAnim) img.classList.remove('anim-out');
                if (withAnim) img.classList.add('anim-in');
                // Flash animasi shoot
                const flash = document.getElementById('photoboxFlash');
                flash.classList.remove('active');
                setTimeout(() => flash.classList.add('active'), 180);
                setTimeout(() => flash.classList.remove('active'), 600);
            }, withAnim ? 180 : 0);
            setTimeout(() => img.classList.remove('anim-in'), 700);
        }
        document.getElementById('photoPrev').onclick = function () {
            stopPhotoboxSlideshow();
            photoIdx = (photoIdx - 1 + photos.length) % photos.length;
            updatePhotobox(false);
        };
        document.getElementById('photoNext').onclick = function () {
            stopPhotoboxSlideshow();
            photoIdx = (photoIdx + 1) % photos.length;
            updatePhotobox(true);
        };
        // Inisialisasi photobox saat masuk screen3
        document.querySelector('button.console-btn[onclick*="screen3"]').onclick = function () {
            showScreen('screen3');
            updatePhotobox(true, false);
        };

        // Photobox slideshow otomatis saat diklik
        function startPhotoboxSlideshow() {
            stopPhotoboxSlideshow();
            photoboxTimer = setInterval(() => {
                photoIdx = (photoIdx + 1) % photos.length;
                updatePhotobox(true);
            }, 3000);
        }
        function stopPhotoboxSlideshow() {
            if (photoboxTimer) clearInterval(photoboxTimer);
            photoboxTimer = null;
        }
        document.getElementById('photoboxFrame').onclick = function () {
            startPhotoboxSlideshow();
        };

        // Spotify-like Audio Player
        const audio = document.getElementById('audio');
        const spotifyPlayBtn = document.getElementById('spotifyPlayBtn');
        const spotifyPlayIcon = document.getElementById('spotifyPlayIcon');
        const spotifyProgress = document.getElementById('spotifyProgress');
        const spotifyProgressBar = document.getElementById('spotifyProgressBar');
        const spotifyCurrent = document.getElementById('spotifyCurrent');
        const spotifyDuration = document.getElementById('spotifyDuration');

        function formatTime(sec) {
            sec = Math.floor(sec);
            return Math.floor(sec / 60) + ":" + ("0" + (sec % 60)).slice(-2);
        }
        audio.onloadedmetadata = function () {
            spotifyDuration.textContent = formatTime(audio.duration);
        };
        audio.ontimeupdate = function () {
            spotifyCurrent.textContent = formatTime(audio.currentTime);
            spotifyProgressBar.style.width = (audio.currentTime / audio.duration * 100) + "%";
        };
        // Ganti fungsi play agar langsung buka Spotify
        spotifyPlayBtn.onclick = function () {
            window.open('https://open.spotify.com/track/4N0onM58H8M2scDvhVU1hC', '_blank');
        };
        audio.onended = function () {
            spotifyPlayIcon.innerHTML = "&#9654;";
        };
        spotifyProgress.onclick = function (e) {
            const rect = spotifyProgress.getBoundingClientRect();
            const x = e.clientX - rect.left;
            audio.currentTime = (x / rect.width) * audio.duration;
        };

        // --- TETRIS GAME LOGIC ---
        // Modern color palette
        const TETRIS_COLORS = [
            ["#ffb6e6", "#ff69b4"], // I
            ["#ffe600", "#ffb700"], // O
            ["#00e6ff", "#00b6e6"], // J
            ["#ff6f61", "#ffb6b6"], // L
            ["#baffc9", "#00e676"], // S
            ["#b39ddb", "#7c43bd"], // T
            ["#ffd6e0", "#ff69b4"], // Z
        ];

        // TETROMINOS: I, O, J, L, S, T, Z
        const TETROMINOS = [
            // I (horizontal & vertical)
            [
                [[0, 1], [1, 1], [2, 1], [3, 1]],
                [[2, 0], [2, 1], [2, 2], [2, 3]],
                [[0, 2], [1, 2], [2, 2], [3, 2]],
                [[1, 0], [1, 1], [1, 2], [1, 3]],
            ],
            // O
            [
                [[1, 0], [2, 0], [1, 1], [2, 1]],
                [[1, 0], [2, 0], [1, 1], [2, 1]],
                [[1, 0], [2, 0], [1, 1], [2, 1]],
                [[1, 0], [2, 0], [1, 1], [2, 1]],
            ],
            // J
            [
                [[0, 0], [0, 1], [1, 1], [2, 1]],
                [[1, 0], [2, 0], [1, 1], [1, 2]],
                [[0, 1], [1, 1], [2, 1], [2, 2]],
                [[1, 0], [1, 1], [0, 2], [1, 2]],
            ],
            // L
            [
                [[2, 0], [0, 1], [1, 1], [2, 1]],
                [[1, 0], [1, 1], [1, 2], [2, 2]],
                [[0, 1], [1, 1], [2, 1], [0, 2]],
                [[0, 0], [1, 0], [1, 1], [1, 2]],
            ],
            // S
            [
                [[1, 0], [2, 0], [0, 1], [1, 1]],
                [[1, 0], [1, 1], [2, 1], [2, 2]],
                [[1, 1], [2, 1], [0, 2], [1, 2]],
                [[0, 0], [0, 1], [1, 1], [1, 2]],
            ],
            // T
            [
                [[1, 0], [0, 1], [1, 1], [2, 1]],
                [[1, 0], [1, 1], [2, 1], [1, 2]],
                [[0, 1], [1, 1], [2, 1], [1, 2]],
                [[1, 0], [0, 1], [1, 1], [1, 2]],
            ],
            // Z
            [
                [[0, 0], [1, 0], [1, 1], [2, 1]],
                [[2, 0], [1, 1], [2, 1], [1, 2]],
                [[0, 1], [1, 1], [1, 2], [2, 2]],
                [[1, 0], [0, 1], [1, 1], [0, 2]],
            ]
        ];
        // --- SMARTER RANDOMIZER: Lebih sering keluarkan I dan O, dan tidak mengulang bentuk yang sama berturut-turut ---
        let tetrisLastIdx = -1;
        function tetrisSmartRandomTetromino() {
            // Bobot: I dan O lebih sering, S/Z lebih jarang
            const weightedBag = [
                0, 0, // I
                1, 1, // O
                2, 3, 5, // J, L, T
                4, 6, // S, Z
            ];
            let idx;
            do {
                idx = weightedBag[Math.floor(Math.random() * weightedBag.length)];
            } while (idx === tetrisLastIdx && Math.random() < 0.7); // Hindari bentuk sama berturut-turut
            tetrisLastIdx = idx;
            return {
                shape: TETROMINOS[idx],
                rot: 0,
                x: 3,
                y: 0,
                color: TETRIS_COLORS[idx],
                idx: idx
            };
        }

        // --- TETRIS GAME LOGIC ---
        const ROWS = 20,
            COLS = 10;
        let tetrisBoard = [];
        let tetrisCurrent = null;
        let tetrisNext = null;
        let tetrisScore = 0;
        let tetrisInterval = null;
        let tetrisGameOver = false;
        let tetrisSpeed = 500;
        let tetrisPaused = false;

        function tetrisInitBoard() {
            tetrisBoard = [];
            for (let r = 0; r < ROWS; r++) {
                let row = [];
                for (let c = 0; c < COLS; c++) row.push(null);
                tetrisBoard.push(row);
            }
        }
        function tetrisRandomTetromino() {
            const idx = Math.floor(Math.random() * TETROMINOS.length);
            return {
                shape: TETROMINOS[idx],
                rot: 0,
                x: 3,
                y: 0,
                color: TETRIS_COLORS[idx],
                idx: idx
            };
        }
        function tetrisDrawBoard() {
            const board = document.getElementById('tetrisBoard');
            // Simpan referensi game over message
            const gameOverMsg = document.getElementById('tetrisGameOverMsg');
            // Hapus semua children kecuali game over message
            while (board.firstChild) {
                if (board.firstChild !== gameOverMsg) {
                    board.removeChild(board.firstChild);
                } else {
                    break;
                }
            }
            // Tambahkan cell
            for (let r = 0; r < ROWS; r++) {
                for (let c = 0; c < COLS; c++) {
                    const cell = document.createElement('div');
                    cell.className = 'tetris-cell';
                    if (tetrisBoard[r][c]) {
                        cell.classList.add('filled');
                        cell.style.setProperty('--color1', tetrisBoard[r][c][0]);
                        cell.style.setProperty('--color2', tetrisBoard[r][c][1]);
                    }
                    board.insertBefore(cell, gameOverMsg);
                }
            }
            // Draw current tetromino
            if (tetrisCurrent) {
                tetrisCurrent.shape[tetrisCurrent.rot].forEach(([dx, dy]) => {
                    let x = tetrisCurrent.x + dx,
                        y = tetrisCurrent.y + dy;
                    if (y >= 0 && y < ROWS && x >= 0 && x < COLS) {
                        const idx = y * COLS + x;
                        const cell = board.children[idx];
                        cell.classList.add('filled');
                        cell.style.setProperty('--color1', tetrisCurrent.color[0]);
                        cell.style.setProperty('--color2', tetrisCurrent.color[1]);
                    }
                });
            }
            // Show/hide gameover msg
            if (tetrisGameOver) {
                gameOverMsg.style.display = 'block';
            } else {
                gameOverMsg.style.display = 'none';
            }
        }
        function tetrisDrawNext() {
            const next = document.getElementById('tetrisNext');
            next.innerHTML = '';
            for (let i = 0; i < 16; i++) {
                const cell = document.createElement('div');
                cell.className = 'tetris-cell';
                next.appendChild(cell);
            }
            if (tetrisNext) {
                tetrisNext.shape[0].forEach(([dx, dy]) => {
                    let x = dx,
                        y = dy;
                    if (y >= 0 && y < 4 && x >= 0 && x < 4) {
                        const idx = y * 4 + x;
                        const cell = next.children[idx];
                        cell.classList.add('filled');
                        cell.style.setProperty('--color1', tetrisNext.color[0]);
                        cell.style.setProperty('--color2', tetrisNext.color[1]);
                    }
                });
            }
        }
        function tetrisCanMove(nx, ny, nrot) {
            const shape = tetrisCurrent.shape[nrot];
            for (const [dx, dy] of shape) {
                let x = nx + dx,
                    y = ny + dy;
                if (x < 0 || x >= COLS || y >= ROWS) return false;
                if (y >= 0 && tetrisBoard[y][x]) return false;
            }
            return true;
        }
        function tetrisMerge() {
            tetrisCurrent.shape[tetrisCurrent.rot].forEach(([dx, dy]) => {
                let x = tetrisCurrent.x + dx,
                    y = tetrisCurrent.y + dy;
                if (y >= 0 && y < ROWS && x >= 0 && x < COLS)
                    tetrisBoard[y][x] = tetrisCurrent.color;
            });
        }
        function tetrisClearLines() {
            let lines = 0;
            for (let r = ROWS - 1; r >= 0; r--) {
                if (tetrisBoard[r].every(cell => cell)) {
                    tetrisBoard.splice(r, 1);
                    tetrisBoard.unshift(Array(COLS).fill(null));
                    lines++;
                    r++;
                }
            }
            if (lines > 0) {
                tetrisScore += [0, 40, 100, 300, 1200][lines];
                document.getElementById('tetrisScore').textContent = "Score: " + tetrisScore;
                let newSpeed = Math.max(100, 500 - Math.floor(tetrisScore / 200) * 30);
                if (newSpeed !== tetrisSpeed) {
                    tetrisSpeed = newSpeed;
                    tetrisSetInterval();
                }
            }
        }
        function tetrisSpawn() {
            tetrisCurrent = tetrisNext || tetrisSmartRandomTetromino();
            tetrisNext = tetrisSmartRandomTetromino();
            tetrisDrawNext();
            if (!tetrisCanMove(tetrisCurrent.x, tetrisCurrent.y, tetrisCurrent.rot)) {
                tetrisGameOver = true;
                clearInterval(tetrisInterval);
                tetrisDrawBoard();
            }
        }
        function tetrisStep() {
            if (tetrisGameOver || tetrisPaused) return;
            if (tetrisCanMove(tetrisCurrent.x, tetrisCurrent.y + 1, tetrisCurrent.rot)) {
                tetrisCurrent.y++;
            } else {
                tetrisMerge();
                tetrisClearLines();
                tetrisSpawn();
            }
            tetrisDrawBoard();
        }
        function tetrisMove(dx) {
            if (tetrisGameOver) return;
            if (tetrisCanMove(tetrisCurrent.x + dx, tetrisCurrent.y, tetrisCurrent.rot)) {
                tetrisCurrent.x += dx;
                tetrisDrawBoard();
            }
        }
        function tetrisRotate() {
            if (tetrisGameOver) return;
            let nrot = (tetrisCurrent.rot + 1) % 4;
            if (tetrisCanMove(tetrisCurrent.x, tetrisCurrent.y, nrot)) {
                tetrisCurrent.rot = nrot;
                tetrisDrawBoard();
            }
        }
        function tetrisDown() {
            if (tetrisGameOver) return;
            if (tetrisCanMove(tetrisCurrent.x, tetrisCurrent.y + 1, tetrisCurrent.rot)) {
                tetrisCurrent.y++;
                tetrisDrawBoard();
            }
        }
        function tetrisDrop() {
            if (tetrisGameOver) return;
            while (tetrisCanMove(tetrisCurrent.x, tetrisCurrent.y + 1, tetrisCurrent.rot)) {
                tetrisCurrent.y++;
            }
            tetrisDrawBoard();
        }
        function tetrisRestart() {
            tetrisInitBoard();
            tetrisScore = 0;
            tetrisGameOver = false;
            tetrisSpeed = 500;
            document.getElementById('tetrisScore').textContent = "Score: 0";
            tetrisNext = tetrisSmartRandomTetromino();
            tetrisSpawn();
            tetrisDrawBoard();
            tetrisDrawNext();
            tetrisSetInterval();
            document.getElementById('tetrisGameOverMsg').style.display = 'none';
        }
        function tetrisSetInterval() {
            if (tetrisInterval) clearInterval(tetrisInterval);
            tetrisInterval = setInterval(tetrisStep, tetrisSpeed);
        }
        // Keyboard controls
        document.addEventListener('keydown', function (e) {
            if (!document.getElementById('screenTetris') || !document.getElementById('screenTetris').classList.contains('active')) return;
            if (tetrisGameOver) return;
            if (e.key === "ArrowLeft") { tetrisMove(-1); e.preventDefault(); }
            else if (e.key === "ArrowRight") { tetrisMove(1); e.preventDefault(); }
            else if (e.key === "ArrowDown") { tetrisDown(); e.preventDefault(); }
            else if (e.key === "ArrowUp" || e.key === "x" || e.key === "X" || e.key === " ") { tetrisRotate(); e.preventDefault(); }
            else if (e.key === "z" || e.key === "Z") { tetrisRotate(); e.preventDefault(); }
            else if (e.key === "Enter") { tetrisDrop(); e.preventDefault(); }
        });
        // Touch controls
        function setupTetrisTouchControls() {
            const left = document.getElementById('tetrisLeft');
            const right = document.getElementById('tetrisRight');
            const down = document.getElementById('tetrisDown');
            const rotate = document.getElementById('tetrisRotate');
            if (!left) return;
            left.ontouchstart = e => { tetrisMove(-1); e.preventDefault(); };
            right.ontouchstart = e => { tetrisMove(1); e.preventDefault(); };
            down.ontouchstart = e => { tetrisDown(); e.preventDefault(); };
            rotate.ontouchstart = e => { tetrisRotate(); e.preventDefault(); };
            left.onclick = () => tetrisMove(-1);
            right.onclick = () => tetrisMove(1);
            down.onclick = () => tetrisDown();
            rotate.onclick = () => tetrisRotate();
        }
        setupTetrisTouchControls();

        // Inisialisasi photobox pertama kali
        updatePhotobox(true, false);