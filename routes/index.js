const express = require('express');
const router = express.Router();
const config = require('../config');
const request = require('request');
const xml2js = require('xml2js');
const ruby = ['<ruby>','<rt>','</rt></ruby>'];
const data = {rubySentence : ''};


/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', {
    title: '振り仮名ジェネレーター',
    result: data.rubySentence
  });
});

// 送信するデータを生成
router.post('/generate', (req, res, next) => {
  let options = {
    url: config.API_URL,
    headers: {
      'User-Agent': 'Yahoo AppID: ' + config.appid,
    },
    form: {
      sentence : req.body.sentence
    }
  };
  // apiにリクエストを送り、callbackを処理
  request.post(options, (error, res, body) => {
    let word, subword = '';
    data.rubySentence = '';
    xml2js.parseString(body.toString(), (err, array) => {
      for (let i = 0, len = array.ResultSet.Result[0].WordList[0].Word.length; i < len; i++) {
       word = array.ResultSet.Result[0].WordList[0].Word[i];
       // 送り仮名がある場合の対応
       if (word.hasOwnProperty('SubWordList')) {
        for (let j = 0, len2 = word.SubWordList[0].SubWord.length; j < len2; j++) {
          subword = word.SubWordList[0].SubWord[j];
          // ひらがなの振り仮名はスキップ
          if (subword.Furigana[0] == subword.Surface[0] || subword.Furigana[0] == undefined ) {
            data.rubySentence += subword.Surface;
          } else {
           data.rubySentence += ruby[0] + subword.Surface + ruby[1] + subword.Furigana + ruby[2];
         };
       };
     };
      // 送り仮名なしの場合
      if (!word.hasOwnProperty('SubWordList')) {
      // 念のため、ひらがなをケア
      if (word.Furigana[0] == word.Surface[0] || word.Furigana[0] == undefined) {
        data.rubySentence += word.Surface;
      } else {
       data.rubySentence += ruby[0] + word.Surface + ruby[1] + word.Furigana + ruby[2];
     };
   };
 };
});
console.log('Requestの中 => ' + data.rubySentence);

  });
  // ここがうまく動かない？
  console.log('Requestの外 => ' + data.rubySentence);
  res.redirect('/');
});

module.exports = router;

