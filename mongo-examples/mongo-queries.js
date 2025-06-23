
// EXTRA QUERIES (FOR SHOWCASE ONLY)
// These queries were not used directly in the CRUD application, but were written and tested to demonstrate proficiency


/* INTERPOL Suspects and Crimes Information   
----------------------------------------------------------------------------
Combines suspect info from 'Green' with matching crime details (from 'Crimes')
and organization info (from 'Resources') to display detailed information about wanted suspects and their associated crimes. 
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
  { $unwind: { path: "$crime_details", preserveNullAndEmptyArrays: true } },
  { $unwind: { path: "$resource_details", preserveNullAndEmptyArrays: true } },
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

/* Query Displaying Crime Names and Penalty Years  
----------------------------------------------------------------------------
To obtain a comprehensive overview of the penalties associated with each crime.
*/

db.Crimes.find({}, { Crime_name: 1, Penalty_years: 1 });


/* Suspects Aggregation and Sorting by Nationality and Birthdate 
----------------------------------------------------------------------------
Groups suspects by nationality, then sorts them by birthdate.
*/

db.Green.aggregate([
  {
    $group: {
      _id: "$Nationality",
      suspects: {
        $push: {
          _id: "$_id",
          Name: "$Name",
          Birthdate: { $toDate: "$Birthdate" },
          Gender: "$Gender",
          Crime: "$Crime"
        }
      }
    }
  },
  { $sort: { "_id": 1 } },
  { $unwind: "$suspects" },
  { $sort: { "suspects.Birthdate": 1 } },
  {
    $group: {
      _id: "$_id",
      suspects: { $push: "$suspects" }
    }
  },
  { $sort: { "_id": 1 } }
]);


/* INTERPOL Suspect Status Update 
----------------------------------------------------------------------------
The query used to update the status of a suspect in the INTERPOL database. In 
this specific case, the suspect with the ID "S01" has been updated to a status of "Sentenced" 
with a sentence of "Sentenced to 10 years". 
*/

db.Green.updateOne(
  { _id: "S01" },
  { $set: { Status: "Sentenced", Sentence: "Sentenced to 10 years" } }
);
db.Green.find({ _id: "S01" });


/* INTERPOL Wanted Males Born After 1990  
----------------------------------------------------------------------------
Filters male suspects born after 1990, then reformats and sorts them by birthdate. 
*/

db.Red.aggregate([
  { $match: { Gender: "M" } },
  {
    $project: {
      _id: 1,
      Gender: 1,
      Nationality: 1,
      Birthdate: {
        $dateFromString: { dateString: "$Date_of_birth", format: "%Y-%m-%d" }
      }
    }
  },
  { $match: { Birthdate: { $gt: ISODate("1990-01-01T00:00:00.000Z") } } },
  { $sort: { Birthdate: 1 } },
  {
    $project: {
      _id: 1,
      Gender: 1,
      Nationality: 1,
      Birthdate: {
        $dateToString: { format: "%d/%m/%Y", date: "$Birthdate" }
      }
    }
  }
]);


/*  INTERPOL Wanted Female Count 
----------------------------------------------------------------------------
Count the number of female suspects in the Red Notice 
database. 
*/

db.Red.aggregate([
  { $match: { Gender: "F" } },
  { $count: "femaleCount" }
]);


/* Counting unidentified bodies by gender
----------------------------------------------------------------------------
Counts how many male and female unidentified bodies exist in the Black collection.
*/

db.Yellow.aggregate([
  {
    $lookup: {
      from: "Black",
      let: {
        missingPersonHeight: "$Description.Height",
        missingPersonWeight: "$Description.Weight",
        missingPersonEyes: "$Description.Eyes",
        missingPersonHair: "$Description.Hair"
      },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ["$Description.Height", "$$missingPersonHeight"] },
                { $eq: ["$Description.Weight", "$$missingPersonWeight"] },
                { $eq: ["$Description.Eyes", "$$missingPersonEyes"] },
                { $eq: ["$Description.Hair", "$$missingPersonHair"] },
                { $eq: ["$Status", "Unclaimed"] }
              ]
            }
          }
        }
      ],
      as: "matchedBody"
    }
  },
  { $unwind: "$matchedBody" },
  {
    $addFields: {
      "matchedBody.Status": "Claimed",
      "Status": "Found"
    }
  },
  {
    $project: {
      _id: "$_id",
      YellowData: {
        $mergeObjects: ["$$ROOT", "$matchedBody"]
      }
    }
  }
]);


/* Matching and merging data from collections: Yellow with Black 
----------------------------------------------------------------------------
Attempts to find unidentified bodies that match missing persons
by comparing traits like height, eyes, and hair. Updates status if a match is found.
*/

db.Yellow.aggregate([
  { $match: { Date_of_birth: { $gte: ISODate("2006-01-01") } } },
  {
    $group: {
      _id: null,
      count: { $sum: 1 },
      totalAge: {
        $sum: {
          $divide: [
            { $subtract: [ISODate(), "$Date_of_birth"] },
            31536000000
          ]
        }
      }
    }
  },
  {
    $project: {
      count: 1,
      averageAge: { $divide: ["$totalAge", "$count"] }
    }
  }
]);


/* Finding the number of missing persons aged 18 and under, in addition to the average 
age of missing minors
----------------------------------------------------------------------------
Filters missing persons aged ≤18 based on birthdate.
Calculates total count and average age.
*/

db.Black.aggregate([
  {
    $group: {
      _id: "$Cause_of_Death",
      count: { $sum: 1 }
    }
  },
  { $sort: { count: -1 } },
  { $limit: 1 }
]);

/*  Most common cause of death
----------------------------------------------------------------------------
groups the documents’ causes of death, finds the 
common/most repetitive one and returns it as a result. 
*/

db.Black.aggregate([
  {
    $group: {
      _id: "$Gender",
      count: { $sum: 1 }
    }
  }
]);
