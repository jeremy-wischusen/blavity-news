# Blavity Coding Exercise

## Choice of Technologies
* NodeJS - Chosen since it is ubiquitous and if you want to actually run this, should be simple for you to do so. It is also easy to install packages for connecting to MongoDB and other databases. 
* IndexedDB - Wanted to see what working with this was like. 
* VueJS - Compared to React or Angular, this is lighter weight and has a better and faster virtual dom model.  
* VuetifyJS - Lots of nice prebuilt UI components. Makes building the UI faster and handles reactive layout for you.
* axios - For making ajax calls from the front end UI to REST endpoints.  

## Approach
Since this is a simple application, I am using the same node server for both the front end and back end. The / route sends back a static HTML page that includes the Vue, Vuetify and axios scripts as well as some icon libraries via CDN networks. The frontend uses axios to make ajax calls to load and save data. In this version, the database is browser based using IndexedDB.   

On the backend, node and express are used to access the https://newsapi.org/.

## Running the App
Open a terminal and cd to the root project directory and run:
```bash
npm start
```         
The main site page should then load at http://localhost:3000/

### What you can do
When the page loads, a list of articles will display. If you have saved favorites, these will display in a separate section on the right.  
* Click on a link to open the article in a new window. 
* Click the heart icon to save an article. These will display in the saved articles section (only shows if you have at least one saved article). 
* Click on trash can icon to delete a saved article. If you have no more saved articles, the section will hide.   
  
