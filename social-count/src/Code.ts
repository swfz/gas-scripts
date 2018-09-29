function hatena(url: string): number {
  const apiUrl = "http://b.hatena.ne.jp/entry/jsonlite/?url=";
  const requestUrl = `${apiUrl}${url}`;
  const res = UrlFetchApp.fetch(requestUrl);
  if (res != "null") {
    return JSON.parse(res)['count'];
  }
  return 0;
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
