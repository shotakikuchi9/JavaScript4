'use strict';
const api_URL = 'https://opentdb.com/api.php?amount=10&type=multiple';
const questionNum = document.getElementById('questionNum');
const question = document.getElementById('question');
const choices = document.getElementById('choices');
const btn = document.getElementById('btn');
const category = document.getElementById('category');
const difficulty = document.getElementById('difficulty');
let quizSet = [];
let currentNum = 0;
let score = 0;
// クイズ取得
const fetchQuizData = () => {
  question.textContent = '少々お待ちください';
  questionNum.textContent = '取得中';
  btn.hidden = true;
  fetch(api_URL)
  .then(response => response.json())
  .then((data) => {
    quizSet.push(...data.results);
    setQuiz();
  });
};
// ボタンクリック
btn.addEventListener('click', () => {
  if (btn.textContent === '開始') {
    fetchQuizData();
  } else if (btn.textContent === 'ホームに戻る') {
    quizSet = [];
    currentNum = 0;
    score = 0;
    questionNum.textContent = 'ようこそ';
    question.textContent = '以下のボタンをクリック';
    btn.textContent = '開始';
  }
});
// 問題表示
class Quiz {
  constructor(question, category, difficulty, currentNum) {
    this.question = question;
    this.category = category;
    this.difficulty = difficulty;
    this.currentNum = currentNum;
    }
  show() { 
    question.textContent = this.question;
    category.textContent = this.category;
    difficulty.textContent = this.difficulty;
    questionNum.textContent = this.currentNum;
  }
}
const setQuiz = () => {
  const newQuiz =  new Quiz(quizSet[currentNum].question, `[ジャンル]${quizSet[currentNum].category}`, `[難易度]${quizSet[currentNum].difficulty}`, `問題${currentNum+1}`);
  newQuiz.show();
  setAnswers();
}
// 選択肢表示
const setAnswers = () => {
  while(choices.firstChild) {
    choices.removeChild(choices.firstChild);
  };
  const answers = [
    quizSet[currentNum].correct_answer,
    ...quizSet[currentNum].incorrect_answers
  ];
  const shuffledAnswers = shuffle(answers);
  shuffledAnswers.forEach((shuffledanswer) => {
    const li = document.createElement('li');
    const selectButton = document.createElement('button');
    selectButton.textContent = shuffledanswer;
    li.appendChild(selectButton);
    li.addEventListener('click', () => {
      checkAnswer(li);
    })
    choices.appendChild(li);
  });
}
// シャッフル機能
const shuffle = (arr) => {
  for (let i = arr.length-1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[j], arr[i]] = [arr[i], arr[j]];
  }
  return arr;
}
// 解答正誤判定
const checkAnswer = (li) => {
  if (li.textContent === quizSet[currentNum].correct_answer) {
    score++;
  };
  currentNum++;
  if(currentNum === quizSet.length) {
    finishQuiz();
  } else {
    setQuiz();
  }
}
// Quiz終了時
const finishQuiz = () => {
  btn.hidden = false;
  while(choices.firstChild) {
    choices.removeChild(choices.firstChild);
  }
  category.textContent = '';
  difficulty.textContent = '';
  questionNum.textContent = `あなたの正答数は${score}です！！`
  btn.textContent = 'ホームに戻る';
  question.textContent = 'もう一度チャレンジしたい場合は以下をクリック！'
}