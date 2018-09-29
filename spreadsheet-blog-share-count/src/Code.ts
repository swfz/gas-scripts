// time, title, url, blogname, domain, published, hatena, twitter, pocket, facebook, weeklyViews, monthlyViews, totalViews
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

    sheet.getRange("K" + (i + 1)).setValue(weekPv);
    sheet.getRange("L" + (i + 1)).setValue(monthPv);
    sheet.getRange("M" + (i + 1)).setValue(totalPv);

    // 24時間に一回ソーシャルカウントリクエスト対象とする
    const hour = (new Date).getHours();
    if (i % hour !== 0) {
      return;
    }
    const hatenaBookmark = socialcount.hatena(url);
    sheet.getRange("G" + (i + 1)).setValue(hatenaBookmark.count);
    sheet.getRange("P" + (i + 1)).setValue(hatenaBookmark.comments.join(','));
    sheet.getRange("Q" + (i + 1)).setValue(hatenaBookmark.tags.join(','));

    const hatenaStar = socialcount.hatenaStar(url);
    sheet.getRange("N" + (i + 1)).setValue(hatenaStar.stars);
    sheet.getRange("O" + (i + 1)).setValue(hatenaStar.colored);

    sheet.getRange("H" + (i + 1)).setValue(socialcount.twitter(url));
    sheet.getRange("I" + (i + 1)).setValue(socialcount.pocket(url));
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