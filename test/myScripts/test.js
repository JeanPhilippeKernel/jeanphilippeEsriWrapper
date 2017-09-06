var my_map;
$(document).ready(() => {

    jeanphilippe.Map.CreateMap("map-container", null, (result) => {
        my_map = result;
        setTimeout(() => {
            jeanphilippe.Map.SetMapZoom(my_map, 9);
            jeanphilippe.Layers.CreateDynamicMapServiceLayer("http://sampleserver5.arcgisonline.com/ArcGIS/rest/services/Energy/Geology/MapServer", null,
                (result) => jeanphilippe.Map.AddMapLayer(my_map, result));

        }, 2000);

    });

    let userListUrl = "https://jsonplaceholder.typicode.com/photos";
    jeanphilippe.Helpers.GetJson(userListUrl)
        .then(datas => console.log(datas), err => console.log(err));
});