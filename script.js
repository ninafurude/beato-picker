const btnReset = document.getElementById('btn-reset');
const btnAdd = document.getElementById('btn-add');
const btnGo = document.getElementById('btn-go');
const btnName = document.getElementById('btn-name');
const btnSave = document.getElementById('btn-save');
const btnView = document.getElementById('btn-viewpresets');
const btncloseModal = document.getElementById('close-modal-btn');

const beatoImgSite = document.getElementById('beato-normal');
const beatoImgAlert = document.getElementById('beato-alert')
const beatoText = document.getElementById('beato-p');
const beatoContainer = document.getElementById('button-textarea-container');
const inputsDiv = document.getElementById('inputs-container');
const textInput = document.getElementById('text-area');
const nameInput = document.getElementById('text-name');
const nameP = document.getElementById('name-p');
const presetModal = document.getElementById('preset-modal-id');
const presetContainer = document.getElementById('presets-container');

const ahaha = document.getElementById('beato-laugh');
const customAlert = document.getElementById('custom-alert');


let userName = '';
let choiceList = [];
let sum = 0;
let presets = [];


const now = new Date();
const hours = now.getHours();
let message = ''

if (hours >= 5 && hours < 12){
    message = 'Good morning'
} else if (hours >= 12 && hours < 18){
    message = 'Good afternoon'
} else {
    message = 'Good evening'
}

window.addEventListener('load', () => {
    const savedName = localStorage.getItem('name');
    const savedPresets = localStorage.getItem('presets');
    
    if (savedName) {
        userName = savedName;
        customAlert.classList.add('none');
        beatoText.textContent = `${message}, ${userName}! Add your choices to the list and I will choose it for you!`;
    }
    
    if(savedPresets) {
        presets = JSON.parse(savedPresets);
    }
});

const warningP = document.createElement('p')
warningP.textContent = `Nothing to see here, my dear! You can add new presets by clicking the "Save" button.`

beatoText.textContent = `${message}, ${userName}! Add your choices to the list and I will choose it for you!`

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function changeBeatoImgText(newImg, newText){
    beatoImgSite.setAttribute('src', newImg);
    beatoText.textContent = newText
}

function saveChoices (){
    if (choiceList.length === 0){
        changeBeatoImgText('/assets/beato-angry.webp', `You have nothing to save, ${userName}!`);
        return;
    }

    const presetNameInput = document.createElement('input');
    const newAddBtn = document.createElement('button');

    presetNameInput.type = 'text';
    presetNameInput.placeholder = 'Preset name';
    newAddBtn.textContent = 'Save';

    beatoContainer.innerHTML = '';
    beatoContainer.appendChild(presetNameInput);
    beatoContainer.appendChild(newAddBtn);

    changeBeatoImgText('/assets/beato-happy.webp', `Give it a name, ${userName}:`);

    newAddBtn.addEventListener('click', () => {
        if (presetNameInput.value === ''){
            changeBeatoImgText('/assets/beato-angry.webp', `I said, give it a name, ${userName}!`);
            return;
        }

        presets.push({
            name: presetNameInput.value,
            choices: [...choiceList]
        });

        localStorage.setItem('presets', JSON.stringify(presets));

        changeBeatoImgText('/assets/beato-super-happy.webp', `Preset saved! Ahaha!`);
        beatoContainer.innerHTML = '';
    });
}

function viewPresets (){
    presetContainer.innerHTML = '';

    if (presets.length === 0) {
        presetModal.appendChild(warningP);
    } else {
        renderPresets();
    }

    presetModal.classList.add('open');
}

function renderPresets (){
    presets.forEach((preset) => {
        const nameP = document.createElement('p');
        nameP.textContent = `Name: ${preset.name}`;

        const choicesP = document.createElement('p');
        choicesP.textContent = `Choices: ${preset.choices.join(', ')}`;

        const addList = document.createElement('button');
        addList.textContent = 'Add to list'

        addList.addEventListener('click', () => {
            if (choiceList.length !== 0){
                changeBeatoImgText(
                    '/assets/beato-angry.webp',
                    'You already have stuff on the list, clear it first!'
                );
                return;
            }

            preset.choices.forEach(choice => {
                sum++;

                const newP = document.createElement('p');
                newP.id = `newP${sum}`;
                newP.textContent = choice;

                const removeBtn = document.createElement('span');
                removeBtn.textContent = '✖';
                removeBtn.style.cursor = 'pointer';
                removeBtn.style.marginLeft = '8px';
                removeBtn.style.color = 'white';

                removeBtn.addEventListener('click', () => {
                    removeChoice(newP.id);
                });

                newP.appendChild(removeBtn);
                inputsDiv.appendChild(newP);

                choiceList.push(choice);
            });

            presetModal.classList.remove('open');
        });

        presetContainer.appendChild(nameP);
        presetContainer.appendChild(choicesP);
        presetContainer.appendChild(addList);
    });
}

function closeModal (){
    presetModal.classList.remove('open');
}

function addText() {
    sum++;

    const newP = document.createElement('p');
    newP.id = `newP${sum}`;
    newP.textContent = textInput.value;

    const removeBtn = document.createElement('span');
    removeBtn.textContent = '✖';
    removeBtn.style.cursor = 'pointer';
    removeBtn.style.marginLeft = '8px';
    removeBtn.style.color = 'white';

    removeBtn.addEventListener('click', () => {
        removeChoice(newP.id);
    });

    newP.appendChild(removeBtn);
    inputsDiv.appendChild(newP);

    choiceList.push(textInput.value);
    textInput.value = '';

    changeBeatoImgText('/assets/beato-happy.webp', 'Good! Keep adding ahaha!');
}

function removeChoice(id) {
    const p = document.getElementById(id);
    if (!p) return;

    const text = p.firstChild.textContent;

    choiceList = choiceList.filter(item => item !== text);
    p.remove();
}

function resetChoices () {
    inputsDiv.innerHTML = '';   
    choiceList = [];            
    sum = 0;                    
    changeBeatoImgText('/assets/beato-super-happy.webp', `All clean! Add new choices, ${userName}!`);
}

function addChoicesClick (){
    if (textInput.value === ''){
        changeBeatoImgText('/assets/beato-angry.webp', `You can't just leave the space blank, ${userName}! You need to add something!`);
        return;
    }
    
    addText();
}

function addChoicesEnter (e){
    if (e.key === 'Enter' && textInput.value === ''){
        changeBeatoImgText('/assets/beato-angry.webp', `You can't just leave the space blank, ${userName}! You need to add something!`);
        return;
    }
    
    if(e.key === 'Enter'){
        addText();
    }
}

function decideChoices(){
    if (choiceList.length === 0){
        changeBeatoImgText('/assets/beato-super-angry.webp', `Are you trying to make me angry, ${userName}? There's nothing on the list!`);
        return;
    }

    if (choiceList.length === 1){
        changeBeatoImgText('/assets/beato-confused.webp', 'Ha? Why would you want me to choose only one thing?');
        return;
    }

    const beatosChoice = getRandomIntInclusive(0, choiceList.length - 1);
    changeBeatoImgText('/assets/beato-choose.webp', `Ahaha! My choice is: "${choiceList[beatosChoice]}"`);
    ahaha.play()
    ahaha.volume = 0.3;
}

function getName () {
    const nameValue = nameInput.value.trim();

    if (nameValue === ''){
        nameP.textContent = "Enter something, furniture! You don't wan't to make me angry!"
        beatoImgAlert.setAttribute('src', 'assets/beato-angry.webp')
        return;
    } 
        

    localStorage.setItem('name', nameValue);
    userName = nameValue;

    beatoText.textContent = `${message}, ${userName}! Add your choices to the list and I will choose it for you!`;

    customAlert.classList.add('none');
}

btnName.addEventListener('click', getName);

btnReset.addEventListener('click', resetChoices);

btnSave.addEventListener('click', saveChoices);

btnView.addEventListener('click', viewPresets);

btnAdd.addEventListener('click', addChoicesClick);

textInput.addEventListener('keydown', addChoicesEnter);

btnGo.addEventListener('click', decideChoices);

btncloseModal.addEventListener('click', closeModal);


console.log(presets);

