import { useState, useEffect } from "react";
import Header from "./components/Header/Header"
import "./App.css";
import { auth } from './services/firebase';

export default function App() {
  const [state, setState] = useState({
    user: null,
    places: [{ place: "Grand Canyon", comments: "3" }],
    newPlace:{
    place: "",
    comments: ""
    },
  });
  async function getAppData() {
    const BASE_URL = 'http://localhost:3001/api/places';//change this for the second page
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
          user
        }));
    })
  }, [])

  async function addPlace(e) {
    if(!state.user) return;
    e.preventDefault();
    const BASE_URL = 'http://localhost:3001/api/places';
    const place = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-type' : 'Application/json'
      },
      body: JSON.stringify(state.newPlace)
    }).then(res => res.json());

    setState((prevState) => ({
      places: [...prevState.places, place],
      newPlace:{
        place: "",
        comments: ""
      },
    }))
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
      <Header user={state.user} />
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
          <input name="place" value={state.newPlace.place} onChange={handleChange}/>
        </label>
        <label>
          <span>Comments</span>
          <textarea name="comments" value={state.newPlace.comments} onChange={handleChange}> </textarea>
        </label>
        <button>Enter Place</button>
      </form>
      </>
      }
    </section>
      </main>
    </>
  );
}