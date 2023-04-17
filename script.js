if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/service-worker.js')
      .then(function(registration) {
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
      }, function(err) {
        console.log('ServiceWorker registration failed: ', err);
      });
  });
}

const body = document.querySelector("body"),
  toggle = document.querySelector(".toggle");
  mini_toggle = document.querySelector(".mini-toggle");

  let getMode = localStorage.getItem("mode");
  if(getMode && getMode === "dark"){
    body.classList.add("dark");
    toggle.classList.add("active");
    mini_toggle.classList.add("active");
  }

  toggle.addEventListener("click", () => {
    body.classList.toggle("dark");
    
    if(!body.classList.contains("dark")) {
      return localStorage.setItem("mode", "light");
    }
    localStorage.setItem("mode", "dark");
  });

  mini_toggle.addEventListener("click", () => {
    body.classList.toggle("dark");
    
    if(!body.classList.contains("dark")) {
      return localStorage.setItem("mode", "light");
    }
    localStorage.setItem("mode", "dark");
  });

  toggle.addEventListener("click", () => toggle.classList.toggle("active"));
  mini_toggle.addEventListener("click", () => mini_toggle.classList.toggle("active"));

let list = document.querySelectorAll('.list');
function activeLink(){
  list.forEach((item) =>
  item.classList.remove('active'));
  this.classList.add('active');
}
list.forEach((item) =>
item.addEventListener('click',activeLink));

function getHijriDate() {
  navigator.geolocation.getCurrentPosition(function(position) {
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;
    var timestamp = new Date().getTime();
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", "https://api.aladhan.com/v1/calendar?latitude=" + latitude + "&longitude=" + longitude + "&method=2&month=" + (new Date().getMonth() + 1) + "&year=" + new Date().getFullYear() + "&calendar=islamic&lang=ar", false);
    xmlHttp.send(null);
    var response = JSON.parse(xmlHttp.responseText);
    var hijriDate = response.data[new Date().getDate() - 1].date.hijri;
    var hijriDate = response.data[new Date().getDate() - 1].date.hijri;
    var hijriDay = convertToArabic(hijriDate.day);
    var hijriMonth = hijriDate.month.ar;
    document.getElementById('hijri-date').innerHTML = hijriDay + ' ' + hijriMonth;
    document.getElementById('hijri-date-2').innerHTML = hijriDay + ' ' + hijriMonth;
  });
}

function convertToArabic(number) {
  var arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  var arabicNumber = '';
  var numberString = number.toString();
  for (var i = 0; i < numberString.length; i++) {
    arabicNumber += arabicNumerals[parseInt(numberString.charAt(i))];
  }
  return arabicNumber;
}

getHijriDate();

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(function(position) {
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;

    var prayerTimesUrl = 'https://api.aladhan.com/v1/timings?latitude=' + latitude + '&longitude=' + longitude + '&method=2';
    fetch(prayerTimesUrl)
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        var prayerTimes = data.data.timings;

        var now = new Date();
        var nextPrayer = null;
        var nextPrayerName = null;
        var prayerNames = {
          Fajr: 'الفجر',
          Dhuhr: 'الظهر',
          Asr: 'العصر',
          Maghrib: 'المغرب',
          Isha: 'العشاء'
        };
        for (var prayer in prayerTimes) {
          var prayerTime = new Date(now.toDateString() + ' ' + prayerTimes[prayer]);
          if (prayerTime > now && (nextPrayer === null || prayerTime < nextPrayer)) {
            nextPrayer = prayerTime;
            nextPrayerName = prayerNames[prayer];
          }
        }

        if (nextPrayer !== null) {
          var hours = nextPrayer.getHours();
          var minutes = nextPrayer.getMinutes();
          var ampm = hours >= 12 ? 'م' : 'ص';
          hours = hours % 12;
          hours = hours ? hours : 12;
          var hoursArabic = convertToArabicNumeral(hours);
          var minutesArabic = convertToArabicNumeral(minutes);
          var timeString = hoursArabic + ':' + minutesArabic + ' ' + ampm;
          var nextPrayerString = nextPrayerName.replace('في ', '');
          document.getElementById('next-prayer').innerHTML = nextPrayerString + ' ' + timeString;
        } else {
          document.getElementById('next-prayer').innerHTML = 'غير معروف';
        }
      })
      .catch(function(error) {
        console.error(error);
        document.getElementById('next-prayer').innerHTML = 'خطأ';
      });
  }, function(error) {
    console.error(error);
    document.getElementById('next-prayer').innerHTML = 'خطأ';
  });
} else {
  document.getElementById('next-prayer').innerHTML = 'الموقع غير مدعوم من قبل هذا المتصفح.';
}

function convertToArabicNumeral(number) {
  var arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  var arabicNumber = '';
  var numberString = number.toString();
  for (var i = 0; i < numberString.length; i++) {
    arabicNumber += arabicNumerals[numberString[i]];
  }
  return arabicNumber;
}

function displayMessage() {
  var overlay = document.getElementById("overlay");
  
  overlay.style.display = "flex";
  
  overlay.addEventListener("click", function() {
    overlay.style.display = "none";
  });
}

