import React, { useEffect, useState } from 'react';

import '../App.css'; // * Two dots jump OUT of 'components' and INTO 'src'



function App() {
    const[getData, setGetData] = useState(null) // ? variable to store the data from backend
    const [activeDescription, setActiveDescription] = useState(""); // ? bollean variable for the description to apear/disapear
  



    // ! Function get data from backend
    useEffect(() => { // * using use effect makes it so it starts on load.
        fetch(`https://portugalaqi.onrender.com`) // * call backend (on render!!)
            .then(response => response.json()) // * once we get an answer get the response and convert it to json
            .then(data => setGetData(data)) // * name the rsponse.json data and add it to getData using setGetData

    }, []); // * empty array means once on load, if we had a variable inside it it would run every time the variable changes update with the new data.(to be changed)

     

 // ! Function get aqi info
    function handleCityInfo(cityName){
        if(!getData) return "Loading..."; // * if we dont have the data yet return Loading...


        // * Scan the list from Flask to find the city that matches this block
        // * We use .find() to loop through the objects until the city name matches
        // * .toLowerCase() and .trim() ensure the match works even if there are extra spaces from the split(",")
        const result = getData.find(i => i.city.toLowerCase().trim() === cityName.toLowerCase());

        if (result) { 
             if (result.aqi === "-") { // * if the aqi is "-" it means theres no data so we return no data.
                return (
                    <div>
                        <strong>No Data</strong>
                    </div>
                );
            }



            const aqiNum = (result.aqi); // * call result.aqi and store it in a variable to use it to determine the color of the number
            let nColor = "#00c621"; // Default Green
            
            if (aqiNum > 100) nColor = "#ff0000";      // Red
            else if (aqiNum > 50) nColor = "#ff7e00";  // Orange
            else if (aqiNum > 30) nColor = "#e7d724";  // Yellowish

            return (
                <div>
                    <strong style={{ color: nColor }}>{result.aqi}</strong>
                </div>
        )}
        return "No data"; // * else say there is no data on the aqi.
    }


    // ! function to get description on click.
    function handleDescription(cityID){
        if (!getData) return "Loading...";


        const result = getData.find(i => i.city.toLowerCase().trim() === cityID.toLowerCase());

        if (result) {
            //* instead of returningm we "store it" to our state (so activeDescription becomes whatever the descritpion is)
            setActiveDescription(result.description);
        } else {
            setActiveDescription("Could not find description.");
        }
      }





// ! RETURN
  return (
    <div className="main-dashboard">
      <h1>Portugal Air Quality</h1>


      {/* ! Info Box */}

      {activeDescription && ( // * if activeDescription inst empty, show the info box with the description and a close button.
      <div className="info-box"> 
         <p>{activeDescription}</p>
         <button id='closeButton' onClick={() => setActiveDescription("")}>X</button> {/* * close button works by setting activeDescription to "" */ }
      </div>
      )}


     {/* ! City Blocks */}

      {/* Braga  */}
      <div 
      className="aqi-block" id="braga">
      <button className='button' onClick={() => handleDescription("Braga")}> <h3>Braga</h3> </button>  {/* * works by setting active description to braga. */}
      {handleCityInfo("Braga")}
      </div>
      
      {/*Guimaraes */}
      <div 
      className="aqi-block" id="guimaraes">
        <button className='button' onClick={() => handleDescription("Guimar\u00e3es")}> <h3>Guimaraes</h3> </button>
      {handleCityInfo("Guimar\u00e3es")} {/* * in the backend its called Guimar\u00e3es because of the ã, but it works because we use toLowerCase and trim to match it. */}
      </div>

      {/* Vila Real */}
      <div className="aqi-block" id="vila-real">
        <button className='button' onClick={() => handleDescription("Vila Real")}> <h3>Vila Real</h3> </button>
        {handleCityInfo("Vila Real")}
      </div>

      {/* Porto */}
      <div className="aqi-block" id="porto">
        <button className='button' onClick={() => handleDescription("Porto")}> <h3>Porto</h3> </button>
        {handleCityInfo("Porto")}
      </div>

      {/* Aveiro District Group */}
      <div className="aqi-block" id="santiais">
        <button className='button' onClick={() => handleDescription("Santiais")}> <h3>Santiais</h3> </button>
        {handleCityInfo("Santiais")}
      </div>
         
      <div className="aqi-block" id="espinho">
        <button className='button' onClick={() => handleDescription("Espinho")}> <h3>Espinho</h3> </button>
        {handleCityInfo("Espinho")}
      </div>

      {/* Viseu */}
      <div className="aqi-block" id="viseu">
        <button className='button' onClick={() => handleDescription("Viseu")}> <h3>Viseu</h3> </button>
        {handleCityInfo("Viseu")}
      </div>

      {/* Coimbra */}
      <div className="aqi-block" id="coimbra">
        <button className='button' onClick={() => handleDescription("Coimbra")}> <h3>Coimbra</h3> </button>
        {handleCityInfo("Coimbra")}
      </div>

      {/* Leiria */}
      <div className="aqi-block" id="leiria">
        <button className='button' onClick={() => handleDescription("Leiria")}> <h3>Leiria</h3> </button>
        {handleCityInfo("Leiria")}
      </div>

      {/* Lisbon */}
      <div className="aqi-block" id="lisboa">
        <button className='button' onClick={() => handleDescription("R Filipe Da Mata")}> <h3>Lisboa</h3> </button>
        {handleCityInfo("R Filipe Da Mata")} {/* * in the backend its called R Filipe da MATA */}
      </div>

      {/* Setubal */}
      <div className="aqi-block" id="seixal">
        <button className='button' onClick={() => handleDescription("Seixal")}> <h3>Seixal</h3> </button>
        {handleCityInfo("Seixal")}
      </div>

      {/* Faro */}
      <div className="aqi-block" id="faro">
        <button className='button' onClick={() => handleDescription("Faro")}> <h3>Faro</h3> </button>
        {handleCityInfo("Faro")}
      </div>
      
    </div> // ! This now correctly closes the main-dashboard
  );
};

export default App;