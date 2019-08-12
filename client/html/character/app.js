// List of all the facial features and functions that they need to use.
const facialFeatures = {
  Sex: {
    label: "Sex",
    value: 0,
    min: 0,
    max: 1,
    increment: 1,
    func: updateSex
  }, // 0
  FatherFace: {
    label: "Father Face",
    value: 0,
    min: 0,
    max: 45,
    increment: 1,
    func: updatePlayerFace
  }, // 1
  FatherSkin: {
    label: "Father Skin",
    value: 0,
    min: 0,
    max: 45,
    increment: 1,
    func: updatePlayerFace
  }, // 2
  MotherFace: {
    label: "Mother Face",
    value: 0,
    min: 0,
    max: 45,
    increment: 1,
    func: updatePlayerFace
  }, // 3
  MotherSkin: {
    label: "Mother Skin",
    value: 0,
    min: 0,
    max: 45,
    increment: 1,
    func: updatePlayerFace
  }, // 4
  ExtraFace: {
    label: "Extra Face",
    value: 0,
    min: 0,
    max: 45,
    increment: 1,
    func: updatePlayerFace
  }, // 5
  ExtraSkin: {
    label: "Extra Skin",
    value: 0,
    min: 0,
    max: 45,
    increment: 1,
    func: updatePlayerFace
  }, // 6
  FaceMix: {
    label: "Face Mix",
    value: 0,
    min: 0,
    max: 1,
    increment: 0.1,
    func: updatePlayerFace
  }, // 7
  SkinMix: {
    label: "Skin Mix",
    value: 0,
    min: 0,
    max: 1,
    increment: 0.1,
    func: updatePlayerFace
  }, // 8
  ExtraMix: {
    label: "Third Mix",
    value: 0,
    min: 0,
    max: 1,
    increment: 0.1,
    func: updatePlayerFace
  }, // 9
  Hair: {
    label: "Hair",
    value: 0,
    min: 0,
    max: 78,
    increment: 1,
    id: 2,
    func: updateHair
  }, // 10
  HairColor: {
    label: "Hair Color",
    value: 0,
    min: 0,
    max: 78,
    id: 2,
    increment: 1,
    func: updateHair
  }, // 11
  HairHighlights: {
    label: "Hair Highlights",
    value: 0,
    min: 0,
    max: 78,
    id: 2,
    increment: 1,
    func: updateHair
  }, // 12
  HairTexture: {
    label: "Hairs Texture",
    value: 0,
    min: 0,
    max: 0,
    id: 2,
    increment: 1,
    func: updateHair
  }, // 13
  EyesColor: {
    label: "Eyes Color",
    value: 0,
    min: 0,
    max: 32,
    id: 7,
    func: updateEyes,
    increment: 1
  }, // 14
  NoseWidth: {
    label: "Nose Width",
    value: 0,
    min: -1,
    max: 1,
    increment: 0.1,
    id: 0,
    func: updateFaceFeature,
    isFaceFeature: true
  }, // 15
  NoseHeight: {
    label: "Nose Height",
    value: 0,
    min: -1,
    max: 1,
    increment: 0.1,
    id: 1,
    func: updateFaceFeature,
    isFaceFeature: true
  }, // 16
  NoseLength: {
    label: "Nose Length",
    value: 0,
    min: -1,
    max: 1,
    increment: 0.1,
    id: 2,
    func: updateFaceFeature,
    isFaceFeature: true
  }, // 17
  NoseBridge: {
    label: "Nose Bridge",
    value: 0,
    min: -1,
    max: 1,
    increment: 0.1,
    id: 3,
    func: updateFaceFeature,
    isFaceFeature: true
  }, // 18
  NoseTip: {
    label: "Nose Tip",
    value: 0,
    min: -1,
    max: 1,
    increment: 0.1,
    id: 4,
    func: updateFaceFeature,
    isFaceFeature: true
  }, // 19
  NoseBridgeShaft: {
    label: "Nose Bridge Shaft",
    value: 0,
    min: -1,
    max: 1,
    increment: 0.1,
    id: 5,
    func: updateFaceFeature,
    isFaceFeature: true
  }, //20
  BrowHeight: {
    label: "Brow Height",
    value: 0,
    min: -1,
    max: 1,
    increment: 0.1,
    id: 6,
    func: updateFaceFeature,
    isFaceFeature: true
  }, // 21
  BrowWidth: {
    label: "Brow Width",
    value: 0,
    min: -1,
    max: 1,
    increment: 0.1,
    id: 7,
    func: updateFaceFeature,
    isFaceFeature: true
  }, // 22
  CheekboneHeight: {
    label: "Cheekbone Height",
    value: 0,
    min: -1,
    max: 1,
    increment: 0.1,
    id: 8,
    func: updateFaceFeature,
    isFaceFeature: true
  }, // 23
  CheekboneWidth: {
    label: "Cheekbone Width",
    value: 0,
    min: -1,
    max: 1,
    increment: 0.1,
    id: 9,
    func: updateFaceFeature,
    isFaceFeature: true
  }, // 24
  CheekWidth: {
    label: "Cheek Width",
    value: 0,
    min: -1,
    max: 1,
    increment: 0.1,
    id: 10,
    func: updateFaceFeature,
    isFaceFeature: true
  }, // 25
  Eyelids: {
    label: "Eyelids",
    value: 0,
    min: -1,
    max: 1,
    increment: 0.1,
    id: 11,
    func: updateFaceFeature,
    isFaceFeature: true
  }, // 26
  Lips: {
    label: "Lips",
    value: 0,
    min: -1,
    max: 1,
    increment: 0.1,
    id: 12,
    func: updateFaceFeature,
    isFaceFeature: true
  }, // 27
  JawWidth: {
    label: "Jaw Width",
    value: 0,
    min: -1,
    max: 1,
    increment: 0.1,
    id: 13,
    func: updateFaceFeature,
    isFaceFeature: true
  }, // 28
  JawHeight: {
    label: "Jaw Height",
    value: 0,
    min: -1,
    max: 1,
    increment: 0.1,
    id: 14,
    func: updateFaceFeature,
    isFaceFeature: true
  }, // 29
  ChinLength: {
    label: "Chin Length",
    value: 0,
    min: -1,
    max: 1,
    increment: 0.1,
    id: 15,
    func: updateFaceFeature,
    isFaceFeature: true
  }, // 30
  ChinPosition: {
    label: "Chin Position",
    value: 0,
    min: -1,
    max: 1,
    increment: 0.1,
    id: 16,
    func: updateFaceFeature,
    isFaceFeature: true
  }, // 31
  ChinWidth: {
    label: "Chin Width",
    value: 0,
    min: -1,
    max: 1,
    increment: 0.1,
    id: 17,
    func: updateFaceFeature,
    isFaceFeature: true
  }, // 32
  ChinShape: {
    label: "Chin Shape",
    value: 0,
    min: -1,
    max: 1,
    increment: 0.1,
    id: 18,
    func: updateFaceFeature,
    isFaceFeature: true
  }, // 33
  NeckWidth: {
    label: "Neck Width",
    value: 0,
    min: -1,
    max: 1,
    increment: 0.1,
    id: 19,
    func: updateFaceFeature,
    isFaceFeature: true
  }, // 34
  Blemish: {
    label: "Blemish",
    value: 0,
    min: 0,
    max: 23,
    increment: 1,
    id: 0,
    func: updateFaceDecor,
    isFacialDecor: true
  }, // 35
  BlemishOpacity: {
    label: "Blemish Opacity",
    value: 0,
    min: 0,
    max: 1,
    increment: 0.1,
    id: 0,
    func: updateFaceDecor,
    isFacialDecor: true
  },
  FacialHair: {
    label: "Facial Hair",
    value: 0,
    min: 0,
    max: 28,
    increment: 1,
    id: 1,
    func: updateFaceDecor,
    isFacialDecor: true
  }, // 37, 2
  FacialHairOpacity: {
    label: "Facial Hair Opacity",
    value: 0,
    min: 0,
    max: 1,
    increment: 0.1,
    id: 1,
    func: updateFaceDecor,
    isFacialDecor: true
  },
  FacialHairColor: {
    label: "Facial Hair Color",
    value: 0,
    min: 0,
    max: 1,
    increment: 1,
    id: 1,
    func: updateFaceDecor,
    isFacialDecor: true
  },
  FacialHairColor2: {
    label: "Facial Hair Color 2",
    value: 0,
    min: 0,
    max: 1,
    increment: 1,
    id: 1,
    func: updateFaceDecor,
    isFacialDecor: true
  },
  Eyebrows: {
    label: "Eyebrows",
    value: 0,
    min: 0,
    max: 33,
    increment: 1,
    id: 2,
    func: updateFaceDecor,
    isFacialDecor: true
  }, // 41
  EyebrowsOpacity: {
    label: "Eyebrows Opacity",
    value: 0,
    min: 0,
    max: 1,
    increment: 0.1,
    id: 2,
    func: updateFaceDecor,
    isFacialDecor: true
  },
  EyebrowsColor: {
    label: "Eyebrows Color",
    value: 0,
    min: 0,
    max: 1,
    increment: 1,
    id: 2,
    func: updateFaceDecor,
    isFacialDecor: true
  },
  EyebrowsColor2: {
    label: "Eyebrows Color 2",
    value: 0,
    min: 0,
    max: 1,
    increment: 1,
    id: 2,
    func: updateFaceDecor,
    isFacialDecor: true
  },
  Age: {
    label: "Age",
    value: 0,
    min: 0,
    max: 14,
    increment: 1,
    id: 3,
    func: updateFaceDecor,
    isFacialDecor: true
  }, // 45
  AgeOpacity: {
    label: "Age Opacity",
    value: 0,
    min: 0,
    max: 1,
    increment: 0.1,
    id: 3,
    func: updateFaceDecor,
    isFacialDecor: true
  },
  Makeup: {
    label: "Makeup",
    value: 0,
    min: 0,
    max: 74,
    increment: 1,
    id: 4,
    func: updateFaceDecor,
    isFacialDecor: true
  }, // 47
  MakeupOpacity: {
    label: "Makeup Opacity",
    value: 0,
    min: 0,
    max: 1,
    increment: 0.1,
    id: 4,
    func: updateFaceDecor,
    isFacialDecor: true
  },
  MakeupColor: {
    label: "Makeup Color",
    value: 0,
    min: 0,
    max: 1,
    increment: 1,
    id: 4,
    func: updateFaceDecor,
    isFacialDecor: true
  },
  MakeupColor2: {
    label: "Makeup Color 2",
    value: 0,
    min: 0,
    max: 1,
    increment: 1,
    id: 4,
    func: updateFaceDecor,
    isFacialDecor: true
  },
  Blush: {
    label: "Blush",
    value: 0,
    min: 0,
    max: 6,
    increment: 1,
    id: 5,
    func: updateFaceDecor,
    isFacialDecor: true
  }, // 51
  BlushOpacity: {
    label: "Blush Opacity",
    value: 0,
    min: 0,
    max: 1,
    increment: 0.1,
    id: 5,
    func: updateFaceDecor,
    isFacialDecor: true
  },
  BlushColor: {
    label: "Blush Color",
    value: 0,
    min: 0,
    max: 1,
    increment: 1,
    id: 5,
    func: updateFaceDecor,
    isFacialDecor: true
  },
  Complexion: {
    label: "Complexion",
    value: 0,
    min: 0,
    max: 11,
    increment: 1,
    id: 6,
    func: updateFaceDecor,
    isFacialDecor: true
  }, // 54
  ComplexionOpacity: {
    label: "Complexion Opacity",
    value: 0,
    min: 0,
    max: 1,
    increment: 0.1,
    id: 6,
    func: updateFaceDecor,
    isFacialDecor: true
  },
  SunDamage: {
    label: "Sun Damage",
    value: 0,
    min: 0,
    max: 10,
    increment: 1,
    id: 7,
    func: updateFaceDecor,
    isFacialDecor: true
  }, // 56
  SunDamageOpacity: {
    label: "Sun Damage Opacity",
    value: 0,
    min: 0,
    max: 1,
    increment: 0.1,
    id: 7,
    func: updateFaceDecor,
    isFacialDecor: true
  },
  Lipstick: {
    label: "Lipstick",
    value: 0,
    min: 0,
    max: 9,
    increment: 1,
    id: 8,
    func: updateFaceDecor,
    isFacialDecor: true
  }, // 58, 22
  LipstickOpacity: {
    label: "Lipstick Opacity",
    value: 0,
    min: 0,
    max: 1,
    increment: 0.1,
    id: 8,
    func: updateFaceDecor,
    isFacialDecor: true
  },
  LipstickColor: {
    label: "Lipstick Color",
    value: 0,
    min: 0,
    max: 1,
    increment: 1,
    id: 8,
    func: updateFaceDecor,
    isFacialDecor: true
  },
  LipstickColor2: {
    label: "Lipstick Color 2",
    value: 0,
    min: 0,
    max: 1,
    increment: 1,
    id: 8,
    func: updateFaceDecor,
    isFacialDecor: true
  },
  Freckles: {
    label: "Freckles",
    value: 0,
    min: 0,
    max: 17,
    increment: 1,
    id: 9,
    func: updateFaceDecor,
    isFacialDecor: true
  }, // 62, 26
  FrecklesOpacity: {
    label: "Freckles Opacity",
    value: 0,
    min: 0,
    max: 1,
    increment: 0.1,
    id: 9,
    func: updateFaceDecor,
    isFacialDecor: true
  }
};

const dataGroups = {
  Freckles: [facialFeatures['Freckles'], facialFeatures['FrecklesOpacity']],
  Lipstick: [facialFeatures['Lipsstick'], facialFeatures['LipstickOpacity'], facialFeatures['LipstickColor'], facialFeatures['facialFeatures']],
  SunDamage: [facialFeatures['SunDamage'], facialFeatures['SunDamageOpacity']],
  Complexion: [facialFeatures['Complexion'], facialFeatures['ComplexionOpacity']],
  Blush: [facialFeatures['Blush'], facialFeatures['BlushOpacity'], facialFeatures['BlushColor']],
  Makeup: [facialFeatures['Makeup'], facialFeatures['MakeupOpacity'], facialFeatures['MakeupColor'], facialFeatures['MakeupColor2']],
  Ageing: [facialFeatures['Ageing'], facialFeatures['AgeOpacity']],
  Eyebrows: [facialFeatures['Eyebrows'], facialFeatures['EyebrowsOpacity'], facialFeatures['EyebrowsColor'], facialFeatures['EyebrowsColor2']],
  FacialHair: [facialFeatures['FacialHair'], facialFeatures['FacialHairOpacity'], facialFeatures['FacialHairColor'], facialFeatures['FacialHairColor2']],
  Blemishes: [facialFeatures['Blemish'], facialFeatures['BlemishOpacity']],
  Hair: [facialFeatures['Hair'], facialFeatures['HairColor'], facialFeatures['HairHighlights'], facialFeatures['HairTexture']],
  Face: [facialFeatures['FatherFace'], facialFeatures['FatherSkin'], facialFeatures['MotherFace'], facialFeatures['MotherSkin'], facialFeatures['ExtraFace'], facialFeatures['ExtraSkin'], facialFeatures['FaceMix'], facialFeatures['SkinMix'], facialFeatures['ExtraMix']]
}

// Setup buttons programatically for usage.
$(() => {
  for (let key in facialFeatures) {
    $("#populateButtons").append(`
			<div class="btn-group w-100 p-2 pl-3 pr-3" role="group">
				<button type="button" class="btn btn-sm btn-secondary" onclick="changeValue('${key}', false);">&lt;</button>
				<button type="button" id="button-${key}" class="btn btn-sm btn-block btn-secondary" disabled>${facialFeatures[key].label} <span class="badge badge-secondary">[${facialFeatures[key].value}/${facialFeatures[key].max}]</span></button>
				<button type="button" class="btn btn-sm btn-secondary" onclick="changeValue('${key}', true);">&gt;</button>
			</div>
  		`);
  }
});

// Updates the local facial values registered in this WebView
function changeValue(key, increment) {
  if (increment) {
    facialFeatures[key].value += facialFeatures[key].increment;
  } else {
    facialFeatures[key].value -= facialFeatures[key].increment;
  }

  // If we go above max, roll back around to min
  if (facialFeatures[key].value > facialFeatures[key].max) {
    facialFeatures[key].value = facialFeatures[key].min;
  }

  // If we go below min, roll back up to max
  if (facialFeatures[key].value < facialFeatures[key].min) {
    facialFeatures[key].value = facialFeatures[key].max;
  }

  if (facialFeatures[key].increment === 0.1) {
    facialFeatures[key].value =
      Number.parseFloat(facialFeatures[key].value).toFixed(2) * 1;
  }

  // Update the Value of the Key Pressed
  $(`#button-${key}`).html(
    `${facialFeatures[key].label} <span class="badge badge-secondary">[${
    facialFeatures[key].value
    }/${facialFeatures[key].max}]</span>`
  );

  facialFeatures[key].func(key);
}

// Change the player model / sex.
function updateSex(key) {
  alt.emit('updateSex', facialFeatures[key].value);
}

// Change the head blend data.
function updatePlayerFace(key) {
  var values = [];

  dataGroups['Face'].forEach((element) => {
    values.push(element.value);
  });

  alt.emit('updatePlayerFace', JSON.stringify(values));
}

// Update the face decor; ie. blemish, sundamage, facial hair, etc.
function updateFaceDecor(keyInfo) {
  var labelUsed = facialFeatures[keyInfo].label;
  var data = [];

  // Get the object keys from the data groups.
  Object.keys(dataGroups).forEach((key) => {
    console.log(dataGroups[key][0]['label']);

    /*

    var index = dataGroups[key].indexOf(x => x.label === labelUsed);

    console.log(index);

    if (index === -1)
      return;

    console.log('Found!?');


    /*
    // Go through each array in the data groups and check for a matching label.
    for (var i = 0; i < dataGroups[key].length; i++) {
      console.log(JSON.stringify(dataGroups[key][i]));
      /*
      if (dataGroups[key][i].label === labelUsed) {
        // Send all of the information over; since it also contains the component info.
        alt.emit('updateFaceDecor', JSON.stringify(dataGroups[key][i]));
      }
      
    }
    */
  });
}

// Update the face features such as nosewidth, height, etc.
function updateFaceFeature(key) {
  console.log(key);
}

// Update the hair for the player.
function updateHair(key) {
  console.log(key);
}

function updateEyes(key) {
  console.log(key);
}



/*
function updateSex(key) {
  alt.emit("updateSex", facialFeatures[key].value);
  setTimeout(() => {
    updatePlayerFace();
    updateHair();
    updateFacialFeatures();
    updateFacialDecor();
  }, 500);
}

// Update the player's face completely.
function updatePlayerFace(emitCall, min, max) {
  var data = [];

  Object.keys(facialFeatures).forEach((key, index) => {
    if (index > max && index < min) return;

    data.push(facialFeatures[key].value);
  });

  alt.emit(`${emitCall}`, JSON.stringify(data));

  alt.emit(
    "updateHeadBlend",
    facialFeatures[1].value,
    facialFeatures[2].value,
    facialFeatures[3].value,
    facialFeatures[4].value,
    facialFeatures[5].value,
    facialFeatures[6].value,
    facialFeatures[7].value,
    facialFeatures[8].value,
    facialFeatures[9].value
  );
}

// Update the player's facial details; nose, eyes, etc.
function updateFacialFeatures() {
  let arrayOfFaceFeatures = [];

  // Thanks superiouzz; missed the last facial feature.
  for (var i = 15; i < 35; i++) {
    arrayOfFaceFeatures.push(facialFeatures[i].value);
  }

  alt.emit(
    "updateFacialFeatures",
    facialFeatures[14].value,
    JSON.stringify(arrayOfFaceFeatures)
  );
}

// Update Hair Style, Color, and Texture
function updateHair() {
  alt.emit(
    "updateHairStyle",
    facialFeatures[10].value,
    facialFeatures[11].value,
    facialFeatures[12].value,
    facialFeatures[13].value
  );
}

function updateFacialDecor() {
  let arrayOfFacialDecor = [];

  for (var i = 35; i < facialFeatures.length; i++) {
    arrayOfFacialDecor.push(facialFeatures[i].value);
  }

  alt.emit("updateFacialDecor", JSON.stringify(arrayOfFacialDecor));
}

if ("alt" in window) {
  // Grab the Style Variations
  alt.on("stylesUpdate", (beardStyles, hairStyles, hairColors) => {
    facialFeatures[10].max = hairStyles;

    for (var i = 0; i < facialFeatures.length; i++) {
      if (facialFeatures[i].name.toLowerCase().includes("color")) {
        console.log(facialFeatures[i].name);
        facialFeatures[i].max = hairColors;
        $(`#button-${i}`).html(`
				${facialFeatures[i].name} <span class="badge badge-secondary">[${
          facialFeatures[i].value
          }/${facialFeatures[i].max}]</span>`);
      }
    }

    for (var i = 10; i < 12; i++) {
      $(`#button-${i}`).html(`
				${facialFeatures[i].name} <span class="badge badge-secondary">[${
        facialFeatures[i].value
        }/${facialFeatures[i].max}]</span>`);
    }
  });

  // Called when the player changes their hair so we can setup new hair texture variations.
  alt.on("setHairTextureVariations", hairTextureVariations => {
    facialFeatures[13].max = hairTextureVariations;
    facialFeatures[13].value = 0;

    $(`#button-13`).html(`
			${facialFeatures[13].name} <span class="badge badge-secondary">[${
      facialFeatures[13].value
      }/${facialFeatures[13].max}]</span>`);
  });
}
*/