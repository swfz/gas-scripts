function setSocialCount(): void {
  Logger.log("Start!!");
  const sheet = SpreadsheetApp.getActiveSpreadsheet();
  const data = sheet.getDataRange().getValues();
  const length = sheet.getLastRow();
  const reporter = new GaReport();

  const weeklyReport = reporter.weeklyReport();
  const monthlyReport = reporter.recent30DaysReport();
  const totalReport = reporter.totalReport();

  data.forEach((row, i) => {
    // ヘッダーは除外
    if (i === 0) {
      return;
    }

    const title = row[1];
    const url = row[2];

    if (url == '') {
      return;
    }
    const path = url.match(/entry.*/i)[0];

    const weekPv = reporter.fixPathPv(weeklyReport.rows, path);
    const monthPv = reporter.fixPathPv(monthlyReport.rows, path);
    const totalPv = reporter.fixPathPv(totalReport.rows, path);

    const index = i + 1;

    sheet.getRange(`K${index}`).setValue(weekPv);
    sheet.getRange(`L${index}`).setValue(monthPv);
    sheet.getRange(`M${index}`).setValue(totalPv);

    // 24時間に一回ソーシャルカウントリクエスト対象とする
    const hour = (new Date).getHours();
    if (i % hour !== 0) {
      return;
    }

    sheet.getRange(`F${index}`).setValue(toDateStr(sheet.getRange(`C${index}`).getValue()));

    const hatenaBookmark = socialcount.hatena(url);
    sheet.getRange(`G${index}`).setValue(hatenaBookmark.count);
    sheet.getRange(`P${index}`).setValue(hatenaBookmark.comments.join(","));
    sheet.getRange(`Q${index}`).setValue(hatenaBookmark.tags.join(","));

    const hatenaStar = socialcount.hatenaStar(url);
    sheet.getRange(`N${index}`).setValue(hatenaStar.stars);
    sheet.getRange(`O${index}`).setValue(hatenaStar.colored);

    sheet.getRange(`H${index}`).setValue(socialcount.twitter(url));
    sheet.getRange(`I${index}`).setValue(socialcount.pocket(url));
    // sheet.getRange("J" + (i + 1)).setValue(socialcount.facebook(url));
  });
  Logger.log("Finish!!!");
}

function toDateStr(url: string): string {
  const matched = url.match(/.*entry\/(\d{4})\/(\d{2})\/(\d{2})/i);
  return `${matched[1]}-${matched[2]}-${matched[3]}`;
}

export interface IGaReportOptions {
  dimensions?: string;
  "max-results"?: number;
}

class GaReport {
  private tableId: string;
  private metrics: string;
  private options: IGaReportOptions;

  constructor() {
    this.tableId = "ga:79581391";
    this.metrics = "ga:pageViews";
    this.options = {
      "dimensions": "ga:pagePath",
      "max-results": 5000,
    };
  }

  public weeklyReport() {
    const from = Moment.moment().subtract(8, "days").format("YYYY-MM-DD");
    const to = Moment.moment().subtract(1, "days").format("YYYY-MM-DD");

    return this.getReport(from, to);
  }

  public recent30DaysReport() {
    const from = Moment.moment().subtract(31, "days").format("YYYY-MM-DD");
    const to = Moment.moment().subtract(1, "days").format("YYYY-MM-DD");

    return this.getReport(from, to);
  }

  public totalReport() {
    const from = "2013-01-01";
    const to = Moment.moment().subtract(1, "days").format("YYYY-MM-DD");

    return this.getReport(from, to);
  }

  public fixPathPv(rows: any[], path: string): number {
    return rows.filter(_ => {
       return _[0].match(path);
     }).reduce((acc , cur) => {
       const pv = parseInt(cur[1]);
       return acc + pv;
    }, 0);
  }

  private getReport(from: string, to: string): any {
    return Analytics.Data.Ga.get(
      this.tableId,
      from,
      to,
      this.metrics,
      this.options,
    );
  }
}

function recordStatus(): void {
  const recorder = new StatusRecorder();
  const status = recorder.getStatus();
  const social = recorder.calcSocialCounts();
  const row = [
    Moment.moment().subtract(1, "days").format("YYYY-MM-DD"),
    status.entries,
    status.subscribers,
    social.hatena,
    social.twitter,
    social.pocket,
    social.facebook,
    social.hatenaStar,
    social.hatenaColoredStar
  ];

  Logger.log(row);

  recorder.updateOrCreateStatus(row);
}

export interface IStatus{
  entries: number;
  subscribers: number;
}

export interface ISocialCounts {
  hatena: number;
  twitter: number;
  pocket: number;
  facebook: number;
  hatenaStar: number;
  hatenaColoredStar: number;
}

class StatusRecorder {
  private book: any;
  constructor(){
    this.book = SpreadsheetApp.getActiveSpreadsheet();
  }

  calcSocialCounts(): ISocialCounts {
    const sheet = this.book.getSheetByName("Sheet1");
    return sheet.getRange('G2:O').getValues().reduce((acc, cur) => {
      acc.hatena += parseInt(cur[0] || 0);
      acc.twitter += parseInt(cur[1] || 0);
      acc.pocket += parseInt(cur[2] || 0);
      acc.facebook += parseInt(cur[3] || 0);
      acc.hatenaStar += parseInt(cur[7] || 0);
      acc.hatenaColoredStar += parseInt(cur[8] || 0);
      return acc;
    }, {
      hatena: 0,
      twitter: 0,
      pocket: 0,
      facebook: 0,
      hatenaStar: 0,
      hatenaColoredStar: 0
    });
  }

  getStatus(): IStatus {
    const blogUrl = PropertiesService.getScriptProperties().getProperty("HATENA_BLOG_URL")
    const content = UrlFetchApp.fetch(`${blogUrl}/about`).getContentText();
    const entries = content.match(/(\d+) 記事/)[1];
    const subscribers = content.match(/(\d+) 人/)[1];

    return {
      entries: entries,
      subscribers: subscribers
    };
  }

  updateOrCreateStatus(row): void {
    const sheet = this.book.getSheetByName("status");

    const data = sheet.getDataRange().getValues();
    const rowIndex = data.reduce((acc,cur,i) => {
      if(Moment.moment(cur[0]).format("YYYY-MM-DD") === row[0]) {
        acc = i+1;
      }
      return acc;
    },null);

    if (rowIndex !== null) {
      sheet.getRange(`A${rowIndex}:C${rowIndex}`).setValues([row])
    }
    else {
      sheet.appendRow(row);
    }
  }
}
