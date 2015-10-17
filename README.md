# server-for-getimagedata

- [$.getImageData](http://www.maxnov.com/getimagedata/) を使用するために必要なサーバ
    - 指定されたURLの画像をbase64に変換し、JSONP形式で返します
- node.js を使用しています
- heroku で動かすこともできます

## ローカルで動かす

もし node.js をインストールしていなければインストールします。mac なら

```sh
$ brew install node
```

でインストールできます。また、画像処理用にimagemagick(もしくはGraphicsMagick)が必要です。これもインストールしていなければインストールします。

```sh
$ brew install imagemagick
```

その後次のようにしてサーバを立ち上げます。


```sh
$ git clone https://github.com/willnet/server-for-getimagedata.git
$ cd server-for-getimagedata
$ npm install
$ npm start
```

`http://localhost:5000/?url=画像のURL&callback=コールバック用の関数名` でアクセスできます。ちゃんと動いているかどうか、適当な画像のURLとコールバック名を指定して試してみると良いでしょう。


## Deploying to Heroku

```
$ heroku create
$ git push heroku master
$ heroku open
```
