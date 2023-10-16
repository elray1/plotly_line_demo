var athletes;
var shooting_pct_by_season;
var shooting_pct_by_game;

// data in plot by season
function get_plot_data_shooting_pct_by_season () {
  const selectedPlayer = $('#selectPlayer').val();
  var data = Object.entries(shooting_pct_by_season)
    .filter(([k, v]) => k !== selectedPlayer)
    .map(
      ([k, v]) => {
        return {
          x: v.season,
          y: v.three_pt_pct,
          hovertext: k,
          hoverinfo: "x+y+text",
          type: "scatter",
          marker: {
            color: "grey",
            opacity: 0.3
          },
          opacity: 0.3
        }
      })
  
  if (selectedPlayer !== null) {
    data = data.concat(
      [{
        x: shooting_pct_by_season[selectedPlayer].season,
        y: shooting_pct_by_season[selectedPlayer].three_pt_pct,
        // hovertext: choices_select_player.getValue(true)[0],
        hovertext: selectedPlayer.value,
        hoverinfo: "x+y+text",
        type: "scatter",
        marker: {
            color: "#008348",
            opacity: 1
        },
        line: {
            width: 5
        },
        opacity: 1
      }]);
  }

  return data;
}

// data in plot by game
function get_plot_data_shooting_pct_by_game () {
  const selectedPlayer = $('#selectPlayer').val();
  if (selectedPlayer.value !== null) {
    var data = Object.entries(shooting_pct_by_game[selectedPlayer])
      .map(
        ([k, v]) => {
          return {
            x: v.game_num,
            y: v.three_pt_pct,
            name: k,
            hovertext: k,
            hoverinfo: "x+y+text",
            type: "scatter"
          }
        })
  } else {
    data = []
  }

  return data;
}

function get_plot_data() {
  const plot_by = $("#selectPlotBy").val();
  if (plot_by == "Season") {
    return get_plot_data_shooting_pct_by_season();
  } else {
    return get_plot_data_shooting_pct_by_game();
  }
}

function get_plot_layout() {
  return {
    title: "Shooting Proportion by " + $("#selectPlotBy").val(),
    showlegend: ($("#selectPlotBy").val() == "Game"),
    hoverlabel: {
      bgcolor: "white"
    },
    xaxis: {
      title: "Season"
    },
    yaxis: {
      title: "3 pt proportion",
      autorange: false,
      range: [0.0, 0.8]
    },
    height: 700
  };
}

function update_plot() {
  console.log('update plot');
  Plotly.react('plotProp', get_plot_data(), get_plot_layout());
}

function init() {
  $.getJSON("data/athletes.json", function(resp) {
    athletes = resp;
    var $select_player = $('#selectPlayer');
    
    for (var i = 0; i < athletes.length; i++) {
      $select_player.append($("<option></option>")
        .attr("value", athletes[i]).text(athletes[i]));
    }
    
    $select_player.val("Ray Allen (id 9)");
    
    const choices_select_player = new Choices(document.getElementById('selectPlayer'));
  });
  
  $.getJSON("data/shooting_pct_by_season.json", function(resp) {
    shooting_pct_by_season = resp;
    
    Plotly.newPlot('plotProp', get_plot_data(), get_plot_layout(), {scrollZoom: false});
  });
  
  $.getJSON("data/shooting_pct_by_game.json", function(resp) {
    shooting_pct_by_game = resp;
  });
  
  $('#selectPlayer, #selectPlotBy, #selectPlotSeason').on("change", update_plot)
}

$(document).ready(init);
