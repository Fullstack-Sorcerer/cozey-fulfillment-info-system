# Fulfillment Information Service
With this service, our warehouse team can get the picking and packing lists they need with a few button clicks! No more manually sifting through raw order data📜

### Here's where you'll find the functionality

* List of all items to pick for the day (workflow #1) at ``` /pickingpage ```
* List of order information for packing (workflow #2) at ``` /packingpage ```

On each of these pages, the warehouse team simply needs to select a date and click Submit. So, the team can seek picking/packing information from anytime in the past.

### How to set it up

1. Clone the project to your local environment
2. Ideally use Node.js Jod (22.14.0)
3. As the project uses the Yarn package manager, run ```yarn start``` to simultaneously start the front and backends.

### Note on project structure
* The Express-based backend is located in ```/backend```
  - Project data is located in /backend/src/data/ as .json files
* The React/Next.js frontend is located in ```/frontend```
Both the frontend and backend can also be started separately. Please refer to their READMEs for details.

Thank you for your consideration and I sincerely look forward to the next stages with Cozey! 🛋️🚀

