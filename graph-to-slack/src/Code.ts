function sendReport() {
  const yesterday = Moment.moment()
    .subtract(1, "days")
    .format("YYYY-MM-DD");
  const twoDaysAgo = Moment.moment()
    .subtract(2, "days")
    .format("YYYY-MM-DD");
  const tableId = `ga:${PropertiesService.getScriptProperties().getProperty(
    "GA_TABLE_ID"
  )}`;
  const metrics = "ga:pageViews";
  const options = {
    dimensions: "ga:pageTitle",
    "max-results": 5000
  };

  const gaReport = Analytics.Data.Ga.get(
    tableId,
    yesterday,
    yesterday,
    metrics,
    options
  );
  const gaReport2 = Analytics.Data.Ga.get(
    tableId,
    twoDaysAgo,
    twoDaysAgo,
    metrics,
    options
  );

  const dataTable = Charts.newDataTable()
    .addColumn(Charts.ColumnType.STRING, "Title")
    .addColumn(Charts.ColumnType.NUMBER, `${yesterday} pv`)
    .addColumn(Charts.ColumnType.NUMBER, `${twoDaysAgo} pv`);
  gaReport.rows
    .sort((a, b) => b[1] - a[1])
    .filter((_, i) => i < 10)
    .forEach(row => {
      const beforeRow = gaReport2.rows.filter(r => r[0] === row[0])[0];
      const beforeNumber = beforeRow ? beforeRow[1] || 0 : 0;
      dataTable.addRow([...row, beforeNumber]);
    });

  const chart = Charts.newBarChart()
    .setDataTable(dataTable)
    .setDimensions(800, 600)
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
