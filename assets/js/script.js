function main() {
    
    const baseUrl = 'http://localhost:5000';
    const validIds = [1, 2, 3, 4, 5, 6, 7, 9, 10];
    let total_point;
    let randomId;

    const contentDiv = document.querySelector('.content');
    const startButton = document.querySelector('#start');
    const submitButton = document.querySelector('#submit');
    const saveButton = document.querySelector('#save');
    const resetButton = document.querySelector('#reset');
    const scoreDiv = document.querySelector('.score');

    const getWord = async () => {
        try {
            randomId = validIds[Math.floor(Math.random() * validIds.length)];

            const response = await fetch(`${baseUrl}/api/kata/${randomId}`);
            const responseJson = await response.json();
            if (responseJson.error) {
                showResponseMessage(responseJson.message);
            } else {
                renderWord(responseJson);
            }
        } catch (error) {
            showResponseMessage(error);
        }
    };

    const checkWord = async (kata) => {
        try {
            const response = await fetch(`${baseUrl}/api/kata/${randomId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ kata })
            });

            const responseJson = await response.json();
            if (responseJson.error) {
                showResponseMessage(responseJson.message);
            } else {
                renderScore(responseJson.score);
            }
        } catch (error) {
            showResponseMessage(error);
        }
    };

    const storeScore = async (nama_user, total_point) => {
        try {
            const response = await fetch(`${baseUrl}/api/score`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ nama_user, total_point })
            });

            const responseJson = await response.json();
            if (responseJson.error) {
                showResponseMessage(responseJson.messsage);
            } else {
                resetElement();
                showResponseMessage(responseJson.messsage);
            }
        } catch (error) {
            showResponseMessage(error);
        }
    };

    const resetElement = () => {
        const clueElement = document.querySelector('.clue');
        const inputCustomElement = document.querySelector('.wrap-input');

        if (clueElement) {
            clueElement.remove();
        }
    
        if (inputCustomElement) {
            inputCustomElement.remove();
        }
        
        startButton.style.display = 'block';
        submitButton.style.display = 'none';
        saveButton.style.display = 'none';
        resetButton.style.display = 'none';
        scoreDiv.style.display = 'none';
    }

    const renderScore = (score) => {
        total_point = score;
        const scoreDiv = document.querySelector('.score');
        scoreDiv.innerHTML = `<p>Score: ${score}</p>`;
        scoreDiv.style.display = 'block'; 

        submitButton.style.display = 'none';
        saveButton.style.display = 'inline-block';
        resetButton.style.display = 'inline-block';
    };

    const renderWord = (data) => {
        const { kata, clue } = data;
        
        const clueElement = document.createElement('div');
        clueElement.classList.add('clue');
        clueElement.textContent = clue;
        contentDiv.appendChild(clueElement);

        const wrapInput = document.createElement('div');
        wrapInput.classList.add('wrap-input');

        kata.forEach((char) => {
            const inputElement = document.createElement('input');
            inputElement.type = 'text';
            inputElement.maxLength = 1;
            inputElement.classList.add('input-custom');
            inputElement.value = char; 

            wrapInput.appendChild(inputElement); 
        });

        contentDiv.appendChild(wrapInput);

        startButton.style.display = 'none';
        submitButton.style.display = 'inline-block';
    };

    const showResponseMessage = (message = 'Check your internet connection') => {
        alert(message);
    };

    document.addEventListener('DOMContentLoaded', () => {
        submitButton.style.display = 'none';
        saveButton.style.display = 'none';
        resetButton.style.display = 'none';
        scoreDiv.style.display = 'none';
        
        startButton.addEventListener('click', () => {
            getWord();
        });

        submitButton.addEventListener('click', () => {
            const inputs = document.querySelectorAll('.wrap-input input');
            let userInput = '';
            let isValid = true;
            let errorMessage = '';
        
            inputs.forEach((input, index) => {
                const value = input.value;
        
                if (!/^[a-zA-Z]$/.test(value)) {
                    errorMessage += `Input pada kotak ${index + 1} harus berupa 1 karakter alphabet.\n`;
                    isValid = false;
                }
        
                userInput += value;
            });
        
            if (!isValid) {
                alert(errorMessage);
            } else {
                checkWord(userInput);
            }
        });

        resetButton.addEventListener('click', () => {
            const clueElement = document.querySelector('.clue');
            const inputCustomElement = document.querySelector('.wrap-input');

            if (clueElement) {
                clueElement.remove();
            }
        
            if (inputCustomElement) {
                inputCustomElement.remove();
            }
        
            scoreDiv.style.display = 'none';
            saveButton.style.display = 'none';
            resetButton.style.display = 'none';
    
            getWord();
        });

        saveButton.addEventListener('click', () => {
            const namaUser = prompt("Masukkan nama pengguna:").trim();
            if (namaUser) {
                storeScore(namaUser, total_point);
            } else {
                alert("Nama pengguna tidak boleh kosong!");
            }
        });        
        
    });
}
  
main();
  