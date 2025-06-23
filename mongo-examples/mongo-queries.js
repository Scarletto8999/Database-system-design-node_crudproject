// =======================
// MongoDB Aggregation Queries
// =======================

/*
1) Interpol Suspects and Crimes Information
-------------------------------------------
This aggregation joins suspects from the Green collection with their Crimes and Resources.
*/

db.Green.aggregate([
  {
    $lookup: {
      from: "Crimes",
      localField: "Crime",
      foreignField: "Crime_name",
      as: "crime_details"
    }
  },
  {
    $lookup: {
      from: "Resources",
      localField: "Resource",
      foreignField: "organizationID",
      as: "resource_details"
    }
  },
  {
    $unwind: { path: "$crime_details", preserveNullAndEmptyArrays: true }
  },
  {
    $unwind: { path: "$resource_details", preserveNullAndEmptyArrays: true }
  },
  {
    $project: {
      _id: 1,
      Name: 1,
      Birthdate: 1,
      Gender: 1,
      Nationality: 1,
      Description: 1,
      Status: 1,
      Resource: "$resource_details.Organization_Name",
      Crime: { $ifNull: ["$crime_details.Crime_name", "No Crime Data found"] },
      Crime_Description: { $ifNull: ["$crime_details.Description", "No Description found"] },
      Penalty_years: { $ifNull: ["$crime_details.Penalty_years", "No Penalty found"] },
      Crime_type: { $ifNull: ["$crime_details.Crime_type", "No Type found"] }
    }
  }
]);

/*
2) Displaying Crime Names and Penalty Years
-------------------------------------------
*/
db.Crimes.find({}, { Crime_name: 1, Penalty_years: 1 });
