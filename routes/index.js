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


router.post('/generate', (req, res, next) => {
  data.rubySentence = '';
  if (req.body.sentence.length > 500) {return;}
  // 送信するデータを生成
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
    console.log("リクエストの前");
    let word, subword, katakana = '';
    xml2js.parseString(body, (err, callback) => {
      for (let i = 0, len = callback.ResultSet.Result[0].WordList[0].Word.length; i < len; i++) {
       word = callback.ResultSet.Result[0].WordList[0].Word[i];
       katakana = word.Surface.toString();
       // 数字やローマ字の場合
       if (!word.hasOwnProperty('Furigana')) {
        data.rubySentence += word.Surface;
      }
       // 助詞などのひらがなをスキップ
       else if (word.hasOwnProperty('Furigana') && word.Furigana[0] == word.Surface[0]) {
        data.rubySentence += word.Surface;
      }
       // SubWord(=送り仮名)がある場合
       else if (word.hasOwnProperty('SubWordList')) {
        for (let j = 0, len2 = word.SubWordList[0].SubWord.length; j < len2; j++) {
          subword = word.SubWordList[0].SubWord[j];
          if (subword.Furigana[0] == subword.Surface[0]) {
            data.rubySentence += subword.Surface;
          } else {
           data.rubySentence += ruby[0] + subword.Surface + ruby[1] + subword.Furigana + ruby[2];
         };
       };
     }
   // カタカナの場合
   else if (katakana.match(/^[\u30A0-\u30FF]+$/)) {
    data.rubySentence += word.Surface;
  }
  else {
   data.rubySentence += ruby[0] + word.Surface + ruby[1] + word.Furigana + ruby[2];
 };
};
});
  });
  wait = setInterval (() => {
    if (data.rubySentence !== '') {
      clearInterval(wait);
      console.log("リクエストの後 => " + data.rubySentence);
      res.redirect('/');
    }
  }, 500);
});

module.exports = router;

