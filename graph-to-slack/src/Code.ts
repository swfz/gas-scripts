function sendReport() {
  const data = Charts.newDataTable()
    .addColumn(Charts.ColumnType.STRING, "Month")
    .addColumn(Charts.ColumnType.NUMBER, "In Store")
    .addColumn(Charts.ColumnType.NUMBER, "Online")
    .addRow(["January", 10, 1])
    .addRow(["February", 12, 1])
    .addRow(["March", 20, 2])
    .addRow(["April", 25, 3])
    .addRow(["May", 30, 4])
    .build();

  const chart = Charts.newAreaChart()
    .setDataTable(data)
    .setStacked()
    .setRange(0, 40)
    .setTitle("Sales per Month")
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
      token: token,
      file: imageFile,
      filename: "graph.png",
      channels: channelId
    }
  });
}
