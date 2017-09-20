var my_map;
$(document).ready(() => {

    // jp.Map.CreateMap("map-container", null, (result) => {
    //     my_map = result;
    //     setTimeout(() => {
    //         jp.Map.SetMapZoom(my_map, 9);
    //         jp.Layers.CreateDynamicMapServiceLayer("http://sampleserver5.arcgisonline.com/ArcGIS/rest/services/Energy/Geology/MapServer", null,
    //             (result) => jp.Map.AddMapLayer(my_map, result));

    //     }, 2000);

    // });

    let userListUrl = "https://jsonplaceholder.typicode.com/photos";
    jp.Helpers.Get(userListUrl).then(datas => console.log(datas), err => console.log(err));
});