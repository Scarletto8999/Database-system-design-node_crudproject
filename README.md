# INTERPOL MongoDB CRUD Application

This project was developed by a collaborative team of Software Engineering students at Altınbaş University as part of the Database System Design (SWE228) course, supervised by Dr. Youcef Benferdia.

**Team Members**  
- Firdos Muhammad Abdi  
- Haneen Alobaidi  
- Masarrah Enriquez Al Delemi  
- Masa Soudan
- Redan Abd Elkhalik  

This is a MongoDB-based CRUD application inspired by the INTERPOL notice system. It simulates how international law enforcement agencies manage records of wanted individuals, crimes, missing persons, and other criminal data.

The application focuses on one primary collection: `Red`, which represents wanted suspects.


##  Core Features

- Create, Read, Update, and Delete operations on the `Red` collection
- Backend: **Node.js + Express**
- Database: **MongoDB** (using **Mongoose**)
- Frontend: **EJS Templates**
- Realistic mock data inspired by INTERPOL and FBI listings

📁 Project Structure

/mongo-examples/
interpol-collection-red.js // Main data for CRUD app (Red collection)
interpol-other-collections.js // These collections were added for learning purposes only and to fulfill the concept of working with interpol-style international data.
mongo-queries.js // were not used directly in the CRUD application, but were written and tested to demonstrate proficiency

// Only the `Red` collection is connected to the app. Other files are for demonstration and academic enhancement.
These files are **not part of the live app logic**, but included to demonstrate our use of:
- Aggregations (`$lookup`, `$unwind`, `$group`)
- Realistic INTERPOL-style document structure
- Data enrichment from multiple sources


##  Technologies Used

- MongoDB
- Node.js
- Express.js
- Mongoose
- EJS (for frontend templates)
- MongoDB Compass (for testing and verification)

##  Source & Context

This project is based on academic research, inspired by:
- INTERPOL public notices
- FBI wanted databases
- Real-world missing persons and crime datasets
The goal is to create a scalable, clear, and responsible way of storing and querying global law enforcement data.

##  Note  

- The additional collections and queries are not part of the live app but were created to fulfill the academic goal of working with realistic MongoDB data.
- The app is designed for educational purposes and does not connect to any real law enforcement system.
