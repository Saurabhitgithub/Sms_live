import { Bar } from "react-chartjs-2";

export const UserManagementReportChart = ({ data, stacked }) => {
  return (
    <Bar
      data={data}
      options={{
        legend: {
          display: true,
          labels: {
            boxWidth: 15,
            padding: 20,
            fontColor: "#6783b8",
          },
        },
        indexAxis: "x", // Set indexAxis to 'x' for horizontal
        maintainAspectRatio: false,
        tooltips: {
          enabled: true,
          backgroundColor: "#eff6ff",
          titleFontSize: 13,
          titleFontColor: "#6783b8",
          titleMarginBottom: 6,
          bodyFontColor: "#9eaecf",
          bodyFontSize: 12,
          bodySpacing: 4,
          yPadding: 10,
          xPadding: 10,
          footerMarginTop: 0,
          displayColors: false,
        },
        scales: {
          yAxes: [
            {
              display: true,
              stacked: stacked ? true : false,
              ticks: {
                beginAtZero: true,
                fontSize: 12,
                fontColor: "#9eaecf",
                padding: 5,
              },
              gridLines: {
                tickMarkLength: 0,
              },
            },
          ],
          xAxes: [
            {
              display: true,
              stacked: stacked ? true : false,
              ticks: {
                fontSize: 12,
                fontColor: "#9eaecf",
                source: "auto",
                padding: 5,
              },
              gridLines: {
                color: "transparent",
                tickMarkLength: 10,
                zeroLineColor: "transparent",
              },
            },
          ],
        },
      }}
    />
  );
};


export const UserSubcriptionReportChart = ({ data, stacked }) => {
  return (
    <Bar
      data={data}
      options={{
        legend: {
          display: true,
          labels: {
            boxWidth: 15,
            padding: 20,
            fontColor: "#6783b8",
          },
        },
        indexAxis: "x", // Set indexAxis to 'x' for horizontal
        maintainAspectRatio: false,
        tooltips: {
          enabled: true,
          backgroundColor: "#eff6ff",
          titleFontSize: 13,
          titleFontColor: "#6783b8",
          titleMarginBottom: 6,
          bodyFontColor: "#9eaecf",
          bodyFontSize: 12,
          bodySpacing: 4,
          yPadding: 10,
          xPadding: 10,
          footerMarginTop: 0,
          displayColors: false,
        },
        scales: {
          yAxes: [
            {
              display: true,
              stacked: stacked ? true : false,
              ticks: {
                beginAtZero: true,
                fontSize: 12,
                fontColor: "#9eaecf",
                padding: 5,
              },
              gridLines: {
                tickMarkLength: 0,
              },
            },
          ],
          xAxes: [
            {
              display: true,
              stacked: stacked ? true : false,
              ticks: {
                fontSize: 12,
                fontColor: "#9eaecf",
                source: "auto",
                padding: 5,
              },
              gridLines: {
                color: "transparent",
                tickMarkLength: 10,
                zeroLineColor: "transparent",
              },
            },
          ],
        },
      }}
    />
  );
};











