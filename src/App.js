import { useState, useEffect } from "react";
import Header from "./components/Header/Header"
import Card from "./components/Card/Card"
import "./App.css";
import { auth } from './services/firebase';

export default function App() {
  const [state, setState] = useState({
    user: null,
    places: [],
    newPlace:{
    place: "",
    comments: ""
    },
    editMode: false
  });
  useEffect(() => {
    async function getAppData() {
      if(!state.user) return;
      try {
  
        const BASE_URL = `http://localhost:3001/api/places?uid=${state.user.uid}`;//change this for the second page
        const places = await fetch(BASE_URL).then(res => res.json());
        setState((prevState) => ({
          ...prevState,
          places,
        }));
      } catch (error) {
          console.log(error)
      }
    }
    getAppData();
    auth.onAuthStateChanged(user => {
      if(user) {
        setState(prevState => ({
          ...prevState,
          user,
        }));
      } else {
        setState(prevState => ({
          ...prevState,
          places: [],
          user,
        }));
      }   
    });
  }, [state.user]);

  async function handleSubmit(e) {
    if(!state.user) return;
    e.preventDefault();
    const BASE_URL = 'http://localhost:3001/api/places';
    if(!state.editMode) {

      const places = await fetch(BASE_URL, {
        method: 'POST',
        headers: {
          'Content-type' : 'Application/json'
        },
        body: JSON.stringify({...state.newPlace, uid: state.user.uid})
      }).then(res => res.json());
      
      setState((prevState) => ({
        places,
        newPlace:{
          place: "",
          comments: ""
        },
      }))
    } else {
      const {place, comments, _id} = state.newPlace;

      const places = await fetch(`${BASE_URL}/${_id}`, {
        method: 'PUT',
        headers: {
          'Content-type' : 'Application/json'
        },
        body: JSON.stringify({ place, comments })
      }).then(res => res.json());
      setState(prevState => ({
        ...prevState,
        places,
        newPlace: {
          place: "",
          comments: ""    
        },
        editMode: false
      }))
    }
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
 

  function handleCancel() {
    setState(prevState => ({
      ...prevState,
      newPlace: {
        place: "",
        comments: ""
      },
      editMode: false
    }))
  }

  return (
    <>
      <Header user={state.user} />
      <main>
    <section>
      <div className="card-container">
    <Card setState={setState} state={state}/>
      </div>
      {
        state.user &&
        <>
      <hr />
      <form onSubmit={handleSubmit}>
        <label>
          <span>Place</span>
          <input name="place" value={state.newPlace.place} onChange={handleChange}/>
        </label>
        <label>
          <span>Comments</span>
          <textarea name="comments" value={state.newPlace.comments} onChange={handleChange}></textarea> 
        </label>
        <button>{state.editMode ? 'Edit Place' : 'Enter New Place'}</button>
      </form>
        {state.editMode && <button onClick={handleCancel}>Cancel</button>}
      </>
      }
    </section>
      </main>
    </>
  );
}