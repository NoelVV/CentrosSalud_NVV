var mapMain;

// @formatter:off
require([
        "esri/map",
        "esri/tasks/ServiceAreaTask",
        "esri/layers/FeatureLayer",
        "esri/geometry/Extent",
        "esri/graphic",
        "esri/tasks/ServiceAreaParameters",
        "esri/tasks/FeatureSet",
        "esri/tasks/query",
        "esri/tasks/QueryTask",


        "dojo/dom",
        "dojo/on",
        "dojo/parser",
        "dojo/ready",
        

        "dijit/layout/BorderContainer",
        "dijit/layout/ContentPane"],
    function (Map, ServiceAreaTask, FeatureLayer, Extent, Graphic,
        ServiceAreaParameters, FeatureSet, Query, QueryTask,
              dom, on, parser, ready,
              BorderContainer, ContentPane) {
// @formatter:on

        // Wait until DOM is ready *and* all outstanding require() calls have been resolved
        ready(function () {

            // Parse DOM nodes decorated with the data-dojo-type attribute
            parser.parse();

            mapMain = new Map("divMap", {
                basemap: "topo",
                center: [-3.696416, 40.418895],
                zoom: 11,
                sliderStyle: "small"
            });

            var taskServiceArea = new ServiceAreaTask("https://formacion.esri.es/server/rest/services/RedMadrid/NAServer", {
                opacity: 0.8,
            });

            var centrosSaludCSV = new FeatureLayer("https://services5.arcgis.com/zZdalPw2d0tQx8G1/ArcGIS/rest/services/CENTROS_SALUD_ExamenMasterGIS_NVV/FeatureServer/0", {
                outFields: ["*"]
            });
            mapMain.addLayer(centrosSaludCSV);

            mapMain.on("load", areasDeServicio);

            function areasDeServicio() {
                mapMain.graphics.clear();

                var params = new ServiceAreaParameters();
                params.defaultBreaks= [3,7,10];

                var features = [];
                var facilities = new FeatureSet();
                facilities.features = features;
                params.facilities = facilities;

                var queryTask = new QueryTask("https://services5.arcgis.com/zZdalPw2d0tQx8G1/ArcGIS/rest/services/CENTROS_SALUD_ExamenMasterGIS_NVV/FeatureServer/0");
                var query = new Query();
                query.where = "1 = 1";
                facilities = queryTask.executeRelationshipQuery(query);
                centrosSaludCSV.on("execute-relationship-query-complete", function() {
                    features.push(facilities);
                })
                console.log(facilities);
                console.log(features);

                // taskServiceArea.solve(params, pintarAreasServicio());
            }
        });

    });
