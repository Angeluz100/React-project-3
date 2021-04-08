import { useState, useEffect } from "react";
import Header from "./components/Header/Header"
import "./App.css";

import { auth } from ".//services/firebase";

export default function App() {
  const [state, setState] = useState({
    user: null,
    places: [{ place: "Whitehaven Beach", Comments: "Paradise in Australia" }],
    newPlace: {
      place: "",
      comments: "",
    },
  });

  async function getAppData() {
    const BASE_URL = 'http://localhost:3001/api/skills';
    const places = await fetch(BASE_URL).then(res => res.json());
    setState((prevState) => ({
      ...prevState,
      places,
    }))
  }

  useEffect(() => {
    getAppData();
    auth.onAuthStateChanged(user => {
        setState(prevState => ({
          ...prevState,
          user,
        }))   
    })
  }, []);


  async function addPlace(e) {
    if (!state.user) return;
    e.preventDefault();
    const BASE_URL = 'http://localhost:3001/api/skills';
    const place = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-type': 'Application/json'
      },
      body: JSON.stringify(state.newPlace)
    }).then(res => res.json());
    setState((prevState) => ({
      places: [...prevState.places, place],
      newPlace: {
        place: "",
        comments: "",
      },
    }));
  }

  function handleChange(e) {
    setState((prevState) => ({
      ...prevState, 
      newPlace: {
        ...prevState.newPlace,
        [e.target.name]: e.target.value 
      }
    })) 
  }

  return (
    <>
    <h1>hello world</h1>
      {/* <Header user={state.user} />
    <main> 
    <section>
      {state.places.map((s) => (
        <article key={s.place}>
          <div>{s.place}</div> <div>{s.comments}</div>
        </article>
      ))}
      {
        state.user &&
        <>
      <hr />
      <form onSubmit={addPlace}>
        <label>
          <span>Place</span>
          <input name="Place" value={state.newPlace.place} onChange={handleChange} />
        </label>
        <label>
          <span>Cooments</span>
          <select name="Comments" value={state.newPlace.comments} onChange={handleChange} >
          </select>
        </label>
        <button>Enter New Palce</button>
      </form>
      </>
      }
    </section>
  </main> */}
    </>
  );
}