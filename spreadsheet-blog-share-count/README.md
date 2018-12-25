# spreadsheet blog-share-count

# dependencies
- GASのAnalyticsAPI
- social-count(GASのライブラリ)

# ScriptProperties
- HATENA_BLOG_URL

# Spreadsheet columns

## Sheet1

| 列 | column | description | Write From |
|:-|:-|:-|:-|
|A| time | Spreadsheetに記載された日時 | IFTTT |
|B| title | 記事タイトル | IFTTT |
|C| url | 記事URL | IFTTT |
|D| blogname | ブログの名前 | IFTTT |
|E| domain | ブログのドメイン | IFTTT |
|F| published | 公開日 | 関数 setSocialCount |
|G| hatena | はてぶ数 | 関数 setSocialCount |
|H| twitter | 記事をtweetされた数 | 関数 setSocialCount |
|I| pocket | pocketに貯められた数 | 関数 setSocialCount|
|J| facebook | Facebookでシェアされた数 | 関数 setSocialCount |
|K| weeklyViews | 週間のPV | 関数 setSocialCount |
|L| monthlyViews | 月間のPV | 関数 setSocialCount |
|M| totalViews | 累計のPV | 関数 setSocialCount |
|N| hatenaStar | はてなスター | 関数 setSocialCount |
|O| hatenaColoredStar | はてな色付きスター | 関数 setSocialCount |
|P| hatenaComments | はてぶの際のコメント | 関数 setSocialCount |
|Q| hatenaTags | はてぶの際のタグ | 関数 setSocialCount |

## status

データ取得時の各種カウント総数

| 列 | column | description | Write From |
|:-|:-|:-|:-|
|A| date | Spreadsheetに記載された日 | recordStatus |
|B| entries | 記事数 | recordStatus |
|C| subscribers | 購読者数 | recordStatus |
|D| hatena | はてぶ総数 | recordStatus |
|E| twitter | tweet総数 | recordStatus |
|F| pocket | pocket総数 | recordStatus |
|G| facebook | facebookシェア総数 | recordStatus |
|H| hatenaStar| はてなスター総数 | recordStatus |
|I| hatenaColoredStar| はてな色付きスター総数 | recordStatus |
