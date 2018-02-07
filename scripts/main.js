// ui Controller
var uiController = (function () {

    // uiVariables
    var fragment, chevronDown, chevronUp, toggleButton, sidebar, sidebarListItem, table, main;

    fragment = document.createDocumentFragment();
    chevronDown = document.querySelector('.chevron-down');
    chevronUp = document.querySelector('.chevron-up');
    toggleButton = document.querySelector('#toggle-button');
    sidebar = document.querySelector('#sidebar');
    sidebarListItem = document.querySelectorAll('.store-list-item');
    main = document.querySelector('#main');
    table = document.querySelector('#table');

    // switch chevron on click and reposition content if needed
    var toggler = function () {
        chevronUp.classList.toggle('active');
        chevronDown.classList.toggle('active');
        sidebar.classList.toggle('hidden');
        if (sidebar.classList.contains('hidden')) {
            main.classList.remove('slider');
        } else {
            main.classList.add('slider');
        }
    };

    // make selected list item active
    var makeActive = function (id) {
        var oldActiveItem = document.querySelector('.list-active');
        var newActiveItem = document.querySelector('#' + id);
        if (oldActiveItem) {
            oldActiveItem.classList.toggle('list-active');
        }
        newActiveItem.classList.toggle('list-active');
        // toggle sidebar if viewport < 768
        if (window.innerWidth < 768) {
            toggler();
        }
    };

    // build list of stores for sidebar
    var buildSideList = function () {
        var sideList;

        sideList = document.createElement('ul');
        sideList.className = 'list-unstyled list-inline text-left mb-5';

        // loop over array to determine size of list
        for (var i = 0; i < Object.keys(storeInfo).length; i++) {
            var listItem = document.createElement('li');

            listItem.appendChild(document.createTextNode('# ' + (Object.keys(storeInfo)[i].substr(1))));
            listItem.className = 'store-list-item list-inline-item py-3 pl-5';
            // make id
            listItem.id = Object.keys(storeInfo);
            listItem.id = (listItem.id.split(',')[i]);
            fragment.appendChild(listItem);
        }
        sideList.appendChild(fragment);
        return sideList;
    };

    // make table
    var makeTable = function (stores) {
        var tableHead, tableRow, columnHeader;

        tableHead = document.createElement('thead');
        tableRow = document.createElement('tr');

        // clear table
        table.innerHtml = '';

        // create table header
        tableRow.innerHTML = (
            '<th scope ="col">Store</th >' +
            '<th scope="col">Facebook</th>' +
            '<th scope="col">Google</th>' +
            '<th scope="col">Yelp</th>'
        );
        tableHead.appendChild(tableRow);

        table.appendChild(tableHead);
        return table;
    };

    // make global
    return {
        toggler: toggler,
        toggleButton: toggleButton,
        sidebarListItem: sidebarListItem,
        makeActive: makeActive,
        buildSideList: buildSideList,
        makeTable: makeTable,
        table: table,
    };
}());


// controller
var controller = (function () {

    // launch listeners
    var launchEventListeners = function () {
        // toggle button
        uiController.toggleButton.addEventListener('click', function () {
            uiController.toggler();
        });

        // select sidebar item - make active , create table, launch apis etc...
        uiController.sidebarListItem.forEach((item) => {
            item.addEventListener('click', function (e) {
                var id = e.target.id;
                uiController.makeActive(id);
                // get array from storeinfo.js and pass into makeTable
                uiController.table.innerHTML = ' ';
                uiController.makeTable(storeInfo[id]);

            });
        });
    };

    var createData = function () {
        // load information into sidebar
        document.querySelector('#side-bar-list').appendChild(uiController.buildSideList());
        // push new sidebarListItems to uiController -- will be needed in future release
        uiController.sidebarListItem = document.querySelectorAll('.store-list-item');
    };

    return {
        init() {
            createData();
            launchEventListeners();
        }
    };
}());

controller.init();
// window.addEventListener('click', function(e) {
//     console.log(e);
// });













// cspell:disable

// // rapid api - needed for Yelp to work
// // var RapidAPI = new require('rapidapi-connect');
// var rapid = new RapidAPI('storeranking',
//     '9ff7edb4-d7e5-43f8-92d2-4fb7f22a46eb');

// $(document).ready(function () {
//     // build drop-down based on the districts listed in store info

//     /* eslint-disable guard-for-in */
//     (function () {
//         for (property in storeInfo) {
//             $('#district-selection').append(
//                 '<option value=storeInfo.' + property + '>' +
//         property.substr(1, property.length) + '</option>');
//         }
//     })();
//     /* eslint-enable */

//     // click event

//     $('#district-selection').click(function () {
//     // reset table and rebuild table head
//         $('#ranking_table').empty();
//         $('#ranking_table').append('<tr>' +
//       '<th>STORE #</th>' +
//       '<th>YELP</th>' +
//       '<th>GOOGLE</th>' +
//       '<th>FACEBOOK</th>' +
//       '</tr>');


//         // add district number to selector
//         var districtNumber = $(this).val().substr(-4, 4);

//         $('#option-title').empty();
//         if ($.isNumeric(districtNumber)) {
//             $('#option-title').append('District: ' + districtNumber);
//             value = eval($(this).val()); // eval should NOT be used with a database
//             // make table
//             makeTable(value);
//         } else {
//             $('#option-title').append($(this).val());
//         }
//     });
// });

// // All API calls should be served directly from the server if possible

// // Yelp API call using rapid api
// function getInfoYelp(storeInfo, ratingSource) {
//     rapid.call('YelpAPI', 'getSingleBusiness', {
//         'accessToken': '0KFFwb0CeOocTb-DTHcHAIyHNVoh4x4I_TZ5mkoUM4RYPyzG2ZfSgCZcBsthpgJBJGTBGeQFPVCbzA5sIt8zG3y3_cU3upPRT13G3okGWRuzG27p8K9jvnqYbjMkWnYx',
//         'bussinessId': storeInfo[ratingSource], // bussiness typo required due to error on rapid api's end

//     }).on('success', function (data) {
//         rating = data.rating;
//         $('#' + storeInfo.sNumber + ratingSource).text(rating.toFixed(1) + ' / 5');
//     });
// }

// // Google API call
// function getInfoGoogle(storeInfo, ratingSource) {
//     // Proxy to bypass CORS - may not be needed when live
//     proxy = 'https://cors-anywhere.herokuapp.com/';
//     googleApi = 'https://maps.googleapis.com/maps/api/place/details/json?placeid=';
//     googleKey = '&key=AIzaSyALgMeJoWoeLiygtjWOu1uRou7vJRzQg0I';

//     $.get(proxy + googleApi + storeInfo[ratingSource] + googleKey,
//         function (data) {
//             rating = data.result.rating;
//             $('#' + storeInfo.sNumber + ratingSource).text(rating.toFixed(1) + ' / 5');
//         }
//     );
// }

// // Facebook API call
// function getInfoFacebook(storeInfo, ratingSource) {
//     $.ajax({
//         url: 'https://graph.facebook.com/v2.11/' + storeInfo[ratingSource] + '?fields=overall_star_rating',
//         beforeSend: function (xhr) {
//             xhr.setRequestHeader('Authorization', 'Bearer EAAb6s2uIpEMBAAbSvg1vOWop15RpXsmBH9meE59kCuRh0JxzA1eZCxxWbnCEHqpLZCSNKmPSj7OuDFx1RhBC8pO1y8ZA9GBCcEAEkDZC3S0bZCkflZCFGr5GJ8ol8SMZAQ4Bkb5vYAZCC4LcvBiff8UgZC4ohbkfj0dwZD');
//         },
//         success: function (data) {
//             rating = (data.overall_star_rating);
//             $('#' + storeInfo.sNumber + ratingSource).text(rating.toFixed(1) + ' / 5');
//         },
//     });
// }

// // creates table rows based on length of array and fills store information
// // will load information based on 'value' assigned above

// function makeTable(district) {
//     for (i = 0; i < district.length; i++) {
//         $('#ranking_table').append(
//             '<tr>' +
//       '<td class="store-number">' + district[i].sNumber + '</td>' +
//       '<td id=' + district[i].sNumber + 'yelpId> <p>-</p> </td>' +
//       '<td id=' + district[i].sNumber + 'googleId><p>-</p> </td>' +
//       '<td id=' + district[i].sNumber + 'facebookId> <p>-</p> </td>' +
//       '</tr>'
//         );

//         getInfoYelp(district[i], 'yelpId');
//         getInfoGoogle(district[i], 'googleId');
//         getInfoFacebook(district[i], 'facebookId');
//     }
// }
