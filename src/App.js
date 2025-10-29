import { useState } from "react";
import "./index.css";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export default function App() {
  const [friends, setFriends] = useState(initialFriends);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);

  function handleSelectedFriend(friend) {
    setSelectedFriend((cur) => (cur?.id === friend.id ? null : friend));
    setIsFormOpen(false);
  }

  function handleFormAddFriendOpen() {
    setIsFormOpen((s) => !s);
  }

  function handleAddFriend(friend) {
    setFriends((friends) => [...friends, friend]);
    setIsFormOpen(false);
  }

  function handleAddExpense(value) {
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
    setSelectedFriend(null);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          friends={friends}
          selectedFriend={selectedFriend}
          handleClick={handleSelectedFriend}
        />
        {isFormOpen && <FormAddFriend onAddFriend={handleAddFriend} />}
        <Button handleClick={handleFormAddFriendOpen}>
          {isFormOpen ? "Close" : "Add Friend"}
        </Button>
      </div>
      {selectedFriend && (
        <FormSplitBill
          selectedFriend={selectedFriend}
          onSplitBill={handleAddExpense}
        />
      )}
    </div>
  );
}

function FriendsList({ friends, handleClick, selectedFriend }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          key={friend.id}
          selectedFriend={selectedFriend}
          friend={friend}
          handleClick={handleClick}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, handleClick, selectedFriend }) {
  const { name, balance, image } = friend;
  const isSelected = name === selectedFriend?.name;
  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={image} alt={name} />
      <h3>{name}</h3>
      {balance < 0 && (
        <p className="red">
          You owe {name} {Math.abs(balance)} $
        </p>
      )}
      {balance > 0 && (
        <p className="green">
          {name} owned you {balance} $
        </p>
      )}
      {balance === 0 && <p>You and {name} are even</p>}
      <Button handleClick={() => handleClick(friend)}>
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
}

function Button({ children, handleClick }) {
  return (
    <button className="button" onClick={handleClick}>
      {children}
    </button>
  );
}

function FormAddFriend({ onAddFriend }) {
  const [name, setName] = useState("");
  const [img, setImg] = useState("https://i.pravatar.cc/48");

  function handleSubmit(e) {
    e.preventDefault();

    if (!name || !img) return;
    const id = crypto.randomUUID();
    const newFriend = {
      id: id,
      name: name,
      image: `${img}?=${id}`,
      balance: 0,
    };
    setName("");
    setImg("https://i.pravatar.cc/48");
    onAddFriend(newFriend);
  }
  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>Friend Name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <label>Image URL</label>
      <input type="text" value={img} onChange={(e) => setImg(e.target.value)} />
      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill({ selectedFriend, onSplitBill }) {
  const [bill, setBill] = useState("");
  const [myExpense, setMyExpense] = useState("");
  const [whoPaid, setWhopaid] = useState("user");
  const friendExpense = bill ? bill - myExpense : "";

  function handleSubmit(e) {
    e.preventDefault();

    if (!bill || !myExpense) return;
    onSplitBill(whoPaid === "user" ? friendExpense : -myExpense);
    setBill("");
    setMyExpense("");
    setWhopaid("user");
  }
  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split a bill with {selectedFriend.name}</h2>
      <label>Bill value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />
      <label>Your expense</label>
      <input
        type="text"
        value={myExpense}
        onChange={(e) =>
          setMyExpense(
            Number(e.target.value) > bill ? myExpense : Number(e.target.value)
          )
        }
      />
      <label>{selectedFriend.name} expense</label>
      <input type="text" disabled value={friendExpense} />
      <label>Who is paying the bill?</label>
      <select value={whoPaid} onChange={(e) => setWhopaid(e.target.value)}>
        <option value="user">You</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>
      <Button>Split Bill</Button>
    </form>
  );
}
