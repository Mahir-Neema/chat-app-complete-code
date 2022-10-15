// import logo from './logo.svg';
import React, { useRef, useState } from 'react';
import './App.css';

import firebase from 'firebase/compat/app'; 
import 'firebase/compat/firestore';
import 'firebase/compat/auth'; 

import 'firebase/compat/analytics';
import 'firebase/analytics';


import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';


firebase.initializeApp({
  apiKey: "AIzaSyDPROjbxRYg3L_amQoy-wSfT-YY8wLLe-w",
  authDomain: "chat-app-7b4b3.firebaseapp.com",
  projectId: "chat-app-7b4b3",
  storageBucket: "chat-app-7b4b3.appspot.com",
  messagingSenderId: "102608556033",
  appId: "1:102608556033:web:f97da43710c1ea813e7000",
  measurementId: "G-7LE655RWRE"
})

const auth = firebase.auth();
const firestore = firebase.firestore();
const analytics = firebase.analytics();

function App() {

  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header>
      <div className='Sign-out-btn'><SignOut /></div>
      </header>
      <section> { user ? <ChatRoom/> : <SignIn/> } </section>
    </div>
  );
}

function SignIn() {

  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return (
    <>
      <button className="sign-in" onClick={signInWithGoogle}>Sign in with Google</button>
      <p>Enjoy the new group chat app !</p>
      {/* <img className="img-logo"src="https://cdn.pixabay.com/photo/2015/11/04/18/33/paper-planes-1023097_960_720.png" alt="logo"/> */}
      <a className='github_link'  href="https://github.com/Mahir-Neema/chat-app-complete-code" target="blank"><img src="https://cdn.pixabay.com/photo/2022/01/30/13/33/github-6980894__340.png" alt="" /></a>
      <img className="img-logo"src="https://cdn.pixabay.com/photo/2020/02/19/07/16/paper-plane-4861531__340.png" alt="logo"/>
    </>
  );
}

function SignOut() {
  return auth.currentUser && (
    <button className="sign-out" onClick={() => auth.signOut()}>Sign Out</button>
  );
}



function ChatRoom() {
  const dummy = useRef();
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(2005); // messages in the chat box limit = 45

  const [messages] = useCollectionData(query, { idField: 'id' });

  const [formValue, setFormValue] = useState('');


  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;


    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })

    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  }

  return (<>
    <main>

      {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}

      <span ref={dummy}></span>

    </main>

    <form onSubmit={sendMessage}>

      <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="Say something Nice" />

      <button type="submit" disabled={!formValue}>✅</button>
    </form>
  </>);
}


function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (<>
    <div className={`message ${messageClass}`}>
      
      {/* <img src={photoURL || 'https://cdn.pixabay.com/photo/2016/08/31/11/54/icon-1633249__340.png'} alt="pp" /> */}
      <img src={uid ? photoURL : "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Circle-icons-profile.svg/512px-Circle-icons-profile.svg.png"} alt="" />
      <p>{text}</p>
    </div>
  </>);
}


export default App;
