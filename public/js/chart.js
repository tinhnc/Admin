var dataSet = anychart.data.set([
  ["Tháng 1", "1120"],
  ["Tháng 2", "720"],
  ["Tháng 3", "404"],
  ["Tháng 4", "190"],
  ["Tháng 5", "15"],
  ["Tháng 6", "10"],
]);

function drawChart() {
  var chart = anychart.line();

  // set chart padding
  chart.padding([10, 20, 5, 20]);

  // turn on chart animation
  chart.animation(true);

  // turn on the crosshair
  chart.crosshair(true);

  // set chart title text settings
  chart.title("Doanh thu");

  // set y axis title
  //chart.yAxis().title('Doanh thu');

  // create logarithmic scale
  var logScale = anychart.scales.log();
  logScale.minimum(100000).maximum(50000000);

  // set scale for the chart, this scale will be used in all scale dependent entries such axes, grids, etc
  chart.yScale(logScale);

  // create data set on our data,also we can pud data directly to series

  // map data for the first series,take value from first column of data set
  var firstSeriesData = dataSet.mapAs({ x: 0, value: 1 });

  // temp variable to store series instance
  var series;

  // setup first series
  series = chart.line(firstSeriesData);
  //series.name('Review about the product');
  // enable series data labels
  series.labels().enabled(true).anchor("left-bottom").padding(5);
  // enable series markers
  series.markers(true);

  // turn the legend on
  chart.legend().enabled(true).fontSize(13).padding([0, 0, 20, 0]);

  // set container for the chart and define padding
  chart.container("container");
  // initiate chart drawing
  chart.draw();
}

//anychart.onDocumentReady(drawChart);

const years = $("#year").val();

$(".select-filter").change(function () {
  const year = $(".select-filter :selected").text();
  const filter = $("input[name='filter-group']:checked").val();
  $("#alert").show();
  callAjax(year, filter);
});

/*	$('input[type=radio][name=filter-group]').change(function() {
			const year = $(".select-filter :selected").text();
			const filter = $("input[name='filter-group']:checked").val();
			callAjax(year, filter);
		}); */

function callAjax(year, filter) {
  // call ajax
  $.ajax({
    url: "/api/chart/filter-month",
    type: "GET",
    data: {
      year: year,
      filter: filter,
      years: years || [],
    },
    success: function (data) {
      console.log(data);
      if (data.length > 1) {
        let total = 0;
        for (let i = 0; i < data.length; i++) {
          changeDataset(data[i].year, data[i].total, i);
          total += data[i].total;
        }
        dataSet.oc.push(["Tổng", total]);
      } else {
        dataSet.oc = [[], []];
        changeDataset(data.year, data.total, 0);
      }
      $("#container").empty();
      anychart.onDocumentReady(drawChart);
      $("#alert").hide();
    },
  });
}

function changeDataset(year, value, index) {
  //dataSet.oc = [[],[]];
  dataSet.oc[index][0] = `Năm ${year}`;
  dataSet.oc[index][1] = `${value}`;
}

$(document).ready(function () {
  const year = $(".select-filter :selected").text();
  const filter = $("input[name='filter-group']:checked").val();
  dataSet.oc = [[], []];
  $("#alert").show();
  callAjax(year, filter);
});
