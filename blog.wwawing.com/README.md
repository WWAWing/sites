# WWA Wing 開発ブログ

WWA Wing 開発ブログのソースコードです。

ブログは静的サイトとなっており、 [Gatsby](https://www.gatsbyjs.org/) を使用して生成ています。

## 開始方法

1.  **依存パッケージをインストールします。**
    ```shell
    npm install
    ```

2.  **開発サーバーを起動します。**
    `localhost:8000` でブログの動作を見ることができます。
    設定ファイル以外のソースファイルに変更が加わると、自動で反映されます。
    ```shell
    npm run develop
    ```
    また、 `localhost:8000/___graphql` で GraphQL の取得結果を確認することができます。

## コマンド
- `npm run build`: 本ブログをビルドします
- `npm run develop`: 開発サーバーを起動します
- `npm run format`: Prettier を使用してソースコードを整形します
