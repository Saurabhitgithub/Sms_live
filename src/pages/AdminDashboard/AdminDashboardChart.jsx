import React from "react";
import { Line, Bar, Pie, Polar, Doughnut } from "react-chartjs-2";

export const TotalActiveUser = ({ data }) => {
  return (
    <Doughnut
      data={data}
      options={{
        legend: {
          display: false,
        },
        rotation: 1,
        cutoutPercentage: 40,
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
      }}
    />
  );
};

export const UserDistributionChart = ({ data }) => {
  return (
    <Doughnut
      data={data}
      options={{
        plugins: {
          datalabels: {
            color: "#fff",
            anchor: "end",
            align: "start",
            offset: -10,
            borderWidth: 2,
            borderColor: "#fff",
            borderRadius: 25,
            backgroundColor: (context) => context.dataset.backgroundColor,
            font: {
              weight: "bold",
              size: "14",
            },
            formatter: (value, context) => {
              const label = context.chart.data.labels[context.dataIndex];
              return `${label}: ${value} BTC`;
            },
          },
        },
        // layout: {
        //   padding: {
        //     left: 10,
        //     right: 1, // Adjust the padding to make space for labels
        //     top: 10,
        //     bottom: 10,
        //   },
        // },
        rotation: 1,
        cutoutPercentage: 40,
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
        legend: {
          display: false,
          position: "right",
          labels: {
            fontColor: "#333",
            usePointStyle: true,
          },
        },
      }}
    />
  );
};

export const LastMonthRevenue = ({ data, stacked }) => {
  return (
    <Bar
      data={data}
      options={{
        legend: {
          display: false,
          labels: {
            boxWidth: 30,
            padding: 20,
            fontColor: "#6783b8",
          },
        },
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
                callback: (value) => {
                  // Ensure the tick values are displayed as integers
                  return Number.isInteger(value) ? value : "";
                },
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

export const TotalRevenueChart = ({ data, legend }) => {
  return (
    <Line
      className="line-chart"
      data={data}
      options={{
        legend: {
          display: legend,
          labels: {
            boxWidth: 12,
            padding: 20,
            fontColor: "#6783b8",
          },
        },
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
              ticks: {
                beginAtZero: false,
                fontSize: 12,
                fontColor: "#9eaecf",
                padding: 10,
              },
              gridLines: {
                tickMarkLength: 0,
              },
            },
          ],
          xAxes: [
            {
              display: true,
              ticks: {
                fontSize: 12,
                fontColor: "#9eaecf",
                source: "auto",
                padding: 5,
              },
              gridLines: {
                color: "transparent",
                tickMarkLength: 10,
                offsetGridLines: true,
              },
            },
          ],
        },
      }}
    />
  );
};

export const TotalSubcriberPerPlan = ({ data, stacked }) => {
  return (
    <Bar
      data={data}
      options={{
        legend: {
          display: false,
          labels: {
            boxWidth: 30,
            padding: 20,
            fontColor: "#6783b8",
          },
        },
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
                callback: (value) => {
                  // Ensure the tick values are displayed as integers
                  return Number.isInteger(value) ? value : "";
                },
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

export const TotalLeadsPerInvoiceChart = ({ data, stacked }) => {
  return (
    <Bar
      data={data}
      options={{
        legend: {
          display: false,
          labels: {
            boxWidth: 30,
            padding: 20,
            fontColor: "#6783b8",
          },
        },
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
                callback: (value) => {
                  // Ensure the tick values are displayed as integers
                  return Number.isInteger(value) ? value : "";
                },
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

export const TotalInvoiceChart = ({ data, stacked }) => {
  return (
    <Bar
      data={data}
      options={{
        legend: {
          display: false,
          labels: {
            boxWidth: 30,
            padding: 20,
            fontColor: "#6783b8",
          },
        },
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
                callback: (value) => {
                  // Ensure the tick values are displayed as integers
                  return Number.isInteger(value) ? value : "";
                },
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

export const TotalPaymentsChart = ({data,legend}) =>{
  return (
    <Line
      className="line-chart"
      data={data}
      options={{
        legend: {
          display: legend,
          labels: {
            boxWidth: 12,
            padding: 20,
            fontColor: "#6783b8",
          },
        },
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
              ticks: {
                beginAtZero: false,
                fontSize: 12,
                fontColor: "#9eaecf",
                padding: 10,
              },
              gridLines: {
                tickMarkLength: 0,
              },
            },
          ],
          xAxes: [
            {
              display: true,
              ticks: {
                fontSize: 12,
                fontColor: "#9eaecf",
                source: "auto",
                padding: 5,
              },
              gridLines: {
                color: "transparent",
                tickMarkLength: 10,
                offsetGridLines: true,
              },
            },
          ],
        },
      }}
    />
  );
}

export const TotalPaidInvoiceChart = ({data,legend}) =>{
  return (
    <Line
      className="line-chart"
      data={data}
      options={{
        legend: {
          display: legend,
          labels: {
            boxWidth: 12,
            padding: 20,
            fontColor: "#6783b8",
          },
        },
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
              ticks: {
                beginAtZero: false,
                fontSize: 12,
                fontColor: "#9eaecf",
                padding: 10,
              },
              gridLines: {
                tickMarkLength: 0,
              },
            },
          ],
          xAxes: [
            {
              display: true,
              ticks: {
                fontSize: 12,
                fontColor: "#9eaecf",
                source: "auto",
                padding: 5,
              },
              gridLines: {
                color: "transparent",
                tickMarkLength: 10,
                offsetGridLines: true,
              },
            },
          ],
        },
      }}
    />
  );
}