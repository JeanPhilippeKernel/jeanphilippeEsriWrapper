// ******************************************************************
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

var jp = (($) => {

    let _helpersNameSpace = {};
    let _mapV3NameSpace = {
        Layers: {},
        Tasks: {},
        Symbols: {},
        Animation: {}
    };
    let _mapV4NameSpace = {
        Layers: {}
    };
    return {

        Init: () => {
            if ($ !== undefined || $ !== null) {
                $(document).ready(() => console.log("[+] jeanphilippe.js initialisation... Ok"));
            } else {
                console.error("jeanphilippe.js require Jquery to be loaded ");
            }
        },
        Helpers: _helpersNameSpace,
        Map: {
            v3: _mapV3NameSpace,
            v4: _mapV4NameSpace,
        }
    };

})($);

jp.Helpers.Get = (url, param) => {

    return new Promise((resolve, reject) => {
        let _query = {
            type: "GET",
            url: url,
            success: (values) => resolve(values),
            error: (reason) => reject(reason)
        };

        if (param !== null && param !== undefined) {
            _query.data = param;
        }

        $.ajax(_query);
    });
}

jp.Helpers.Post = (url, param) => {

    if (param !== null && param !== undefined) {
        return new Promise((resolve, reject) => {
            let _query = {
                type: "POST",
                url: url,
                data: param,
                success: (values) => resolve(values),
                error: (reason) => reject(reason)
            };
            $.ajax(_query);
        });
    } else {
        throw new Error("Unable to do post operation with no datas parameter\nCheck the param's parameter value");
    }
}

jp.Helpers.EnableElement = (htmlElement) => {
    if (typeof htmlElement === 'object' && htmlElement.hasOwnProperty("length")) {
        $.each(htmlElement, (i, e) => {
            if (($(e).attr("disabled") === "disabled") || ($(e).attr("disabled") === ""))
                $(e).removeAttr("disabled");
        });
    } else {
        if (($(htmlElement).attr("disabled") === "disabled") || ($(htmlElement).attr("disabled") === ""))
            $(htmlElement).removeAttr("disabled");
    }
}

jp.Helpers.DisableElement = (htmlElement) => {
    if (typeof htmlElement === 'object' && htmlElement.hasOwnProperty("length")) {
        $.each(htmlElement, (i, e) => {
            if ($(e).attr('disabled') !== 'disabled')
                $(e).attr('disabled', 'disabled');
        });
    } else {
        if ($(htmlElement).attr('disabled') !== 'disabled')
            $(htmlElement).attr('disabled', 'disabled');
    }
}

jp.Helpers.NormalizeUrlWithValue = (url, value) => {
    if ((typeof url !== 'null') && (typeof url !== 'undifined') &&
        (typeof url === 'string') && (typeof value !== 'null') && (typeof value !== 'undifined')) {
        let _innerUrl = url.split('/');
        _innerUrl[_innerUrl.length - 1] = value;
        _innerUrl = _innerUrl.join('/');
        return _innerUrl;
    } else {
        console.error("[!] you're maybe missed url/value parameter");
    }
}

jp.Helpers.ReplaceSpecialChar = (textInput) => {
    let TabSpec = {
        "à": "a",
        "á": "a",
        "â": "a",
        "ã": "a",
        "ä": "a",
        "å": "a",
        "ò": "o",
        "ó": "o",
        "ô": "o",
        "õ": "o",
        "ö": "o",
        "ø": "o",
        "è": "e",
        "é": "e",
        "ê": "e",
        "ë": "e",
        "ç": "c",
        "ì": "i",
        "í": "i",
        "î": "i",
        "ï": "i",
        "ù": "u",
        "ú": "u",
        "û": "u",
        "ü": "u",
        "ÿ": "y",
        "ñ": "n",
        "-": " ",
        "_": " "
    };
    let reg = /[àáäâèéêëçìíîïòóôõöøùúûüÿñ_-]/gi;
    return textInput.replace(reg, function () { return TabSpec[arguments[0].toLowerCase()]; }).toLowerCase();
}

/** @description Create a map object asynchronously.  
 *  @param {string} htmlContainer The id of html tag element. 
 *  @param {object} settings The setting that will use to create map.
 *  @param {function} __callback The callback function that will return the created instance of map object.
 */
jp.Map.v3.CreateMap = (htmlContainer, settings, __callback) => {
    let _map = null;
    settings = (settings === undefined || settings === null) ? {
        center: [-118, 34.5],
        zoom: 8,
        basemap: "topo"
    } : settings;

    if (typeof __callback === 'function') {
        require(["esri/map"], (Map) => {
            _map = new Map(htmlContainer, settings);
            __callback(_map);
        });
    } else if (typeof __callback === 'null') {
        require(["esri/map"], (Map) => {
            _map = new Map(htmlContainer, settings);
        });
    } else {
        console.error("[!] CreateMap method must have a callback function..")
    }
}

jp.Map.v3.DestroyMap = (mapObject) => {
    if ((typeof mapObject !== 'null') && (typeof mapObject !== 'undefined')) {
        mapObject.destroy();
    } else
        console.error("[!] the object map isn't defined...");
}

jp.Map.v3.CenterMap = (mapObject, coordinate, zoomFactor) => {
    require(["esri/geometry/Point"], (Point) => {
        let _point = new Point(coordinate);
        _point.setSpatialReference(mapObject.spatialReference);

        if (zoomFactor !== null && zoomFactor !== undefined) {
            mapObject.centerAndZoom(_point, zoomFactor);
        } else {
            mapObject.centerAt(_point);
        }
    });

}


jp.Map.v3.CreateMapExtent = (xmin, ymin, xmax, ymax, spatialReference, __callback) => {
    let _extent = null;
    if ((typeof xmin !== 'null') && (typeof xmin !== 'undefined') &&
        (typeof ymin !== 'null') && (typeof ymin !== 'undefined') &&
        (typeof xmax !== 'null') && (typeof xmax !== 'undefined') &&
        (typeof ymax !== 'null') && (typeof ymax !== 'undefined') &&
        (typeof spatialReference !== 'null') && (typeof spatialReference !== 'undefined') &&
        (typeof __callback === 'function')) {

        require(["esri/geometry/Extent"], (Extent) => {
            _extent = new Extent(xmin, ymin, xmax, ymax, spatialReference);
            __callback(_extent);
        });
    } else {
        console.error("[!] We're unable to create an Extent's object");
    }
}

jp.Map.v3.CreateMapExtentByJSON = (extentJSON, __callback) => {
    let _extent = null;
    if (typeof extentJSON !== 'null' && typeof extentJSON !== 'undefined' &&
        typeof __callback === 'function') {
        require(["esri/geometry/Extent"], (Extent) => {
            _extent = new Extent(extentJSON);
            __callback(_extent);
        });
    } else {
        console.error("[!] We're unable to create an Extent's object");
    }
}

jp.Map.v3.CreateMapSpatialReference = (spatialRef, __callback) => {
    let _spatialReference = null;
    if (spatialRef !== null && spatialRef !== undefined && typeof __callback === 'function') {
        require(["esri/SpatialReference"], (SpatialReference) => {
            _spatialReference = new SpatialReference(spatialRef);
            __callback(_spatialReference);
        });
    } else {
        console.error("[!] the spatial reference and/or the callback function isn't defined");
    }
}

jp.Map.v3.AddMapLayer = (mapObject, layerObject) => {
    if ((typeof mapObject !== 'null') && (typeof mapObject !== 'undefined') &&
        (typeof layerObject !== 'null') && (typeof layerObject !== 'undefined')) {
        mapObject.addLayer(layerObject);
    } else {
        console.error("[!] map instance and/or layer isn't defined...");
    }

}

jp.Map.v3.AddMapLayerArray = (mapObject, layerArray) => {
    if ((typeof mapObject !== 'null') && (typeof mapObject !== 'undefined') &&
        (typeof layerArray !== 'null') && (typeof layerArray !== 'undefined')) {
        mapObject.addLayers(layerArray);
    } else {
        console.error("[!] map instance and/or layers isn't defined...");
    }
}

jp.Map.v3.RemoveMapLayer = (mapObject, layerObject) => {
    if ((typeof mapObject !== 'null') && (typeof mapObject !== 'undefined') &&
        (typeof layerObject !== 'null') && (typeof layerObject !== 'undefined')) {
        mapObject.removeLayer(layerObject);
    } else {
        console.error("[!] map instance and/or layer isn't defined...");
    }
}

jp.Map.v3.GetMapGraphicLayersIdsArray = (mapObject) => {
    if ((typeof mapObject !== 'null') && (typeof mapObject !== 'undefined')) {
        return mapObject.graphicsLayerIds;
    } else
        console.error("[!] this map instance isn't defined...");
}

jp.Map.v3.GetMapLayerById = (mapObject, id) => {
    if ((typeof mapObject !== 'null') && (typeof mapObject !== 'undefined')) {
        return mapObject.getLayer(id);
    } else
        console.error("[!] this map instance isn't defined...");
}

jp.Map.v3.GetMapLayerIdsArray = (mapObject) => {
    if ((typeof mapObject !== 'null') && (typeof mapObject !== 'undefined')) {
        return mapObject.layerIds;
    } else
        console.error("[!] this map instance isn't defined...");
}

jp.Map.v3.GetMapBackgroundColor = (mapObject) => {
    if ((typeof mapObject !== 'null') && (typeof mapObject !== 'undefined')) {
        return mapObject.backgroundColor;
    } else
        console.error("[!] this map instance isn't defined...");
}

jp.Map.v3.GetMapSpatialReference = (mapObject) => {
    if ((typeof mapObject !== 'null') && (typeof mapObject !== 'undefined')) {
        return mapObject.spatialReference;
    } else
        console.error("[!] this map instance isn't defined...");
}

jp.Map.v3.GetMapTimeExtent = () => {

    if ((typeof mapObject !== 'null') && (typeof mapObject !== 'undefined')) {
        return mapObject.timeExtent;
    } else
        console.error("[!] this map instance isn't defined...");
}
jp.Map.v3.GetMapExtent = (mapObject) => {
    if ((typeof mapObject !== 'null') && (typeof mapObject !== 'undefined')) {
        return mapObject.extent;
    } else
        console.error("[!] this map instance isn't defined...");
}
jp.Map.v3.GetMapVisibility = (mapObject) => {
    if ((typeof mapObject !== 'null') && (typeof mapObject !== 'undefined')) {
        return mapObject.visible;
    } else
        console.error("[!] this map instance isn't defined...");
}
jp.Map.v3.GetMapBasemap = (mapObject) => {
    if ((typeof mapObject !== 'null') && (typeof mapObject !== 'undefined')) {
        return mapObject.getBasemap();
    } else
        console.error("[!] this map instance isn't defined...");
}
jp.Map.v3.GetMapZoom = (mapObject) => {
    if ((typeof mapObject !== 'null') && (typeof mapObject !== 'undefined')) {
        return mapObject.getZoom();
    } else
        console.error("[!] this map instance isn't defined...");
}
jp.Map.v3.GetMapMinZoom = (mapObject) => {
    if ((typeof mapObject !== 'null') && (typeof mapObject !== 'undefined')) {
        return mapObject.getMinZoom();
    } else
        console.error("[!] this map instance isn't defined...");
}
jp.Map.v3.GetMapMaxZoom = (mapObject) => {
    if ((typeof mapObject !== 'null') && (typeof mapObject !== 'undefined')) {
        return mapObject.getMaxZoom();
    } else
        console.error("[!] this map instance isn't defined...");
}

jp.Map.v3.GetMapScale = (mapObject) => {
    if ((typeof mapObject !== 'null') && (typeof mapObject !== 'undefined')) {
        return mapObject.getScale();
    } else
        console.error("[!] this map instance isn't defined...");
}

jp.Map.v3.GetMapMinScale = (mapObject) => {
    if ((typeof mapObject !== 'null') && (typeof mapObject !== 'undefined')) {
        return mapObject.getMinScale();
    } else
        console.error("[!] this map instance isn't defined...");
}
jp.Map.v3.GetMapMaxScale = (mapObject) => {
    if ((typeof mapObject !== 'null') && (typeof mapObject !== 'undefined')) {
        return mapObject.getMaxScale();
    } else
        console.error("[!] this map instance isn't defined...");
}

jp.Map.v3.GetMapLevel = (mapObject) => {
    if ((typeof mapObject !== 'null') && (typeof mapObject !== 'undefined')) {
        return mapObject.getLevel();
    } else
        console.error("[!] this map instance isn't defined...");
}

//setter methods
jp.Map.v3.SetMapVisibility = (mapObject, value) => {
    if ((mapObject !== null) && (mapObject !== undefined) &&
        ((value !== null) && (value !== undefined) && (typeof value === 'boolean'))) {
        mapObject.setVisibility(value);
    }
}
jp.Map.v3.SetMapBackgroundColor = (mapObject, value) => {
    if ((mapObject !== null) && (mapObject !== undefined) &&
        ((value !== null) && (value !== undefined))) {
        mapObject.setBackgroundColor(value);
    } else {
        console.error("[!] map instance and/or value isn't defined...");
    }
}
jp.Map.v3.SetMapZoom = (mapObject, value) => {
    if ((mapObject !== null) && (mapObject !== undefined) &&
        ((value !== null) && (value !== undefined))) {
        let deferredOp = mapObject.setZoom(value);
        deferredOp.then(() => console.log("set zoom successed..."),
            err => console.error("error occured while setting zoom : ", err));
    } else {
        console.error("[!] map instance and/or value isn't defined...");
    }
}
jp.Map.v3.SetMapScale = (mapObject, value) => {
    if ((mapObject !== null) && (mapObject !== undefined) &&
        ((value !== null) && (value !== undefined))) {
        let deferredOp = mapObject.setScale(value);
        deferredOp.then(() => console.log("set scale successed..."),
            err => console.error("error occured while setting scale : ", err));
    } else {
        console.error("[!] map instance and/or value isn't defined...");
    }
}
jp.Map.v3.SetMapLevel = (mapObject, value) => {
    if ((mapObject !== null) && (mapObject !== undefined) &&
        ((value !== null) && (value !== undefined))) {
        let deferredOp = mapObject.SetMapLevel(value);
        deferredOp.then(() => console.log("set level successed..."),
            err => console.error("error occured while setting level : ", err));
    } else {
        console.error("[!] map instance and/or value isn't defined...");
    }
}

jp.Map.v3.SetMapExtent = (mapObject, value) => {
    if ((mapObject !== null) && (mapObject !== undefined) &&
        ((value !== null) && (value !== undefined))) {
        let deferredOp = mapObject.setExtent(value);
        deferredOp.then(() => console.log("set extent successed..."),
            err => console.error("error occured while setting extent : ", err));
    } else {
        console.error("[!] map instance and/or value isn't defined...");
    }
}
jp.Map.v3.SetMapSpatialReference = (mapObject, value) => {
    if (mapObject !== null &&
        mapObject !== undefined &&
        value !== null && value !== undefined) {
        mapObject.spatialReference = value;
    } else {
        console.error("[!] map instance and/or value isn't defined...");
    }
}

jp.Map.v3.Layers.CreateDynamicMapServiceLayer = (url, setting, __callback) => {
    let dynamicServiceLayer = null;

    setting = (setting === undefined || setting === null) ? {
        id: "defaultService"
    } : setting;
    if (typeof __callback === 'function') {
        require(["esri/layers/ArcGISDynamicMapServiceLayer"], (ArcGISDynamicMapServiceLayer) => {
            dynamicServiceLayer = new ArcGISDynamicMapServiceLayer(url, setting);
            __callback(dynamicServiceLayer);
        });
    } else {
        console.error("[!] the CreateDynamicMapServiceLayer method must have defined callback function");
    }
}


jp.Map.v3.Layers.CreateImageServiceLayer = (url, setting, __callback) => {

}

jp.Map.v3.Layers.CreateImageServiceVectorLayer = (url, setting, __callback) => {

}

jp.Map.v3.Layers.CreateTiledMapServiceLayer = (url, setting, __callback) => {

}

jp.Map.v3.Layers.CreateTiledMapServiceLayer = (url, setting, __callback) => {

}

jp.Map.v3.Layers.CreateFeatureLayer = (url, setting, __callback) => {

}

jp.Map.v3.Layers.CreateGraphicLayer = (url, setting, __callback) => {

}

jp.Map.v3.Layers.CreateMapImageLayer = (url, setting, __callback) => {

}

jp.Map.v3.Layers.GetServiceLayerProperty = (url, __callback) => {

    if (typeof url !== 'null' && typeof url !== 'undifined' && typeof url === 'string' && typeof __callback === 'function') {
        const _query_string = "?f=pjson";
        let _service_property = {
            layers: [],
            spatialReference: 0,
            initialExtent: {
                xmin: 0.0,
                ymin: 0.0,
                xmax: 0.0,
                ymax: 0.0
            },
            fullExtent: {
                xmin: 0.0,
                ymin: 0.0,
                xmax: 0.0,
                ymax: 0.0
            }
        };

        let _contain_queryString = url.search("f=pjson");
        if (_contain_queryString > -1) {
            jp.Helpers.Get(url).then(results => {
                results = JSON.parse(results);
                $.each(results["layers"], (i, e) => {
                    _service_property.layers.push({
                        id: e["id"],
                        name: e["name"]
                    });
                });
                _service_property.spatialReference = results["spatialReference"]["wkid"];
                _service_property.initialExtent.xmin = results["initialExtent"]["xmin"];
                _service_property.initialExtent.ymin = results["initialExtent"]["ymin"];
                _service_property.initialExtent.xmax = results["initialExtent"]["xmax"];
                _service_property.initialExtent.ymax = results["initialExtent"]["ymax"];
                _service_property.fullExtent.xmin = results["fullExtent"]["xmin"];
                _service_property.fullExtent.ymin = results["fullExtent"]["ymin"];
                _service_property.fullExtent.xmax = results["fullExtent"]["xmax"];
                _service_property.fullExtent.ymax = results["fullExtent"]["ymax"];
                __callback(_service_property);
            }, reason => {
                console.error("the service url seems to be invalid....")
            });
        } else {
            let _normalize_url = url.split('/');
            _normalize_url[_normalize_url.length - 1] = _normalize_url[_normalize_url.length - 1].concat(_query_string);
            _normalize_url = _normalize_url.join('/');
            jp.Helpers.Get(_normalize_url).then(results => {
                results = JSON.parse(results);
                $.each(results["layers"], (i, e) => {
                    _service_property.layers.push({
                        id: e["id"],
                        name: e["name"]
                    });
                });
                _service_property.spatialReference = results["spatialReference"]["wkid"];
                _service_property.initialExtent.xmin = results["initialExtent"]["xmin"];
                _service_property.initialExtent.ymin = results["initialExtent"]["ymin"];
                _service_property.initialExtent.xmax = results["initialExtent"]["xmax"];
                _service_property.initialExtent.ymax = results["initialExtent"]["ymax"];
                _service_property.fullExtent.xmin = results["fullExtent"]["xmin"];
                _service_property.fullExtent.ymin = results["fullExtent"]["ymin"];
                _service_property.fullExtent.xmax = results["fullExtent"]["xmax"];
                _service_property.fullExtent.ymax = results["fullExtent"]["ymax"];
                __callback(_service_property);
            }, reason => {
                console.error("the service url seems to be invalid....")
            });
        }
    } else {
        console.error("[!] the url parameter must be defined and its type must be a string")
    }
}

jp.Map.v3.Tasks.CreateQuery = (setting, __callback) => {
    if (typeof setting !== 'null' && typeof setting !== 'undefined' &&
        typeof __callback !== 'null' && typeof __callback !== 'undefined' &&
        typeof __callback === 'function') {
        require(["esri/tasks/query"], (Query) => {
            let _query = new Query();
            _query.outFields = setting.outFields;
            _query.returnGeometry = setting.returnGeometry;
            _query.where = setting.where;
            __callback(_query);
        });
    } else {
        console.error("[!] the setting and/or _callback function aren't defined");
    }
}

jp.Map.v3.Tasks.ExecuteQuery = (url, queryParams, __callback, __errback) => {
    if (typeof url !== 'null' && typeof url !== 'undefined' && typeof queryParams !== 'null' &&
        typeof queryParams !== 'undefined' &&
        typeof __callback === 'function' && typeof __errback === 'function') {
        require(["esri/tasks/QueryTask"], (QueryTask) => {
            let _queryTask = new QueryTask(url);
            _queryTask.execute(queryParams, __callback, __errback);
        });
    } else {
        console.error("[!] the url, query parameter and/or _callback, _errback function aren't defined");
    }
}

jp.Init();