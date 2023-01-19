mapboxgl.accessToken = mapToken

const point = campground.geometry.coordinates.length
   ? campground.geometry.coordinates
   : // : [7.2620, 43.7102]
     // : [69.420, 80.08135]
     [139.5577317304603, 35.70407437075822]

const map = new mapboxgl.Map({
   container: "map", // container ID
   style: "mapbox://styles/mapbox/dark-v11", // style URL
   center: point, // starting position [lng, lat]
   zoom: 9, // starting zoom
})

const popup = new mapboxgl.Popup().setHTML(`<code style="color: black;">${campground.title}</code>`)

new mapboxgl.Marker({ color: "#6F2CF4" }).setLngLat(point).setPopup(popup).addTo(map)
