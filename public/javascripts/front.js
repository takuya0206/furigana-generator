'use strict'
const generator = document.forms.generator;
const sentence = generator.sentence;
const guide = document.getElementById('guide');
const showExample= document.getElementById('showExample');
const frame = document.getElementById('frame');

sentence.addEventListener('input', () => {
  let restNum = 500 - sentence.value.length
  guide.textContent = 'ふりがなをつけたい文章（残り' + restNum + '字)';
});

showExample.addEventListener('click', () => {
  let result = document.getElementById('result');
  console.log(result.value);
  frame.innerHTML = result.value;
});
