function showFloorNumber() {
  if (v["prev_floor"] != v["floor"]) {
    PICTURE(11, { pos: [380, 20], img: [1, 2], opacity: 50, time: 1000 });
    PICTURE(12, { pos: [387, 35], text: v["floor"] + "階", time: 1000 });
  }
  v["prev_floor"] = v["floor"];
}
