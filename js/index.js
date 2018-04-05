$(function() {
  var currentLatitude;
  var currentLongitude;

  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(getCoordinates);
    } else {
      alert("4");
    }
  }
  function getCoordinates(position) {
    currentLatitude = position.coords.latitude;
    currentLongitude = position.coords.longitude;

    let apiData;
    let images = {
      thunderstorm: "http://cdn.wallpapersafari.com/89/32/3l8I2B.jpg",
      rainy: "https://media.giphy.com/media/dI3D3BWfDub0Q/giphy.gif",
      snowy:
        "http://ognature.com/wp-content/uploads/2017/04/winter-snow-clouds-snowy-sunset-mountains-cottage-landscape-sky-purple-splendor-nature-time-hd-iphone-wallpaper-1366x768.jpg",
      foggy:
        "http://www.imgbase.info/images/safe-wallpapers/photography/landscape/41375_landscape_foggy_landscape.jpg",
      clear:
        "https://s-media-cache-ak0.pinimg.com/originals/58/7b/b9/587bb9b747817c22de6ed4bee5c55ba9.gif",
      cloudy:
        "http://www.mrwallpaper.com/wallpapers/castles-cloudy-landscape.jpg"
    };
    let block = document.getElementById("block");
    //Build query string using data from geolocation data
    let API_KEY = "key=a0dd3da448204eb58f4201908171008";
    let api =
      "https://cors-anywhere.herokuapp.com/https://api.apixu.com/v1/current.json?key=a0dd3da448204eb58f4201908171008&q=";
    let latitude;
    let longitude;
    let coords = currentLatitude + "," + currentLongitude;
    let API_URL = api + coords;

    //Request access to the weather api
    $.getJSON(API_URL, function(data) {
      //Declare variables that will be used to populate content within the #block div
      apiData = data;
      let condition_code = apiData.current.condition.code;
      let condition_icon = apiData.current.condition.icon;
      let condition = apiData.current.condition.text;
      let far = apiData.current.temp_f;
      let cel = apiData.current.temp_c;
      let wind_kph = apiData.current.wind_kph + "kph";
      let wind_mph = apiData.current.wind_mph + "mph";
      let wind_dir = apiData.current.wind_dir;
      let city = apiData.location.name;
      let region = apiData.location.region;
      let location = city + ", " + region;

      //The following codes are to be matched with their respective imagery for the background
      //snowCodes are in index[0]
      //rainCodes are in index[1]
      //thunderCodes are in index[2]
      //fogCodes are in index[3]
      //cloudCodes are in index[4]
      //clearCodes are in index[5]
      let codeArr = [
        [
          1066,
          1069,
          1072,
          1114,
          1117,
          1147,
          1168,
          1171,
          1198,
          1201,
          1204,
          1207,
          1210,
          1213,
          1216,
          1219,
          1222,
          1237,
          1249,
          1252,
          1255,
          1258,
          1261,
          1264
        ],
        [
          1030,
          1063,
          1150,
          1153,
          1180,
          1183,
          1186,
          1189,
          1192,
          1195,
          1240,
          1243,
          1246,
          1273
        ],
        [1276, 1279, 1282],
        [1135],
        [1009, 1006, 1003],
        [1000]
      ];

      //Declare my variables to build up the listing of Location and Weather Conditions
      let itemList = document.getElementById("demographics");
      let listItem = document.createElement("li");
      let listItemContent = "";
      let listArray = [
        "Location: ",
        "Condition: ",
        "Wind Speed: ",
        "Wind Direction: "
      ];
      let varArray = [location, condition, wind_mph, wind_dir];
      let tempElementFar = $(".temp-block-far");
      let tempElementCel = $(".temp-block-cel");
      let tempContent;
      let degrees;

      function changeBackground(data, array) {
        for (var i = 0; i < array.length; i++) {
          for (var j = 0; j < array[i].length; j++) {
            if (data === array[i][j] && i == 0) {
              document.body.style.backgroundImage =
                "url('" + images.snowy + "')";
            }
            if (data === array[i][j] && i == 1) {
              document.body.style.backgroundImage =
                "url('" + images.rainy + "')";
            }
            if (data === array[i][j] && i == 2) {
              document.body.style.backgroundImage =
                "url('" + images.thunderstorm + "')";
            }
            if (data === array[i][j] && i == 3) {
              document.body.style.backgroundImage =
                "url('" + images.foggy + "')";
            }
            if (data === array[i][j] && i == 4) {
              document.body.style.backgroundImage =
                "url('" + images.cloudy + "')";
            }
            if (data === array[i][j] && i == 5) {
              document.body.style.backgroundImage =
                "url('" + images.clear + "')";
            }
          } //end of j for loop
        } //end of i for loop
      } //end of changeBackground function

      function showTempFar() {
        tempContent = document.innerHTML =
          far + '<h2 style="display: inline">&deg;f</h2>';
        tempElementFar.append(tempContent);
      }
      function showTempCel() {
        tempContent = document.innerHTML =
          cel + '<h2 style="display: inline">&deg;c</h2>';
        tempElementCel.append(tempContent);
      }

      function listAll(arr) {
        let list = $("#demographics");
        let limit = listArray.length - 1;
        let current = 0;
        var end = setInterval(function() {
          if (current == limit) {
            clearInterval(end);
          }
          list.append(
            '<li style="display:none;color:rgba(200,200,200,0.4);">' +
              listArray[current] +
              varArray[current] +
              "</li>"
          );

          let newList = $("#demographics li:last-child");
          newList.slideDown(100);
          let colorEnd = setInterval(function() {
            newList.css("color", "black");
            clearInterval(colorEnd);
          }, 350); //end setInterval function for colorEnd
          current = current + 1;
        }, 300);
      } //end of listAll function
      let toggle = false;

      changeBackground(condition_code, codeArr);
      listAll(listArray);
      showTempFar();
      showTempCel();
      tempElementCel.hide();

      $(".switch").click(function() {
        if ($("input").prop("checked")) {
          tempElementFar.hide();
          tempElementCel.show();
        }
        if ($("input").prop("checked") === false) {
          tempElementCel.hide();
          tempElementFar.show();
        }
      });//end click event
    }); //end Weather API call
  }//end location function
  getLocation();
}); //end ready