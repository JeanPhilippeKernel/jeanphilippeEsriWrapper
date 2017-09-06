// ******************************************************************
// Copyright (c) Jean Philippe KOUASSI . All rights reserved.
// This code is licensed under the MIT License (MIT).
// THE CODE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
// INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
// IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
// TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH
// THE CODE OR THE USE OR OTHER DEALINGS IN THE CODE.
// ******************************************************************



'use strict';

var jeanphilippe = {
    Init: () => {
        console.log("[+] jeanphilippe.js was well initiated.....");
    }
};

jeanphilippe.Helpers = {

    Get: (url, param) => {
        return new Promise((resolve, reject) => {
            if (param !== null && param !== undefined) {
                $.get(url, param)
                    .done(values => resolve(values))
                    .fail(reason => reject(reason));
            }
            else {
                $.get(url)
                    .done(values => resolve(values))
                    .fail(reason => reject(reason));
            }
        });
    },

    GetJson: (url, param) => {
        return new Promise((resolve, reject) => {
            if (param !== null && param !== undefined) {
                $.getJSON(url, param)
                    .done(values => resolve(values))
                    .fail(reason => reject(reason));
            }
            else {
                $.getJSON(url)
                    .done(values => resolve(values))
                    .fail(reason => reject(reason));
            }
        });
    },

    Post: (url, param) => {
        if (param !== null && param !== undefined) {
            return new Promise((resolve, reject) => {
                $.post(url, param)
                    .done(values => resolve(values))
                    .fail(reason => reject(reason));
            });
        }
        else {
            throw new Error("Unable to do post operation with no datas parameter\nCheck the param's parameter value");
        }
    },

    EnableElement: (htmlElement) => {
        if (typeof htmlElement === 'object' && htmlElement.hasOwnProperty("length")) {
            $.each(htmlElement, (i, e) => {
                if (($(e).attr("disabled") === "disabled") || ($(e).attr("disabled") === ""))
                    $(e).removeAttr("disabled");
            });
        }
        else {
            if (($(htmlElement).attr("disabled") === "disabled") || ($(htmlElement).attr("disabled") === ""))
                $(htmlElement).removeAttr("disabled");
        }
    },

    DisableElement: (htmlElement) => {
        if (typeof htmlElement === 'object' && htmlElement.hasOwnProperty("length")) {
            $.each(htmlElement, (i, e) => {
                if ($(e).attr('disabled') !== 'disabled')
                    $(e).attr('disabled', 'disabled');
            });
        }
        else {
            if ($(htmlElement).attr('disabled') !== 'disabled')
                $(htmlElement).attr('disabled', 'disabled');
        }
    }
};

jeanphilippe.Map = {

    // Common methods
    CreateMap: (htmlContainer, settings, __callback) => {
        let _map = null;
        settings = (settings === undefined || settings === null) ? { center: [-118, 34.5], zoom: 8, basemap: "topo" } : settings;

        if (typeof __callback === 'function') {
            require(["esri/map"], (Map) => {
                _map = new Map(htmlContainer, settings);
                __callback(_map);
            });
        }
        else if (typeof __callback === 'null') {
            require(["esri/map"], (Map) => {
                _map = new Map(htmlContainer, settings);
            });
        }
        else {
            console.error("[!] CreateMap method must have a callback function..")
        }

    },

    DestroyMap: (mapObject) => {

        if ((typeof mapObject !== 'null') && (typeof mapObject !== 'undefined')) {
            mapObject.destroy();
        }
        else
            console.error("[!] the object map isn't defined...");
    },
    CenterMap: (mapObject, coordinate, zoomFactor) => {
        require(["esri/geometry/Point"], (Point) => {
            let _point = new Point(coordinate);
            if (zoomFactor !== null && zoomFactor !== undefined) {
                mapObject.centerAndZoom(_point, zoomFactor);
            }
            else {
                mapObject.centerAt(_point);
            }
        });
    },
    CreateMapExtent: (xmin, ymin, xmax, ymax, spatialReference, __callback) => {
        let _extent = null;
        if ((typeof xmin !== 'null') && (typeof xmin !== 'undefined')
            && (typeof ymin !== 'null') && (typeof ymin !== 'undefined')
            && (typeof xmax !== 'null') && (typeof xmax !== 'undefined')
            && (typeof ymax !== 'null') && (typeof ymax !== 'undefined')
            && (typeof spatialReference !== 'null') && (typeof spatialReference !== 'undefined')
            && (typeof __callback !== 'function')) {

            require(["esri/geometry/Extent"], (Extent) => {
                _extent = new Extent(xmin, ymin, xmax, ymax, spatialReference);
                __callback(_extent);
            });
        }
        else {
            console.error("[!] We're unable to create an Extent's object");
        }
    },
    CreateMapExtentByJSON: (extentJSON, __callback) => {
        let _extent = null;
        if (typeof extentJSON !== 'null' && typeof extentJSON !== 'undefined'
            && typeof __callback === 'function') {
            require(["esri/geometry/Extent"], (Extent) => {
                _extent = new Extent(extentJSON);
                __callback(_extent);
            });
        }
        else {
            console.error("[!] We're unable to create an Extent's object");
        }
    },
    CreateMapSpatialReference: (spatialRef, __callback) => {
        let _spatialReference = null;
        if (spatialRef !== null && spatialRef !== undefined && typeof __callback === 'function') {
            require(["esri/SpatialReference"], (SpatialReference) => {
                _spatialReference = new SpatialReference(spatialRef);
                __callback(_spatialReference);
            });
        }
        else {
            console.error("[!] the spatial reference and/or the callback function isn't defined");
        }
    },
    AddMapLayer: (mapObject, layerObject) => {
        if ((typeof mapObject !== 'null') && (typeof mapObject !== 'undefined')
            && (typeof layerObject !== 'null') && (typeof layerObject !== 'undefined')) {
            mapObject.addLayer(layerObject);
        }
        else {
            console.error("[!] map instance and/or layer isn't defined...");
        }

    },
    AddMapLayerArray: (mapObject, layerArray) => {
        if ((typeof mapObject !== 'null') && (typeof mapObject !== 'undefined')
            && (typeof layerArray !== 'null') && (typeof layerArray !== 'undefined')) {
            mapObject.addLayers(layerArray);
        }
        else {
            console.error("[!] map instance and/or layers isn't defined...");
        }
    },
    RemoveMapLayer: (mapObject, layerObject) => {
        if ((typeof mapObject !== 'null') && (typeof mapObject !== 'undefined')
            && (typeof layerObject !== 'null') && (typeof layerObject !== 'undefined')) {
            mapObject.removeLayer(layerObject);
        }
        else {
            console.error("[!] map instance and/or layer isn't defined...");
        }
    },
    RemoveMapAllLayers: (mapObject) => {
        if ((typeof mapObject !== 'null') && (typeof mapObject !== 'undefined')) {
            return mapObject.removeAllLayers();
        }
        else {
            console.error("[!] this map instance isn't defined...");
        }
    },

    //getter methods
    GetMapGraphicLayersIdsArray: (mapObject) => {
        if ((typeof mapObject !== 'null') && (typeof mapObject !== 'undefined')) {
            return mapObject.graphicsLayerIds;
        }
        else
            console.error("[!] this map instance isn't defined...");
    },
    GetMapLayerById: (mapObject, id) => {
        if ((typeof mapObject !== 'null') && (typeof mapObject !== 'undefined')) {
            return mapObject.getLayer(id);
        }
        else
            console.error("[!] this map instance isn't defined...");
    },
    GetMapLayerIdsArray: (mapObject) => {
        if ((typeof mapObject !== 'null') && (typeof mapObject !== 'undefined')) {
            return mapObject.layerIds;
        }
        else
            console.error("[!] this map instance isn't defined...");
    },
    GetMapBackgroundColor: (mapObject) => {
        if ((typeof mapObject !== 'null') && (typeof mapObject !== 'undefined')) {
            return mapObject.backgroundColor;
        }
        else
            console.error("[!] this map instance isn't defined...");
    },
    GetMapSpatialReference: (mapObject) => {
        if ((typeof mapObject !== 'null') && (typeof mapObject !== 'undefined')) {
            return mapObject.spatialReference;
        }
        else
            console.error("[!] this map instance isn't defined...");
    },
    GetMapTimeExtent: () => {

        if ((typeof mapObject !== 'null') && (typeof mapObject !== 'undefined')) {
            return mapObject.timeExtent;
        }
        else
            console.error("[!] this map instance isn't defined...");
    },
    GetMapExtent: (mapObject) => {
        if ((typeof mapObject !== 'null') && (typeof mapObject !== 'undefined')) {
            return mapObject.extent;
        }
        else
            console.error("[!] this map instance isn't defined...");
    },
    GetMapVisibility: (mapObject) => {
        if ((typeof mapObject !== 'null') && (typeof mapObject !== 'undefined')) {
            return mapObject.visible;
        }
        else
            console.error("[!] this map instance isn't defined...");
    },
    GetMapBasemap: (mapObject) => {
        if ((typeof mapObject !== 'null') && (typeof mapObject !== 'undefined')) {
            return mapObject.getBasemap();
        }
        else
            console.error("[!] this map instance isn't defined...");
    },
    GetMapZoom: (mapObject) => {
        if ((typeof mapObject !== 'null') && (typeof mapObject !== 'undefined')) {
            return mapObject.getZoom();
        }
        else
            console.error("[!] this map instance isn't defined...");
    },
    GetMapMinZoom: (mapObject) => {
        if ((typeof mapObject !== 'null') && (typeof mapObject !== 'undefined')) {
            return mapObject.getMinZoom();
        }
        else
            console.error("[!] this map instance isn't defined...");
    },
    GetMapMaxZoom: (mapObject) => {
        if ((typeof mapObject !== 'null') && (typeof mapObject !== 'undefined')) {
            return mapObject.getMaxZoom();
        }
        else
            console.error("[!] this map instance isn't defined...");
    },

    GetMapScale: (mapObject) => {

        if ((typeof mapObject !== 'null') && (typeof mapObject !== 'undefined')) {
            return mapObject.getScale();
        }
        else
            console.error("[!] this map instance isn't defined...");
    },

    GetMapMinScale: (mapObject) => {
        if ((typeof mapObject !== 'null') && (typeof mapObject !== 'undefined')) {
            return mapObject.getMinScale();
        }
        else
            console.error("[!] this map instance isn't defined...");
    },
    GetMapMaxScale: (mapObject) => {
        if ((typeof mapObject !== 'null') && (typeof mapObject !== 'undefined')) {
            return mapObject.getMaxScale();
        }
        else
            console.error("[!] this map instance isn't defined...");
    },

    GetMapLevel: (mapObject) => {
        if ((typeof mapObject !== 'null') && (typeof mapObject !== 'undefined')) {
            return mapObject.getLevel();
        }
        else
            console.error("[!] this map instance isn't defined...");
    },

    //setter methods
    SetMapVisibility: (mapObject, value) => {
        if ((mapObject !== null) && (mapObject !== undefined)
            && ((value !== null) && (value !== undefined) && (typeof value === 'boolean'))) {
            mapObject.setVisibility(value);
        }
    },
    SetMapBackgroundColor: (mapObject, value) => {
        if ((mapObject !== null) && (mapObject !== undefined)
            && ((value !== null) && (value !== undefined))) {
            mapObject.setBackgroundColor(value);
        }
        else {
            console.error("[!] map instance and/or value isn't defined...");
        }
    },
    SetMapZoom: (mapObject, value) => {
        if ((mapObject !== null) && (mapObject !== undefined)
            && ((value !== null) && (value !== undefined))) {
            let deferredOp = mapObject.setZoom(value);
            deferredOp.then(() => console.log("set zoom successed..."),
                err => console.error("error occured while setting zoom : ", err));
        }
        else {
            console.error("[!] map instance and/or value isn't defined...");
        }
    },
    SetMapScale: (mapObject, value) => {
        if ((mapObject !== null) && (mapObject !== undefined)
            && ((value !== null) && (value !== undefined))) {
            let deferredOp = mapObject.setScale(value);
            deferredOp.then(() => console.log("set scale successed..."),
                err => console.error("error occured while setting scale : ", err));
        }
        else {
            console.error("[!] map instance and/or value isn't defined...");
        }
    },
    SetMapLevel: (mapObject, value) => {
        if ((mapObject !== null) && (mapObject !== undefined)
            && ((value !== null) && (value !== undefined))) {
            let deferredOp = mapObject.SetMapLevel(value);
            deferredOp.then(() => console.log("set level successed..."),
                err => console.error("error occured while setting level : ", err));
        }
        else {
            console.error("[!] map instance and/or value isn't defined...");
        }
    },
    SetMapExtent: (mapObject, value) => {
        if ((mapObject !== null) && (mapObject !== undefined)
            && ((value !== null) && (value !== undefined))) {
            let deferredOp = mapObject.setExtent(value);
            deferredOp.then(() => console.log("set extent successed..."),
                err => console.error("error occured while setting extent : ", err));
        }
        else {
            console.error("[!] map instance and/or value isn't defined...");
        }
    }

};

jeanphilippe.Layers = {
    CreateDynamicMapServiceLayer: (url, setting, __callback) => {
        let dynamicServiceLayer = null;
        setting = (setting === undefined || setting === null) ? { id: "defaultService" } : setting;
        if (typeof __callback === 'function') {
            require(["esri/layers/ArcGISDynamicMapServiceLayer"], (ArcGISDynamicMapServiceLayer) => {
                dynamicServiceLayer = new ArcGISDynamicMapServiceLayer(url, setting);
                __callback(dynamicServiceLayer);
            });
        }
        else {
            console.error("[!] the CreateDynamicMapServiceLayer method must have defined callback function");
        }
    },

    CreateImageServiceLayer: (url, setting, __callback) => {

    },
    CreateImageServiceVectorLayer: (url, setting, __callback) => {

    },
    CreateTiledMapServiceLayer: (url, setting, __callback) => {

    },
    CreateFeatureLayer: (url, setting, __callback) => {

    },
    CreateGraphicLayer: (url, setting, __callback) => {

    },
    CreateMapImageLayer: (url, setting, __callback) => {

    }
};

jeanphilippe.Symbols = {

};

jeanphilippe.Tasks = {

};

jeanphilippe.Map.Animation = {

};

jeanphilippe.Init();


