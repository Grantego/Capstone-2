import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Root from './routes/root';
import AutoFillBar, {action as searchAction} from './components/AutoFillBar';
import ErrorPage from './error-page';
import LoginForm, {action as loginAction} from './routes/LoginForm';
import RegisterForm, {action as registerAction} from './routes/RegisterForm';

import ChordPage, {loader as chordsLoader} from './routes/ChordPage';
import ChordDetails, {loader as chordDetailsLoader} from './routes/ChordDetails';

import SongMain, {loader as userSongsLoader} from './routes/SongMain';
import NewSong, {action as addSongAction} from './routes/NewSong';
import SongDetail, {loader as songDetailsLoader, action as songDetailActions} from './routes/SongDetail';

import 'bootstrap/dist/css/bootstrap.min.css';


const router = createBrowserRouter([
  {
    path: "/",
    element: <Root/>,
    errorElement: <ErrorPage/>
  },
  {
    path: "/login",
    element: <LoginForm/>,
    errorElement: <ErrorPage/>,
    action: loginAction
  },
  {
    path: "/signup",
    element: <RegisterForm/>,
    errorElement: <ErrorPage/>,
    action: registerAction
  },
  {
    path: "/chords",
    element: <ChordPage/>,
    errorElement: <ErrorPage/>,
    action: searchAction,
    loader: chordsLoader,
    children: [
      {
        path: "/chords/:name",
        element: <ChordDetails/>,
        errorElement: <ErrorPage/>,
        loader: chordDetailsLoader
      }
    ]
  },
  {
    path: "/:username",
    element: <SongMain/>,
    errorElement: <ErrorPage/>,
    loader: userSongsLoader,
    children: [
      {
        path: "/:username/new",
        element: <NewSong/>,
        errorElement: <ErrorPage/>,
        loader: chordsLoader,
        action: addSongAction
      },
      {
        path: "/:username/:id",
        element: <SongDetail/>,
        errorElement: <ErrorPage/>,
        loader: songDetailsLoader,
        action: songDetailActions
      }
    ]
  }
])
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router = {router}/>
  </React.StrictMode>,
)
