function sendReport() {
  const from = Moment.moment()
    .subtract(1, "days")
    .format("YYYY-MM-DD");
  const to = Moment.moment()
    .subtract(1, "days")
    .format("YYYY-MM-DD");
  const metrics = "ga:pageViews";
  const options = {
    dimensions: "ga:pageTitle",
    "max-results": 5000
  };

  const gaReport = Analytics.Data.Ga.get(
    `ga:${PropertiesService.getScriptProperties().getProperty("GA_TABLE_ID")}`,
    from,
    to,
    metrics,
    options
  );

  Logger.log(gaReport);

  const dataTable = Charts.newDataTable()
    .addColumn(Charts.ColumnType.STRING, "Title")
    .addColumn(Charts.ColumnType.NUMBER, "PV");
  gaReport.rows
    .sort((a, b) => b[1] - a[1])
    .filter((_, i) => i < 10)
    .forEach(row => {
      dataTable.addRow(row);
    });
  const chart = Charts.newBarChart()
    .setDataTable(dataTable)
    .setTitle("前日PV上位10記事")
    .build();

  const imageFile = chart.getAs("image/png");

  const token = PropertiesService.getScriptProperties().getProperty(
    "SLACK_API_TOKEN"
  );
  const channelId = PropertiesService.getScriptProperties().getProperty(
    "SLACK_CHANNEL_ID"
  );

  UrlFetchApp.fetch("https://slack.com/api/files.upload", {
    method: "post",
    payload: {
      channels: channelId,
      file: imageFile,
      filename: "daily-pv-top-10.png",
      token: token
    }
  });
}
