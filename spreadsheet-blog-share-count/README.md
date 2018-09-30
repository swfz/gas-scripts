# spreadsheet blog-share-count

# dependencies
- GASのAnalyticsAPI
- social-count(GASのライブラリ)

# Spreadsheet columns

| 列 | column | description | Write From |
|:-|:-|:-|:-|
|A| time | Spreadsheetに記載された日時 | IFTTT |
|B| title | 記事タイトル | IFTTT |
|C| url | 記事URL | IFTTT |
|D| blogname | ブログの名前 | IFTTT |
|E| domain | ブログのドメイン | IFTTT |
|F| published | 公開日 | 関数 toDataStr |
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
