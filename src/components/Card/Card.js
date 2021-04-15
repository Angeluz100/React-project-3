const Card = (props) => {
  async function handleDelete(placeId) {
    if (!props.state.user) return;
    const URL = `http://localhost:3001/api/places/${placeId}`;
    const places = await fetch(URL, {
      method: "DELETE",
    }).then((res) => res.json());
    props.setState((prevState) => ({
      ...prevState,
      places,
    }));
  }
  async function handleEdit(placeId) {
    const { place, comments, _id } = props.state.places.find(
      (place) => place._id === placeId
    );
    props.setState((prevState) => ({
      ...prevState,
      newPlace: {
        place,
        comments,
        _id,
      },
      editMode: true,
    }));
  }
  return props.state.places.map((s, idx) => (
    <div className="card" style={{backgroundImage:`url(${s.picture})`}}>
      <article key={idx}>
        <div>
        <div className="place">{s.place}:</div>
        <div className="comments">{s.comments}</div>
        {/* <div className="picture"><img src={s.picture} alt="places"/></div> */}
        </div>
        <div>
        {!props.state.editMode && (
          <div className="edit" onClick={() => handleEdit(s._id)}>
            {"✒️"}
          </div>
        )}
        <div className="delete" onClick={() => handleDelete(s._id)}>
          {"🚫"}
        </div>
        </div>
      </article>
    </div>
  ));
};
export default Card;