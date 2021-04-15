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
    comments: "",
    picture: ""
    },
    editMode: false
  });
  useEffect(() => {
    async function getAppData() {
      if(!state.user) return;
      try {
  
        const BASE_URL = `https://react-project3.herokuapp.com/api/places?uid=${state.user.uid}`;//change this for the second page
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
    const cancelSubscription = auth.onAuthStateChanged(user => {
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
    return function() {
      cancelSubscription();
    }
  }, [state.user]);

  async function handleSubmit(e) {
    if(!state.user) return;
    e.preventDefault();
    const BASE_URL = 'https://react-project3.herokuapp.com/api/places';
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
          comments: "",
          picture: ""
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
          comments: "",
          picture: ""   
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
        comments: "",
        picture: ""
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
      <form className="main-container"onSubmit={handleSubmit}>
        <label className="main-card">
          <span>Place</span>
          <input name="place" value={state.newPlace.place} onChange={handleChange}/>
        </label>
        <label>
          <span>Comments</span>
          <textarea name="comments" value={state.newPlace.comments} onChange={handleChange}></textarea> 
        </label>
        <label>
          <span>Picture</span>
          <input name="picture" value={state.newPlace.picture} onChange={handleChange}/>
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