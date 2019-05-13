export default class Game {
  constructor({ divId, timerId, startButtonId }) {
    this.initVariables({ divId, timerId, startButtonId });
    this.initGameField();
  }

  initGameField() {
    for (let i = 0; i < 16; i += 1) {
      const el = Game.generateItemSrc(i);
      this.items.push(el);
      this.gameDiv.appendChild(el);
      el.addEventListener('click', this.clickItem.bind(this, el));
    }
    this.startButton.addEventListener('click', this.startGame.bind(this));
  }

  clickItem(el) {
    if (!this.canClickOnBlock(el)) return false;
    const num = Number(el.dataset.num);
    const pair = this.findPair(num);
    if (!this.clickedEl) {
      this.clickedEl = el;
      el.style.backgroundColor = pair.color;
    } else if (Game.isInPair(pair, this.clickedEl.dataset.num)) {
      this.clickedEl = false;
      this.setGuessedPair(pair);
      this.increaseGuessedPairs();
    } else {
      this.resetClickedEl();
    }
  }

  resetClickedEl() {
    this.clickedEl.style.backgroundColor = 'white';
    this.clickedEl = false;
  }

  setGuessedPair(pair) {
    const { num1, num2 } = pair;
    [num1, num2].forEach((num) => {
      const element = this.getItemByNum(num);
      element.style.backgroundColor = pair.color;
      element.dataset.guessed = true;
    });
  }

  increaseGuessedPairs() {
    this.guessed += 1;
    if (this.guessed === this.totalPairs) {
      this.endGame();
    }
  }

  getItemByNum(num) {
    return this.items[num];
  }

  canClickOnBlock(el) {
    return !(!this.isActive || el.dataset.guessed || el === this.clickedEl);
  }

  findPair(num) {
    const result = this.pairs.filter(el => el.num1 === num || el.num2 === num);
    if (result.length > 0) {
      return result[0];
    }
    return false;
  }

  static isInPair(pair, num) {
    const number = Number(num);
    return pair.num1 === number || pair.num2 === number;
  }

  static generateItemSrc(id) {
    const el = document.createElement('div');
    el.classList.add('item');
    el.dataset.num = id;
    return el;
  }

  updateTimer() {
    const currentTime = (new Date()).getTime();
    const differentTimes = currentTime - this.startTime;
    this.timerDiv.innerText = String(Game.getFormattedTime(differentTimes));
  }

  static getFormattedTime(diff) {
    const m = Math.floor(diff / 1000 / 60).toString().padStart(2, '0');
    const s = Math.floor((diff / 1000) % 60).toString().padStart(2, '0');
    const msec = diff % 1000;
    return `${m}:${s}.${msec}`;
  }

  startGame() {
    if (this.isActive) return false;
    this.isActive = true;
    this.startTime = (new Date()).getTime();
    this.updateTimer.bind(this);
    this.updateInterval = setInterval(this.updateTimer.bind(this), 100);
    return 1;
  }

  endGameMessage() {
    return `Вы выиграли!\nЗатраченное время: ${this.timerDiv.innerText}`;
  }

  endGame() {
    clearInterval(this.updateInterval);
    alert(this.endGameMessage());
  }

  initVariables({ divId, timerId, startButtonId }) {
    this.gameDiv = document.getElementById(divId);
    this.timerDiv = document.getElementById(timerId);
    this.startButton = document.getElementById(startButtonId);
    this.isActive = false;
    this.clickedEl = false;
    this.guessed = 0;
    this.colors = ['#b641a6', '#2528b8', '#af47fe', '#a2d1ea', '#c1244b', '#2d325b', '#ce432f', '#9109fe'];
    this.pairs = [];
    this.items = [];
    this.totalPairs = 8;
    this.initPairs();
  }

  initPairs() {
    const nums = Array.from(Array(16).keys());
    nums.sort(() => 0.5 - Math.random());
    for (let i = 0; i < 8; i += 1) {
      this.pairs.push({
        num1: Number(nums.pop()),
        num2: Number(nums.shift()),
        color: this.colors.pop(),
      });
    }
  }
}
