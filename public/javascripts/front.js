'use strict'
const generator = document.forms.generator;
const sentence = generator.sentence;
const guide = document.getElementById('guide');
const showExample= document.getElementById('showExample');
const frame = document.getElementById('frame');

sentence.addEventListener('input', () => {
  let restNum = 500 - sentence.value.length
  if (sentence.value.length > 500) {
    guide.textContent = "※文字数が多すぎます！"
    generator.elements[1].disabled = true;
  };
  if (sentence.value.length > 0 && sentence.value.length <= 500) {
    guide.textContent = 'ふりがなをつけたい文章（残り' + restNum + '字)';
    generator.elements[1].disabled = false;
  };
  if (sentence.value.length === 0) {
    guide.textContent = 'ふりがなをつけたい文章（残り' + restNum + '字)';
  }
});

showExample.addEventListener('click', () => {
  let result = document.getElementById('result');
  console.log(result.value);
  frame.innerHTML = result.value;
});
