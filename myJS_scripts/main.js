 

var  OpenStreetMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

    Stadia_AlidadeSmoothDark = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    Stadia_AlidadeSmooth = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png', {
        maxZoom: 20,
        attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
    });

    Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    });

var map = L.map('map', {
    zoom: 5,
    layers: [OpenStreetMap, Stadia_AlidadeSmoothDark, Stadia_AlidadeSmooth, Esri_WorldImagery]
});

var baseMaps = {
    "Stadia Alidade Smooth Dark": Stadia_AlidadeSmoothDark,
    "Stadia Alidade Smooth": Stadia_AlidadeSmooth,
    "Esri World Imagery": Esri_WorldImagery,
    "Open Street Map": OpenStreetMap,
};

L.control.layers(baseMaps).addTo(map);


// var osmUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
// var osmAttrib = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
// var osm = new L.TileLayer(osmUrl, {
//     minZoom: 20,
//     maxZoom: 18,
//     attribution: osmAttrib
// });

// map.addLayer(osm);
// map.setView(new L.LatLng(12.5657, 104.9910), 7);
// var osm2 = new L.TileLayer(osmUrl, {
//     minZoom: 4,
//     maxZoom: 13,
//     attribution: osmAttrib
// });
// var miniMap = new L.Control.MiniMap(osm2, {
//     toggleDisplay: true, collapsedWidth: 20, collapsedHeight: 20
// }).addTo(map);


/// for geojson with pop up
function addDataToMap(data, map) {
    var dataLayer = L.geoJson(data, {
        onEachFeature: function(feature, layer) {
            var popupText = "Province name: " + feature.properties.HRName
                + "<br>Location: " + feature.properties.HRParent
                // + "<br><a href='" + feature.properties.url + "'>More info</a>";
            layer.bindPopup(popupText); }
        });
    dataLayer.addTo(map);
}

$.getJSON("https://raw.githubusercontent.com/rsmapunit/rsmapunit.github.io/main/cambodia.geojson", function(data) { addDataToMap(data, map); });

////for geojson point only
// function addDataToMap(data, map) {
//     var dataLayer = L.geoJson(data);
//     dataLayer.addTo(map);
// }

// $.getJSON("http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson", function(data) { addDataToMap(data, map); });


var ndx;
    d3.csv("data/test.csv").then(function(old_data) {
    array_seleted= []
    array_province = []
    array_road_len = []
    array_prior = []
    array_wb_rank = []
    array_mrd_rank = []

    for (var i = 0; i < old_data.length; i++) {
        var array = old_data[i].seleted.replace(/\s*\,\s*/g, ",").trim().split(",");
        var array_1 = old_data[i].province.replace(/\s*\,\s*/g, ",").trim().split(",");
        var array_2 = old_data[i].road_len.replace(/\s*\,\s*/g, ",").trim().split(",");
        var array_3 = old_data[i].wb_rank.replace(/\s*\,\s*/g, ",").trim().split(",");
        var array_4 = old_data[i].mrd_rank.replace(/\s*\,\s*/g, ",").trim().split(",");
        var array_5 = old_data[i].prior.replace(/\s*\,\s*/g, ",").trim().split(",");
        array_seleted.push(array);
        array_province.push(array_1);
        array_road_len.push(array_2);
        array_wb_rank.push(array_3);
        array_mrd_rank.push(array_4);
        array_prior.push(array_5);
        
    };
    var data = []
    for (var i = 0; i < old_data.length; i++) {
        data.push({
            seleted: array_seleted[i],
            province: array_province[i],
            road_len: array_road_len[i],
            prior: array_prior[i],
            wb_rank: array_wb_rank[i],
            mrd_rank: array_mrd_rank[i],
            lat: old_data[i].lat,
            long: old_data[i].long,
        });
    };

    // console.log(data);

    // function remove_empty_bins(source_group) {
    //     return {
    //         all: function() {
    //             return source_group.all().filter(function(d) {
    //                 return d.value != 0;
    //             });
    //         }
    //     };
    // }


    ndx = crossfilter(data);

    var locationDim = ndx.dimension(function(d) {
        return [d["lat"],
            d["long"],
            d["seleted"],
            d["province"],
            d["road_len"],
            d["prior"],
            d["wb_rank"],
            d["mrd_rank"],

        ];
    });

    var seletedDim = ndx.dimension(function(d) {
        return d["seleted"];
    });

    var provinceDim = ndx.dimension(function(d) {
        return d["province"];
    });
    var road_lenDim = ndx.dimension(function(d) {
        return d["road_len"];
    }, true);

    var priorDim = ndx.dimension(function(d) {
        return d["prior"];
    }, true);

    var wb_rankDim = ndx.dimension(function(d) {
        return d["wb_rank"];
    }, true);
    var mrd_rankDim = ndx.dimension(function(d) {
        return d["mrd_rank"];
    }, true);
    var allDim = ndx.dimension(function(d) {
        return d;
    });
    
    var road_lenGroup = seletedDim.group().reduceSum(function(d) {
        return d.road_len;
        }, true);
        


    var groupname = "marker-select";
    var all = ndx.groupAll();
    var locationGroup = locationDim.group().reduce(function(p, v) {
            p["lat"] = v["lat"]
            p["long"] = v["long"]
            p["seleted"] = v["seleted"]
            p["province"] = v["province"]
            p["road_len"] = v["road_len"]
            p["prior"] = v["prior"]
            p["wb_rank"] = v["wb_rank"]
            p["mrd_rank"] = v["mrd_rank"]
            
                ++p.count;
            return p;
        },
        function(p, v) {
            --p.count;
            return p;
        },
        function() {
            return {
                count: 0
            };
        });

    var seletedGroup = seletedDim.group().reduceCount();
    var provinceGroup = provinceDim.group().reduceCount();
    // var road_lenGroup = road_lenDim.group().reduceCount();
    var priorGroup = priorDim.group().reduceCount();
    var wb_rankGroup = wb_rankDim.group().reduceCount();
    var mrd_rankGroup = mrd_rankDim.group().reduceCount();




    // nonEmptyHist_year = remove_empty_bins(data_cGroup1)

    var seletedChart = dc.pieChart('#chart-ring-seleted', groupname);
    var provinceChart = dc.pieChart('#chart-ring-province', groupname);
    var road_lenChart = dc.rowChart("#chart-ring-road_len", groupname);
    // var road_lenAxisChart = new dc.axisChart('#road_len-row-axis', groupname);
    var priorChart = dc.pieChart('#chart-ring-prior', groupname);
    var wb_rankChart = dc.rowChart('#chart-ring-wb_rank', groupname);
    var wb_rankAxisChart = new dc.axisChart('#wb_rank-row-axis', groupname);
    var mrd_rankChart = dc.rowChart("#chart-ring-mrd_rank", groupname);
    var mrd_rankAxisChart = new dc.axisChart('#mrd_rank-row-axis', groupname);

    var dataTableCount = dc.dataCount('.dc-dataTable-count', groupname);
    var dataTable = dc_datatables.datatable('#data-table', groupname);
    var dataCount = dc.dataCount('.dc-dataTitle-count', groupname);

    var d3SchemeCategory20c = ['#3182bd', '#6baed6', '#9ecae1', '#c6dbef', '#e6550d', '#fd8d3c', '#fdae6b', '#fdd0a2', '#31a354', '#74c476', '#a1d99b', '#c7e9c0', '#756bb1', '#9e9ac8', '#bcbddc', '#dadaeb', '#636363', '#969696', '#bdbdbd', '#d9d9d9']

    var paperMarkers = dc_leaflet.markerChart("#cluster-map-anchor", groupname)
        .dimension(locationDim)
        .group(locationGroup)
        .map(map)
        .valueAccessor(function(kv) {
            return kv.value.count;
        })
        .locationAccessor(function(kv) {
            return [kv.value.lat, kv.value.long];
        })
        .showMarkerTitle(false)
        .fitOnRender(true)
        .fitOnRedraw(true)
        .filterByArea(true)
        .cluster(true)
        .popup(function(kv, marker) {

            return "<dt><span style='font-weight:bolder'>Selected: </span> </dt> <dd>" + kv.value.seleted + "<dd>" +
            "<dt><span style='font-weight:bolder'>Province: </span> </dt> <dd>" + kv.value.province + "<dd>" +
            "<dt><span style='font-weight:bolder'>Road Length: </span> </dt> <dd>" + kv.value.road_len + "<dd>"+
            "<dt><span style='font-weight:bolder'>Priorities: </span> </dt> <dd>" + kv.value.prior + "<dd>"+
            "<dt><span style='font-weight:bolder'>Wb Rank : </span> </dt> <dd>" + kv.value.wb_rank + "<dd>"+
            "<dt><span style='font-weight:bolder'>MRD Rank: </span> </dt> <dd>" + kv.value.mrd_rank + "<dd>" 
        })
        .clusterOptions({
            spiderfyOnMaxZoom: true,
            spiderLegPolylineOptions: {
                weight: 3,
                color: '#000',
                opacity: 0.8
            }
        });

    seletedChart
        .width(300)
        .height(280)
        // .slicesCap(400)
        .innerRadius(40)
        .externalLabels(200)
        // .externalRadiusPadding(30)
        // .drawPaths(true)
        .dimension(seletedDim)
        .group(seletedGroup)
        .legend(new dc.HtmlLegend()
            .container('#seleted-legend')
            .horizontal(false)
            .highlightSelected(true));

    provinceChart
        .width(300)
        .height(280)
        .externalLabels(200)
        .dimension(provinceDim)
        .innerRadius(40)
        .group(provinceGroup)
        .legend(new dc.HtmlLegend()
            .container('#province-legend')
            .horizontal(false)
            .highlightSelected(true))

    road_lenChart
        .width(300)
        .height(180)
        .margins({
            left: 10,
            top: 15,
            right: 10,
            bottom: 0
        })
        .dimension(seletedDim)
        .group(road_lenGroup)
        .elasticX(true)
        // .colors("#1ca3ec")
        .ordering(function(d) {
            return -d.value;
        })
        .xAxis().ticks(15)

    // road_lenAxisChart
    //     .margins({
    //         left: 10,
    //         top: 0,
    //         right: 10,
    //         bottom: 10
    //     })
    //     .height(180)
    //     .width(300)
    //     .dimension(seletedDim)
    //     .group(road_lenGroup)
    //     .elastic(true)
    //     .renderlet(function(chart) {
    //         chart.selectAll("g.x text")
    //             .attr('dx', '-35')
    //             .attr('transform', "rotate(-45)");
    //     });
    
    priorChart
        .width(300)
        .height(280)
        .externalLabels(200)
        .dimension(priorDim)
        .innerRadius(40)
        // .ordinalColors(['#ff0000', '#A6F230', '#157EE8', '#c6dbef', '#dadaeb'])
        .group(priorGroup)
        .legend(new dc.HtmlLegend()
            .container('#prior-legend')
            .horizontal(false)
            .highlightSelected(true))

    wb_rankChart
        .width(300)
        .height(1000)
        .margins({
            left: 10,
            top: 15,
            right: 10,
            bottom: 0
        })
        .dimension(wb_rankDim)
        // .ordinalColors(['#ff0000', '#A6F230', '#157EE8', '#c6dbef', '#dadaeb'])
        .group(wb_rankGroup)
        .elasticX(true)
        // .colors("#215979")
        .ordering(function(d) {
            return -d.value;
        })
        .xAxis().ticks(15)
    wb_rankAxisChart
        .margins({
            left: 10,
            top: 0,
            right: 10,
            bottom: 10
        })
        .height(50)
        .width(320)
        .dimension(wb_rankDim)
        .group(wb_rankGroup)
        .elastic(true);

    mrd_rankChart
        .width(300)
        .height(600)
        .margins({
            left: 10,
            top: 15,
            right: 10,
            bottom: 0
        })
        .dimension(mrd_rankDim)
        // .ordinalColors(['#ff0000', '#A6F230', '#157EE8', '#c6dbef', '#dadaeb'])
        .group(mrd_rankGroup)
        .elasticX(true)
        // .colors("#215979")
        .ordering(function(d) {
            return -d.value;
        })
        .xAxis().ticks(15)
    mrd_rankAxisChart
        .margins({
            left: 10,
            top: 0,
            right: 10,
            bottom: 10
        })
        .height(50)
        .width(320)
        .dimension(mrd_rankDim)
        .group(mrd_rankGroup)
        .elastic(true);


    dataCount
        .dimension(ndx)
        .group(all);

    dataTableCount
        .dimension(ndx)
        .group(all)

    dataTable
        .dimension(allDim)
        .group(function(d) {
            return 'Data Counts';
        })
        .size(10)
        .columns([{
                label: 'seleted',
                type: 'string',
                format: function(d) {
                    return d["seleted"];
                }

            }, {
                label: 'province',
                type: 'string',
                format: function(d) {
                    return d["province"];
                }
            
            }, {
                label: 'Road length',
                type: 'string',
                format: function(d) {
                    return d["road_len"];
                }
            
            }, {
                label: 'Priorities',
                type: 'string',
                format: function(d) {
                    return d["prior"];
                }

            }, {
                label: 'WB Rank',
                type: 'string',
                format: function(d) {
                    return d["wb_rank"];
                }

            }, {
                label: 'MRD Rank',
                type: 'num',
                format: function(d) {
                    return d["mrd_rank"];
                }    
            
            }
        ])


    .sortBy(function(d) {
            return d.seleted;
        })
        .order(d3.ascending)
        .options({
            "scrollX": true
        })
        .on('renderlet', function(table) {
            table.selectAll('.dc-table-group').classed('info', true);
        });

    d3.selectAll('a#all').on('click', function() {
        dc.filterAll(groupname);
        dc.renderAll(groupname);
    });

    d3.selectAll('a#seleted').on('click', function() {
        seletedChart.filterAll(groupname);
        dc.redrawAll(groupname);
    });
    d3.selectAll('a#province').on('click', function() {
        provinceChart.filterAll(groupname);
        dc.redrawAll(groupname);
    });
    d3.selectAll('a#road_len').on('click', function() {
        road_lenChart.filterAll(groupname);
        dc.redrawAll(groupname);
    });

    d3.selectAll('a#prior').on('click', function() {
        priorChart.filterAll(groupname);
        dc.redrawAll(groupname);
    });

    d3.selectAll('a#wb_rank').on('click', function() {
        wb_rankChart.filterAll(groupname);
        dc.redrawAll(groupname);
    });
    d3.selectAll('a#mrd_rank').on('click', function() {
        mrd_rankChart.filterAll(groupname);
        dc.redrawAll(groupname);
    });

    $("#mapReset").on('click', function() {
        paperMarkers.map().setView([12.5657, 104.9910], 3);
    });

    dc.renderAll(groupname);
    dc.redrawAll(groupname);

});
$(document).ready(function() {
    $('[data-toggle="tooltip"]').tooltip();
});

var offset = 70;
$('.navbar li a').click(function(event) {
    event.preventDefault();
    $($(this).attr('href'))[0].scrollIntoView();
    scrollBy(0, -offset);
});

var navOffset = $('.navbar').height();

$('.navbar li a').click(function(event) {
    var href = $(this).attr('href');

    event.preventDefault();
    window.location.hash = href;

    $(href)[0].scrollIntoView();
    window.scrollBy(0, -navOffset);
});
