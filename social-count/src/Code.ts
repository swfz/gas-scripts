export interface IHatenaBookmark {
  count: number;
  comments: string[];
  tags: string[];
}

function hatena(url: string): IHatenaBookmark {
  const apiUrl = "http://b.hatena.ne.jp/entry/jsonlite/?url=";
  const requestUrl = `${apiUrl}${url}`;
  const res = UrlFetchApp.fetch(requestUrl);

  const result = {
    comments: [],
    count: 0,
    tags: [],
  } as IHatenaBookmark;

  if (res != "null") {
    const json = JSON.parse(res);
    result.count = json.count;
    result.comments = json.bookmarks.map(_ => _.comment).filter(_ => _ != "");
    result.tags = json.bookmarks.reduce((arr, cur) => arr.concat(cur.tags), []);
  }
  return result;
}

export interface IHatenaStar {
  stars: number;
  colored: number;
}
function hatenaStar(url: string): IHatenaStar {
  const apiUrl = "http://s.hatena.com/entry.json?uri=";
  const requestUrl = `${apiUrl}${url}`;
  const res = UrlFetchApp.fetch(requestUrl);

  const result = {
    colored: 0,
    stars: 0,
  } as IHatenaStar;

  if (res != "null") {
    const entry = JSON.parse(res)["entries"][0];
    if (entry && entry["stars"]) {
      result.stars = entry.stars.length;
    }
    if (entry && entry["colored_stars"]) {
      result.colored = entry.colored_stars.reduce((acc, cur) => {
        const starsByColor = cur.stars.reduce((p, c) => p.count + c.count);
        return acc + starsByColor;
      }, 0);
    }
  }
  return result;
}

function twitter(url: string): number {
  const apiUrl = "http://jsoon.digitiminimi.com/twitter/count.json?url=";
  const requestUrl = `${apiUrl}${url}`;
  const res = UrlFetchApp.fetch(requestUrl);

  if (res != 'null') {
    return JSON.parse(res)['count'];
  }
  return 0;
}

function facebook(url: string): number {
  const apiUrl = "http://graph.facebook.com/?id=";
  const requestUrl = `${apiUrl}${url}`;
  const res = UrlFetchApp.fetch(requestUrl);

  if (res != 'null') {
    return JSON.parse(res)['share']['share_count'];
  }
  return 0;
}

function pocket(url: string): number {
  const baseUrl = "http://widgets.getpocket.com/v1/button?v=1&count=vertical&url=";
  const requestUrl = `${baseUrl}${url}&src=${url}`;
  const res = UrlFetchApp.fetch(requestUrl);

  if (res === 'null') {
    return 0;
  }

  const html = res.getContentText();
  const doc = XmlService.parse(html);
  const childElements = doc.getRootElement().getDescendants();
  const countElements = childElements.filter(_ => {
    const element = _.asElement();
    if (element == null){
      return false;
    }
    const idAttr = element.getAttribute("id");
    if (idAttr !== null && idAttr.getValue() === "cnt"){
      return true;
    }
    return false;
  });

  if (countElements.length === 0){
    return 0;
  }

  const count = countElements[0].getValue();

  return parseInt(count);
}
