'use strict'
const generator = document.forms.generator;
const sentence = generator.sentence;
const guide = document.getElementById('guide');


sentence.addEventListener('input', () => {
  let restNum = 500 - sentence.value.length
  guide.textContent = 'ふりがなをつけたい文章（残り' + restNum + '字)';
});
