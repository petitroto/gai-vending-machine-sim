# 生成AIを使った自動販売機シミュレーター

このリポジトリは、CQ出版社の雑誌『Interface』2024年6月号の第２部第２章の記事で解説した自動販売機シミュレーターに関するファイルを提供するものです。

## ファイル一覧

* `prompt.txt` コード生成プロンプト
* `public/index.html` クライアント側プログラム
* `server.js` サーバー側プログラム
* `package.json` 依存ライブラリ定義ファイル
* `package-lock.json` 依存ライブラリ管理情報（npmコマンドが生成・更新する）
* `dot.env` 環境変数の設定ファイルのサンプル

### prompt.txt について

* 自動販売機シミュレーターのプログラムの生成に使ったプロンプトです。本誌記事のリスト１に対応します。
* 自動販売機シミュレーターを動かしてみるだけなら、このファイルは必要ありません。コード生成による開発手順を試してみたい方のために提供しています。
* 本誌記事のリスト１は、見やすくするためにプロンプトの一部（OpenAI APIの仕様の記述）を省略しましたが、このファイルは省略部分を含む完全版です。
* この内容をChatGPTに入力すると、`index.html`や`server.js`の元になるファイルを生成できます。ファイル内容全体を一度に入力するのではなく、最後の部分は何度かに分けて入力する必要があるので注意してください。

### index.htmlおよびserver.jsについて

* `prompt.txt`によって自動で生成したファイルを元に、不具合や不足機能を手動で修正して作ったプログラムです。
* 特に、`server.js`内に含まれる「自動販売機シミュレーターの頭脳となるシステムプロンプト」を差し替えてあります。このプロンプトは、本誌記事のリスト２に対応します。

## 動作環境

### PC

* Node.js 20.X (バージョン20.11.1で動作確認)
* Google Chrome (バージョン123で動作確認)

※OSは、macOS 14.2で動作確認していますが、WindowsやLinuxでも恐らく動作します。

※Webブラウザは、Fetch APIと、Web Speech APIが使えれば、Chrome以外でも動作するはずです。

### OpenAI API

* モデル `gpt-4-turbo-preview` 

※記事執筆時の最新モデルを利用しています。より新しいモデルでも動作すると思いますが、プロンプトの調整を必要とする可能性もあります。

## 起動方法

1. [Node.js](https://nodejs.org/)をインストールする
2. あなたの[OpenAI](https://openai.com/)のアカウントでAPIキーを発行する
3. このリポジトリをダウンロードして、ファイルを展開する
3. `dot.env` ファイルにAPIキーを記入して、ファイル名を `.env` にする
4. シェルで `npm i` と入力して、依存ライブラリをインストールする
5. `npm start` と入力して、サーバー側プログラムを起動する 
6. Webブラウザで http://localhost:3000 を開く

音声が再生されるので、音が聞こえるようにして試してください。

## 著者への連絡先

https://twitter.com/petitroto