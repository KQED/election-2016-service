module.exports = {
  //array of desired race ids from SF gov spreadsheet
  sfgovContestId: ["21","22","23","24","25"],
  sfgovDescription: {
    "Local Measure A": "Public health and safety bond",
    "Local Measure B": "Park, rec and open space fund",
    "Local Measure C": "Affordable housing requirements",
    "Local Measure D": "Office of citizen complaints",
    "Local Measure E": "Paid sick leave"
  },
  //maps races in districts to county for filtering on frontend
  districtToCounties: {
    "U.S. House" : {
      "District 2": ["Del Norte", "Humboldt", "Trinity", "Mendocino", "Sonoma", "Marin"],
      "District 3": ["Glenn", "Lake", "Colusa", "Yolo", "Solano", "Sutter", "Yuba", "Sacramento"],
      "District 5": ["Napa", "Sonoma", "Lake"],
      "District 11": ["Contra Costa"],
      "District 12": ["San Francisco"],
      "District 13": ["Alameda"],
      "District 14": ["San Francisco", "San Mateo"],
      "District 15": ["Alameda",  "Contra Costa"],
      "District 17": ["Alameda",  "Santa Clara"],
      "District 18": ["San Mateo", "Santa Clara", "Santa Cruz"],
      "District 19": ["Santa Clara"],
      "District 20": ["Monterey", "San Benito", "Santa Clara", "Santa Cruz"]
    },
    "State Senate": {
      "District 3": ["Contra Costa", "Napa", "Sacramento", "Solano", "Sonoma", "Yolo"],
      "District 7": ["Alameda",  "Contra Costa"],
      "District 9": ["Alameda",  "Contra Costa"],
      "District 11": ["San Francisco",  "San Mateo"],
      "District 13": ["San Mateo",  "Santa Clara"],
      "District 15": ["Santa Clara"],
      "District 17": ["Monterey", "San Luis Obispo", "Santa Clara", "Santa Cruz"]
    },
    "State Assembly": {
      "District 2": ["Del Norte", "Humboldt", "Mendocino", "Sonoma", "Trinity"],
      "District 4": ["Colusa", "Lake", "Napa", "Solano", "Sonoma", "Yolo"],
      "District 10": ["Marin",  "Sonoma"],
      "District 11": ["Contra Costa", "Sacramento", "Solano"],
      "District 14": ["Contra Costa",  "Solano"],
      "District 15": ["Alameda",  "Contra Costa"],
      "District 16": ["Alameda",  "Contra Costa"],
      "District 17": ["San Francisco"],
      "District 18": ["Alameda"],
      "District 19": ["San Francisco",  "San Mateo"],
      "District 20": ["Alameda"],
      "District 22": ["San Mateo"],
      "District 24": ["San Mateo",  "Santa Clara"],
      "District 25": ["Alameda",  "Santa Clara"],
      "District 27": ["Santa Clara"],
      "District 28": ["Santa Clara"],
      "District 29": ["Monterey", "Santa Clara", "Santa Cruz"],
      "District 30": ["Monterey", "San Benito", "Santa Clara", "Santa Cruz"]
    }
  },
  //filter for only desired AP races
  raceFilter: {
    "U.S. House": ["District 2", "District 3", "District 5", "District 11",
    "District 12", "District 13", "District 14", "District 15", "District 17",
    "District 18", "District 19", "District 20"],
    "State Senate": ["District 3", "District 7", "District 9", "District 11",
    "District 13", "District 15", "District 17"],
    "State Assembly": ["District 2", "District 4", "District 10", "District 11", 
    "District 14", "District 15", "District 16", "District 17", "District 18",
    "District 19", "District 20", "District 22", "District 24", "District 25",
    "District 27", "District 28", "District 29", "District 30"]
  }
};
